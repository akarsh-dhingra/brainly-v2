import mongoose,{Mongoose, Schema} from "mongoose";

const LinkSchema=new Schema({
    hash:{
        type:String,
        required:true
    },
    Userid:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
export const Link=mongoose.model("Link",LinkSchema);