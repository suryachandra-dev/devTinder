const express = require('express');
const chatModel = require('../models/chat');
const { userAuth } = require('../middlewares/auth');
const chatRouter = express.Router();
chatRouter.get('/:targetUserId',userAuth, async (req, res) => {
    const { targetUserId} = req.params;
    const userId=req.user._id;
    try {
        let chat=await chatModel.findOne({participants:{$all:[userId,targetUserId]}}).populate({
            path:"messages.senderId",
            select:"firstName lastName"
        });
        if(!chat){
            // Create a new chat if it doesn't exist
            chat = new chatModel({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
        }
        res.json(chat);
    }catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

});
module.exports = { chatRouter };