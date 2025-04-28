import mongoose from "mongoose"

const classSchema = mongoose.Schema({
    name: String,
    sem: Number,
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[]
    }],
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[],
    }],
    course: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Course"
}
});
const Class = mongoose.model("Class", classSchema);
export default Class;