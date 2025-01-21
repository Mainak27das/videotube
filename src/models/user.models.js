
import mongoose,{Schema} from "mongoose";

const userSchema = new Schema(
  {
   
    username:{
        type:String,//cloud link
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
         
    },
    fullname:{
        type:String,
        required:true,
        index:true,
        trim:true,
        index:true,
         
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[ // array of video id of that particular user
        {
        type:Schema.Types.ObjectId,
        ref:"Video"
       }
     ],
     password:{
        type:String,
        required:[true,"Password is required"]
     },
     refreshToken:{
         type:String,
     }
   
 },
 {
    timestamps:true,
 }
)

const User =  mongoose.model("User",userSchema);