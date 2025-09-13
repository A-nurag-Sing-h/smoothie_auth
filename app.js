import express from "express"; // import express
import mongoose from "mongoose"; // import mongoose
import dotenv from "dotenv"; // import dotenv
import authRouter from "./routes/authRoutes.js"; // import routers
import cookieParser from "cookie-parser"; // import cookie-parser
import {requireAuth,checkUser} from "./middlewares/authMiddlewares.js"; // import middlewares

dotenv.config({ path: "./my.env" }); // or just dotenv.config() if file is .env

// creating server
const app = express();
   
// Middleware
app.use(express.json()); // used to read incomming json in req
app.set("view engine", "ejs"); // telling app to use ejs as view engine
app.use(express.static("public")); // static files can be made accesible 
app.use(cookieParser()); // parses cookies

// MongoDB connection
mongoose
  .connect(process.env.MONGO_PASS)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));

// app routes
app.get('*',checkUser);
app.get('/',(req,res)=> res.render('home'));
app.get('/smoothies',requireAuth,(req,res)=> res.render('smoothies'));
app.use(authRouter);


