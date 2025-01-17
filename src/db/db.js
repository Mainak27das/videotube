import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const connectionURL = await mongoose.connect(
            `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
          )
          console.log(`MongoDB connected ${connectionURL.connection.host}`);

    }
    catch(error){
        console.log("Error connecting to MongoDB",error)
        process.exit(1)
    }
 
};

export default connectDB;
