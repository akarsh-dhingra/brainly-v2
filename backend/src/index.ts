import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "./models/user.model.js"
import connectDb from "./utils/db.js";
import {z, ZodObject} from "zod";
import { string } from "zod/v3";
import { Content } from "./models/content.models.js";
import cookieParser from "cookie-parser";
import auth from "./middleware/userMiddleware.js";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app=express();
const PORT=process.env.PORT;
app.use(cookieParser());
app.use(express.json());

connectDb()
.then(()=>{
app.listen(PORT,()=>{
    console.log(`Listening to ${PORT}`);
})
})
.catch(()=>{
    console.log("Error occured while connecting to MongoDb");
})
app.get("/",(req,res)=>{
    res.send("This is the root");
})
const generateAccessToken=async(user)=>{
try {
     const accessToken=user.generateAccessToken();
     return {accessToken};
} catch (error) {
    console.error("Error occured",error);
    throw error;
}
}

app.post("/api/v1/signUp",async(req,res)=>{
    const zodSchema=z.object({
        username:z.string().min(3).max(10),
        password:z.string().min(8).max(20),
        email:z.email()
    });

    const parsedDatawithSucesss=zodSchema.safeParse(req.body);
    if(!parsedDatawithSucesss.success){
        return res.status(402).json({msg:"Bhai parsed nahi hai dhang sa"});
    }
    const {username,password,email}=req.body;

    const userExists=await User.findOne({username:username,email:email});
    if(userExists){
        return res.status(308).json({msg:"User Exists hence signIn"});
    }
    const createUser=await User.create({
        username:username,
        password:password,
        email:email
    });

    return res.status(200).json({
        user:createUser
    })
});
app.post("/api/v1/signIn",async(req,res)=>{
    const {username,password}=req.body;

    const userExists=await User.findOne({username:username});
    if(!userExists){
        return res.status(400).json({msg:"User does not exists"});
    }
    const checkPassword=await userExists.isPasswordCorrect(password);
    if(!checkPassword){
        return res.status(400).json({msg:"Password glt hai"});
    }
    const {accessToken}=await generateAccessToken(userExists);

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("AccessToken",accessToken,options)
      .json({ msg: "Login successful" }); // Add response body
});
app.post("/logout",(req,res)=>{
    
});
app.post("/addContent",auth,async (req,res)=>{
try {
    const user=req.user;
    // We got the user 
    const {Title,Link,Type}=req.body;
    const contentCreated=await Content.create({
        title:Title,
        link:Link,
        type:Type,
        userId:user._id,
    });
    return res.status(200).json({msg:contentCreated});
} catch (error) {
    throw error
}
});
app.get("/api/v1/content",auth,async (req,res)=>{
const userId=req.user._id;
const content=await Content.findOne({userId:userId}).populate("userId");
console.log(content);
res.status(200).json({msg:content});
});
app.delete("/api/v1/content/:id",auth,async (req,res)=>{
try {
    const contentId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(contentId as string)) {
      return res.status(400).json({ msg: "Invalid content ID" });
    }
    const contentid=new mongoose.Types.ObjectId(contentId as string);
    console.log(contentid);
    const userId=req.user._id;
    console.log(userId);
    const content=await Content.findOne({
        _id:contentid,
        userId:userId
    });

    if(!content){
        return res.status(404).json({
            msg:"Content not found or you are not authorized to do so"
        })
    }
    await Content.deleteOne({_id:contentId});

    return res.status(200).json({
        msg:"Content Deleted Successfullly"
    });
} catch (error) {
 console.error("Delete content error:", error);
    return res.status(500).json({
      msg: "Internal server error",
    });
}
});
app.post("/api/v1/brain/share",(req,res)=>{

});
app.get("/api/v1/brain/:sharelink",(req,res)=>{

});