import userModel from "../models/Users.js"; 
import jwt from "jsonwebtoken";

// handleError fx
const handleErrors = (err)=>{
    console.log(err.message,err.code);
    let error = {email:'',password:''};
    if(err.message === 'incorrect mail!')
    {
        error.email = 'That email ain\'t register';
    }
    if(err.message === 'incorrect password!')
    {
        error.password = 'That password ain\'t passwording';
    }
    if(err.message.includes('user validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message;
        });
    }
    if(err.code === 11000)
    {
        error.email = 'No es un correo electrónico único mi querido señor.';
    }
    return error;
}

// jwt fx
const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'ninja hattori',{expiresIn:maxAge});
}
 
export const getSignUp = (req,res)=>{
    res.render('signup');
}
export const getLogin = (req,res)=>{
    res.render('login')
}
export const postSignUp = async (req,res)=>{
    let {email,password} = req.body; 
    try
    {
        const user = await userModel.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }
    catch (err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
export const postLogin = async (req,res)=>{
    const {email,password} = req.body;
    try
    {
        const user = await userModel.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({user:user._id});
    }
    catch (err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
export const getLogout = (req,res)=>{
    res.cookie('jwt','he he boi',{maxAge:1});
    res.redirect('/');
}
