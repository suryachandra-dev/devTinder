const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,//Automatically converts emails to lowercase
        trim:true,//Automatically removes extra spaces from the beginning and end of the string
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        //Option 1 to validate the value
        // validate(value){
        //     if(!["male","female","other"].includes(value.toLowerCase())){
        //         throw new Error("Invalid Gender");
        //     }
        // },
        //Option 2 to validate the value
        enum:["male","female","other"],
    },
    photourl:{
        type:String,
        default:"https://www.mpgi.edu.in/wp-content/uploads/2024/01/13testi_dummy-convert.io_.webp"
    },
    about:{
        type:String,
        default:"This is a default about section"
    },
    skills:{
        type:[String]
    },
    
},{timestamps:true});
//function to convert date to IST
function toIST(date){
    return new Date(date.getTime()+(5.5*60*60*1000))
}
//pre-update hook to adjust updatedAt to IST
userSchema.pre('findOneAndUpdate',function(next){
    this.set({updatedAt: toIST(new Date())});
    next();
});
//I want User Model for userSchema.Model is like a class which starts with a capital letter.Using User Model you can create new instances of that model.
//Ex:const user1=new userModel({firstName:"Rahul",lastName:"Sharma",emailId:"rahul@gmail.com",password:"rahul123",age:23,gender:"Male"});
module.exports=mongoose.model("User",userSchema);