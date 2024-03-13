

import  Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
export const sendMessage = async (req, res) => {
try{
    const {message} = req.body;
    const {id:recieverId} = req.params;

    //get sender id of the current user
    const senderId = req.user_id;

    let conversation = await Conversation.findOne({
        participants:{$all :[senderId,recieverId]}
    })
    if(!conversation){
        //start of a new conversation
        conversation = await Conversation.create({
            participants:[senderId,recieverId]
        })
    }
    const newMessage = new Message({
        senderId,
        recieverId,
        message
    })
    if(newMessage){
        conversation.message.push(newMessage._id);
    }
    res.status(200).json(newMessage);
    
    await Promise.all([conversation.save(),newMessage.save()])

    }catch(e){
       
        res.status(500).json({error:'Internal Server Error'});
    }
 };
 export const getMessages = async function(req,res){
    try{
        const {id:userToChatId  } = req.params;
        const senderId = req.user_id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]}
            //remember we had    message:[
        //{type:mongoose.Schema.Types.ObjectId,
          //  ref:"Message",
         //default:[],
    //}

        }).populate("message");

        if(!conversation)
        return res.status(200).json([]);
    // const message = conversation.message;
    const message = conversation.message;
    res.status(200).json(message);
    }catch(e){
        res.status(500).json({error:'Internal Server Error'});
    }
 }