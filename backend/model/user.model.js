import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ["admin", "faculty", "student"],
        default: "student",
        required: true,
    },
    yearOfEnrollment: {
        type: Number,  // Store the year of enrollment (from the roll number)
        required:  function () { return this.userType === 'student'; } // Only required for students,
    },
    sem: {
        type: Number,
        required: function () { return this.userType === 'student'; },  // Only required for students
    },
    docList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: [],
        },
    ],
    enrolledClasses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",  // Reference to the classes the student is enrolled in
            default: [],
        }
    ],
});

const User = mongoose.model("User", userSchema);
export default User;
