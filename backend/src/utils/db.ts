import mongoose from "mongoose";

console.log(process.env.MONGODB_URI);
const connectDb=async()=>{
    try {   
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`);
        return connectionInstance;
    } catch (err) {
        console.log("MongoDb is not running ");
    } 
}

export default connectDb;