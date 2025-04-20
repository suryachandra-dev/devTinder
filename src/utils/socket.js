const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/chat");
const getSecretRoomId = (roomId) => {
    return crypto.createHash("sha256").update(roomId).digest("hex");
}
const initializeSocket = (server) => {
    //Socket code

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173", // Allow requests only from this origin (your frontend)
            credentials: true,               // ✅ Allow browser to send/receive cookies
        }
    });
    io.on("connection", (socket) => {
        //Handle Events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const tempRoomId = [userId, targetUserId].sort().join("_");
            const roomId = getSecretRoomId(tempRoomId);
            console.log(firstName + 'Joined room roomId: ', roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, newMessage }) => {
            const tempRoomId = [userId, targetUserId].sort().join("_");
            const roomId = getSecretRoomId(tempRoomId);
            // Emit the message to the recipient's room
            // ✅ Only sockets in that room receive the message.
            // ❌ No one else sees it, even if they’re also connected to the server.
            //Save message to database
            try {
                let chat = await chatModel.findOne({ participants: { $all: [userId, targetUserId] } });
                if (!chat) {
                    // Create a new chat if it doesn't exist
                    chat = new chatModel({
                        participants: [userId, targetUserId],
                        messages: [{ senderId: userId, content: newMessage }]
                    });
                } else {
                    // If chat exists, push the new message to the messages array
                    chat.messages.push({ senderId: userId, content: newMessage });
                }
                await chat.save();
                // console.log("Message saved to database: ", chat);
                const latestMessage = chat?.messages[chat?.messages.length - 1];

                io.to(roomId).emit("receivedMessage", {
                    firstName,
                    lastName,
                    newMessage,
                    createdAt: latestMessage?.createdAt || null, // ✅ Send timestamp
                });
            } catch (err) {
                console.log(err);
            }


        });
        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.id);
        });

    })
}
module.exports = { initializeSocket };