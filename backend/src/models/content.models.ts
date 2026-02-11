import mongoose,{Schema} from "mongoose";
import { User } from "./user.model.js"
const contentTypes = ['image', 'video', 'article', 'audio', 'github', 'Link', 'Note', 'link', 'note'];
const contentSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    type:{type:String,enum:contentTypes},
    link:{type:String,required:false,default:''},
    tags:[{
        type:Schema.Types.ObjectId,
        ref:'Tag'
    }],
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

// contentSchema.pre('save',async function(next:any){
//     const user=await User.findById(this.userId);
//     if(!user){
//         throw new Error('User does not exist');
//     }
//     next();
// });


export const Content= mongoose.model('Content',contentSchema);