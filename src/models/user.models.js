
import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
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
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){ // only encrypt the password if it is modified or changed
        return next();
    } 

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){       //compare the given password and encrypted password
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    }
const User =  mongoose.model("User",userSchema);