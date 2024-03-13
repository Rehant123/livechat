import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    gender:{
        type:String,
        enum:["Male","Female"],
        default:"Male"
    },
    profilePic:{
        type:String
    }
},{
    timestamps:true
});

export default mongoose.model('User', userSchema);