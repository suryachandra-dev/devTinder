const mongoose=require("mongoose");
const validator=require("validator");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20,
        index:true,
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id")
            } 
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is weak")
            }
        }
    },
    age: {
        type: Number,
        min: [18, "Age must be at least 18 years old."], // ✅ Custom error message
    }
    ,
    gender:{
        type:String,
        //Option 1 to validate the value
        // validate(value){
        //     if(!["male","female","other"].includes(value.toLowerCase())){
        //         throw new Error("Invalid Gender");
        //     }
        // },
        //Option 2 to validate the value
        enum:{
           values: ["male","female","other"],
           message:`{VALUE} is incorrect gender type`
        }
    },
    isPremium:{
        type:Boolean,
        default:false
    },
    memberShipType:{
        type:String,
    },
    photourl:{
        type:String,
        // default:"https://www.mpgi.edu.in/wp-content/uploads/2024/01/13testi_dummy-convert.io_.webp",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL"+value)
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about section"
    },
    skills:{
        type:[String]
    },
    
},{timestamps:true});
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

// userSchema.index({firstName:1,lastName:1});//This is used to create a compound index on firstName and lastName fields.

//We use regular function instead of a arrow function because we need the this.And this refers to which user has called the getJWT method.
userSchema.methods.getJWT=async function(){
    const user=this;
        //create a JWT Token
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    const token=await jwt.sign({ _id: user._id }, "DEVTinder&26022025",{expiresIn:"1d"}); //Server generates token with jwt.sign.
    return token;
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const hashedPassword=user.password;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,hashedPassword);//bcrypt.compare takes two arguments.1st is the password which is entered by the user and 2nd is the hashedPassword which is stored in the database.
    return isPasswordValid;
}

//I want User Model for userSchema.Model is like a class which starts with a capital letter.Using User Model you can create new instances of that model.
//Ex:const user1=new userModel({firstName:"Rahul",lastName:"Sharma",emailId:"rahul@gmail.com",password:"rahul123",age:23,gender:"Male"});
module.exports=mongoose.model("User",userSchema);