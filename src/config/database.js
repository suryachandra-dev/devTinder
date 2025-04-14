const mongoose=require("mongoose");
// When you declare a function with async, it automatically returns a promise, even if you don’t use a return statement. The promise returned by an async function is resolved with the return value of the function, or rejected with an exception thrown from the function.
const connectDB=async ()=>{
    await mongoose.connect(process.env.DB_CONNECT_STRING
    )
};
module.exports=connectDB;
