import jwt from "jsonwebtoken"; 
import userModel from "../models/Users.js";

export const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'ninja hattori',(err,decodedToken)=>{
            if(err)
            {
                console.log(err.message);
                res.redirect('/login')
            }
            else 
            {
                console.log(decodedToken);
                next();
            }
        });
    }
    else
    {
        res.redirect('/login');
    }
}

export const checkUser = (req,res,next) =>{
    let token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'ninja hattori',async (err,decodedToken)=>{
            if(err)
            {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else 
            {
                console.log(decodedToken);
                let user = await userModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else 
    {
        res.locals.user = null;
        next();  
    }
}
