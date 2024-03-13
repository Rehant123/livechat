import User from "../models/user.model.js"
export const getUsersForSidebar = async(req,res)=>{
    try{
        const loggedInUserId = await req.user_id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        //find all users except the one that is equal to users
        res.status(200).json(filteredUsers)
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Internal Server Error'});
    }
}