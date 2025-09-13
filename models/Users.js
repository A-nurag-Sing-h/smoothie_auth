import mongoose from "mongoose"; 
import validator from "validator";
import bcrypt from "bcrypt";

const {isEmail} = validator;
// schema 
let userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'please provide us with an email.'],
        unique:true,
        lowercase:true,
        validate:[isEmail,"please enter valid email!"], 
    },
    password:{
        type:String,
        required:[true,'please provide us with an password.'],
        minlength:[4,'password should be atleast 4 char/digit long.'],
    },
})

// pre/post
userSchema.pre('save',async function (next){
    console.log("user is about to be saved: ",this);
    let salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt);
    next();
})
userSchema.post('save',function (doc,next){
    console.log("new user was created and saved in db: ",doc);
    next();
})
// static method
userSchema.statics.login = async function (email,password){
    const user = await this.findOne({email});
    if(user)
    {
        let auth = await bcrypt.compare(password,user.password);
        if(auth) 
        {
            return user;
        }
        throw Error("incorrect password!");
    }
    throw Error("incorrect mail!");
}


// model
let userModel = mongoose.model('user',userSchema);

export default userModel;