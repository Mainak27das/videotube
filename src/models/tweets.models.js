
import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema(
 { 
    content:{ // content of the yt tweet
        type:String,
        required:true
    },
   
    owner:{ // owner of the tweet
        type:Schema.Types.ObjectId,
        ref:"User"
    },
      
 },
 {
    timestamps:true,
 }
)

export const Tweet =  mongoose.model("Tweet",tweetSchema);