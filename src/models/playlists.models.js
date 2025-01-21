
import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema(
 {
    name:{
        type:String,// url from cloud
        required:true
    },
   
    description:{ // description of the playlist
        type:String,
        required:true
    },
    videos:[  // videos of the playlist in array format
      {
        type:Schema.Types.ObjectId,
        ref:"Video",
      },
     ],
    owner:{ // owner of the playlist
        type:Schema.Types.ObjectId,
        ref:"User",
    }
   
 },
 { // created and updated at timestamps in date format
    timestamps:true,
 }
)

const Playlist =  mongoose.model("Playlist",playlistSchema);