// seedCourses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../model/course.model.js";
import { courses } from "./courses.js";

dotenv.config();

async function seedCourses() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/studyOwlDB");
    await Course.deleteMany();
    await Course.insertMany(courses);
    console.log("✅ Course data seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed courses:", err);
    process.exit(1);
  }
}

seedCourses();
