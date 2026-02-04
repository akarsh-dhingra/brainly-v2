import mongoose,{Schema,Model} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// Define interface for User document
interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    refreshToken:String;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken():string;   
}
const userSchema=new Schema<IUser>({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
   this.password= await bcrypt.hash(this.password,10);
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
}   
userSchema.methods.generateAccessToken = function (): string {
    console.log(
  "SIGNING TOKEN WITH SECRET:",
  process.env.ACCESS_TOKEN_SECRET
);

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_EXPIRY as string,
    }
  );
};

// userSchema.methods.generateRefreshToken=function():string{
//     return jwt.sign(
//             {_id:this._id},
//             process.env.REFRESH_TOKEN_SECRET as string,{
//                 expiresIn:process.env.REFRESH_EXPIRY as StringValue | number
//             }
//     );
// }
export const User = mongoose.model("User", userSchema);