import mongoose from "mongoose";

const dataSchema = await mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
    },
    docObj:{
        type: Object,
        required:true
    }
})

const Database =  mongoose.model("Database",dataSchema);
export default Database;
