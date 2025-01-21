
import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
 {
    videoFile:{
        type:String,// url from cloud
        required:true
    },
    thumbnail:{
        type:String,// url from cloud
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
   
 },
 {
    timestamps:true,
 }
)
videoSchema.plugin( mongooseAggregatePaginate)
const Video =  mongoose.model("Video",videoSchema);