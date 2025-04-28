// models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },        // e.g. CSL251
  title: { type: String, required: true },                      // e.g. Data Structures
  ltp: { type: String, required: true },                        // e.g. "3-0-0"
  credits: { type: Number, required: true },                    // e.g. 3
  type: {                                                       // UC/UE/BS/DC/DE/etc.
    type: String,
    enum: ['BS', 'HM', 'ES', 'DC', 'DE', 'HM', 'UE', 'OC', 'UN', 'UC','UNKNOWN'],
    required: true
  },
  department: { type: String, default: "CSE" },
  description: String // Optional for course summary
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
