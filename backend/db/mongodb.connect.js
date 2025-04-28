import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb://127.0.0.1:27017/studyOwlDB");
        console.log("MongoDB Connected at localhost");
    } catch (error) {
        console.log("error in MongoDB connection:",error);
        process.exit(1);
    }
}

export default connectDB;