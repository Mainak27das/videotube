
import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema(
 { //you can like either avideo, a tweet or a comment
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
   
 },
 {
    timestamps:true,
 }
)

const Like =  mongoose.model("Like",likeSchema);