// seedClasses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../model/course.model.js";
import Class from "../model/classes.model.js";

dotenv.config();

// Semester-wise course mapping (update as needed)
const semesterCourseMap = {
  1: ["MAL102", "PHL151", "CSL151", "CYP101"],
  2: ["MAL103", "CSL251", "HSL151"],
  3: ["CSL252", "CSL253", "CSL254"],
  4: ["CSL255", "CSL256"],
  5: ["CSL351", "CSL352", "CSL353"],
  6: ["CSL451", "CSL452"],
  7: ["CSD491"],
  8: ["CSD492"]
};

async function seedClasses() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/studyOwlDB");
    await Class.deleteMany(); // Clear existing classes

    for (const [sem, courseCodes] of Object.entries(semesterCourseMap)) {
      for (const code of courseCodes) {
        const course = await Course.findOne({ code });
        if (!course) {
          console.warn(`⚠️ Course ${code} not found, skipping...`);
          continue;
        }

        const cls = new Class({
          name: `CSE Semester ${sem} - ${course.title}`,
          sem: `${sem}`,
          course: course._id,
          students: [],
          teacher: []
        });

        await cls.save();
        console.log(`✅ Created class for ${code}`);
      }
    }

    console.log("🎉 All classes seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed classes:", err);
    process.exit(1);
  }
}

seedClasses();
