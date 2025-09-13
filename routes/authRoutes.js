import {Router} from "express";
import { getLogin ,getSignUp , postLogin , postSignUp,getLogout} from "../controllers/authControlers.js";

const authRouter = Router();
authRouter.get('/signup',getSignUp);
authRouter.post('/signup',postSignUp);
authRouter.get('/login',getLogin);
authRouter.post('/login',postLogin);
authRouter.get('/logout',getLogout);

export default authRouter;