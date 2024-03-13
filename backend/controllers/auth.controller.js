import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

const login = async(req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        //ab hme user milgya iske password ko compare krlo
        
        console.log(password);
        const isPasswordCorrect =  bcryptjs.compare(password,user?.password);
        res.status(isPasswordCorrect)
        console.log(isPasswordCorrect)
        if(!user||!isPasswordCorrect) return res.status(400).json({error:"Invalid password or username"});

        generateTokenAndSetCookie(user._id,res);

       return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic,
            gender:user.gender
        })


     

        // const isPasswordCorrect = await bcryptjs.compare(password,user?.password||"");
        // if(!user||!isPasswordCorrect){
        //     return res.status(401).json({error:"Invalid Credentials"});
        // }
        
        // generateTokenAndSetCookie(user._id,username);


    }
    catch(error){
        console.log("Error in signup controller: " + error);
        res.status(500).json({error:'Internal Server Error'});
    }
}

// auth.js
const signup = async (req, res)=>{
   try{
    const {fullName,username,password,confirmPassword,gender} = req.body;
    if(password!==confirmPassword){
        res.status(400).send("Passwords do not match");
    }

    const user = await User.findOne({ password});
    if(user){
        return res.status(400).json({error:'User already exists'});
    }
//hash the password

const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash(password,salt);


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic:gender=='Male' ? boyProfilePic:girlProfilePic
           
        }) 
        if(newUser){
            //generate JWT token
            generateTokenAndSetCookie(newUser._id,res);

            await newUser.save();
            return res.status(201).json({_id:newUser._id,fullName:newUser.fullName,username:newUser.username,
                profilePic:newUser.profilePic,gender:newUser.gender});
    
    
        }else{
            res.status(400).json({error:"Invalid user data"})
        }
        
   }catch(error){
    console.log("Error in signup controller: " + error);
    res.status(500).json({error:'Internal Server Error'});
   }
}
 const logout = (req, res) => {
    try{
        res.cookie('jwt','',{
            maxAge:0
        })
        res.status(200).json({message:"User logged out successfully"})
        
    
    }
    catch(error){
        console.log("Error in logout controller: " + error.message);
        res.status(500).json({error:'Internal Server Error'});
    }
    
};

export {login,logout,signup}