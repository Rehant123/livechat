import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (userId,res)=>{

    //generate a jwt token with user id payload
    //jwt.sign({payload},sign the token with this,{})
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })
    res.cookie("jwt",token,{
        maxAge:60000*60*24*15, // 15 days 
        httpOnly:true,// prevents xss attacks 
        sameSite:"strict",// prevents csrf attack cross site forgery attacks
      
        secure:process.env.NODE_ENV !== 'developement',

    })
}

export default generateTokenAndSetCookie;
