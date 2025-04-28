import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password, userType } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email regex for format validation

        // Student email regex pattern: bt<year>cse<rollno>@nituk.ac.in
        const studentEmailRegex = /^bt(\d{2})cse\d{3}@nituk.ac.in$/;
        // Teacher email regex pattern: teacher_name@nituk.ac.in
        const teacherEmailRegex = /^[a-zA-Z]+@[a-zA-Z]+\.(ac|edu)\.in$/;

        console.log(req.body);

        if (password.length < 6) {
            return res.status(400).json({ error: "password must be at least 6 characters long" });
        }

        if (!username || !email || !password || !userType) {
            return res.status(400).json({ error: "all fields are required" });
        }

        // Check if the email format is correct
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "email format is incorrect" });
        }

        // Check if the user is a student and email matches the student format
        const studentMatch = studentEmailRegex.exec(email);
        if (userType === "student" && !studentMatch) {
            return res.status(400).json({ error: "invalid student email format. It should be 'bt<year>cse<rollno>@nituk.ac.in'" });
        }

        // Check if the user is a teacher and email matches the teacher format
        if (userType === "teacher" && !teacherEmailRegex.test(email)) {
            return res.status(400).json({ error: "invalid teacher email format. It should be 'teacher_name@nituk.ac.in'" });
        }

         // Check if the email already exists in the database
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(400).json({ error: "email already exists" });
         }

        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        let user;


       if(userType==="student"){ // Extract the year of enrollment from the roll number in the email (e.g., 23 from bt23cse017)
                const yearOfEnrollment = parseInt(studentMatch[1]);

                // Calculate the current year and month
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;  // Months are 0-indexed in JS

                // Calculate the student's semester based on the year of enrollment and current date
                const yearsSinceEnrollment = currentYear - (2000 + yearOfEnrollment);
                let sem = yearsSinceEnrollment * 2;  // 2 semesters per year

                // Semester calculation:
                // If current month is August (8) or later, increase the semester count by 1
                if (currentMonth >= 8) {
                    sem++; // Odd semester (August to December)
                } else {
                    // If the current month is January (1) to May (5), it would be the even semester
                    sem = sem; // Even semester (January to May)
                }
                console.log("year = ",yearOfEnrollment);
                
                user = new User({
                    username,
                    email,
                    password: hashedPassword,
                    userType,
                    yearOfEnrollment,
                    sem,  // Automatically generated semester
                });
            console.log(user);
        }else{
            user = new User({
                username,
                email,
                password: hashedPassword,
                userType,
            });
        }
       


        // Save the user document to the database
        const savedUser = await user.save();
        generateTokenAndSetCookie(savedUser._id, res);
        res.status(201).json({ message: "User created successfully", savedUser });

    } catch (error) {
        console.log("error in signup controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




export const login = async (req,res)=>{
    try {
        const {usernameOrEmail,password} = req.body;
        // Check if the username or email exists in the database
        const foundUser = await User.findOne({$or:[{username:usernameOrEmail},{email:usernameOrEmail}]});
        if (!foundUser) {
            res.status(400).json({error:"username or email not found"});
        }
        console.log(foundUser);
        
        // Check if the password is correct
        const isValidPassword = await bcrypt.compare(password, foundUser.password);
        if (!isValidPassword) {
            res.status(400).json({message:"invalid password"});;
        }
        // Generate a JWT token
        generateTokenAndSetCookie(foundUser._id,res);

        res.status(201).json({
            _id: foundUser._id,
            userType: foundUser.usertype,
            username: foundUser.username,
            email: foundUser.email,
        })

    } catch (error) {
        console.log("error in login controller: ", error);
        res.status(500).json({error:"Internal server error"});
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged Out Successfully"});
    } catch (error) {
        console.log("error in logout controller: ", error);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getMe = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getMe controller",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getTeacherAndAdmins = async (req, res) => {
    try {
        const teachers = await User.find({ userType: "faculty" }).select("_id username email");
        const admins = await User.find({ userType: "admin" }).select("_id username email");

        res.status(200).json({ teachers, admins });
    } catch (error) {
        console.log("error in getTeacherAndAdmins controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
