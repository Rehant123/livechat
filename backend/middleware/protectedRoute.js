import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
const protectedRoute = async (req,res,next)=>{

    try{

        const token = req.cookies.jwt;
        console.log(token);

        if(!token){
            return res.status(401).json({error:'Unauthorized - No token provided'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:'Unauthorized - No token provided'})
        }
        const user = await User.findById(decoded.userId).select('-password');
        
        if(!user){
            return res.status(401).json({error:'Unauthorized - User Not Found'});
        }
        req.user_id = user._id;
        console.log(req.user);
        next();

    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Internal Server Error'});
    }
}
export default protectedRoute;