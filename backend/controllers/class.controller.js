import Class from '../model/classes.model.js';
import User from '../model/user.model.js'; // assuming User schema exists
import Course from "../model/course.model.js"

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('students').populate('teacher').populate('course');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classes', error: err });
  }
};

// Get details of one class with coursework
export const getClassDetails = async (req, res) => {
  const { classId } = req.params;
  try {
    const cls = await Class.findById(classId).populate('students').populate('teacher');
    // add course metadata from the coursework PDF if linked to DB
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(cls);
  } catch (err) {
    res.status(404).json({ message: 'Class not found', error: err });
  }
};

// Join class (student)
export const joinClass = async (req, res) => {
  const { classId } = req.params;
  const studentId = req.user._id;

  try {
    const student = await User.findById(studentId);
    const cls = await Class.findById(classId);

    if (!student || !cls) {
      return res.status(404).json({ message: 'Student or Class not found' });
    }

    // Prevent duplicate enrollment
    const alreadyEnrolled = cls.students.includes(studentId);
    if (!alreadyEnrolled) {
      cls.students.push(studentId);
      student.enrolledClasses.push(classId);

      // Save both updates concurrently
      await Promise.all([cls.save(), student.save()]);
    }

    res.status(200).json({
      message: alreadyEnrolled ? 'Already joined the class' : 'Joined the class successfully',
      class: cls,
    });
  } catch (err) {
    console.error('Error joining class:', err);
    res.status(400).json({ message: 'Failed to join class', error: err.message });
  }
};


// Leave class (student)
export const leaveClass = async (req, res) => {
  const { classId } = req.params;
  const studentId = req.user._id; 

  try {
    const cls = await Class.findByIdAndUpdate(classId, {
      $pull: { students: studentId }
    });

    await User.findByIdAndUpdate(studentId, {
      $pull: { enrolledClasses: classId }
    });

    res.status(200).json({ message: 'Left the class successfully', class:cls });
  } catch (err) {
    console.error("Error leaving class:", err);
    res.status(400).json({ message: 'Failed to leave class', error: err.message });
  }
};


// Assign teacher
export const assignTeacher = async (req, res) => {
  const { classId } = req.params;
  const { teacherId } = req.body;

  try {
    const cls = await Class.findById(classId);
    if (!cls.teacher.includes(teacherId)) {
      cls.teacher.push(teacherId);
      await cls.save();
    }
    const teacher = await User.findById(teacherId);
    if(!teacher.enrolledClasses.includes(classId)){
      teacher.enrolledClasses.push(classId);
      await teacher.save();
    }
    res.status(200).json({ message: 'Teacher assigned', class: cls });
  } catch (err) {
    res.status(400).json({ message: 'Failed to assign teacher', error: err });
  }
};

// Remove teacher
export const removeTeacher = async (req, res) => {
  const { classId } = req.params;
  const { teacherId } = req.body;

  try {
    const cls= await Class.findByIdAndUpdate(classId, {
      $pull: { teacher: teacherId }
    });
    await User.findByIdAndUpdate(teacherId,{
      $pull: {enrolledClasses:classId}
    });
    res.status(200).json({ message: 'Teacher removed',class:cls });
  } catch (err) {
    res.status(400).json({ message: 'Failed to remove teacher', error: err });
  }
};


export const suggestClasses = async (req, res) => {
  try {
      const userId = req.user._id;

      const user = await User.findById(userId);

      if (!user || user.userType !== "student") {
          return res.status(403).json({ error: "Only students can get class suggestions." });
      }

      const studentSem = user.sem;

      if (!studentSem) {
          return res.status(400).json({ error: "Student semester not found." });
      }

      // Fetch classes that match the student's semester but are NOT already enrolled
      const suggestedClasses = await Class.find({ 
          sem: studentSem,
          _id: { $nin: user.enrolledClasses } // Exclude already enrolled classes
      });

      res.status(200).json({ suggestedClasses });
  } catch (error) {
      console.error("Error suggesting classes:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};


// Student: Get all joined classes
export const getJoinedClassesByStudent = async (req, res) => {
  try {
    const studentId = req.user._id;

    const joinedClasses = await Class.find({ students: studentId })
      .populate("course")
      .populate("teacher", "username  email");

    res.status(200).json({ joinedClasses });
  } catch (error) {
    console.error("Error fetching joined classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Faculty: Get all assigned classes
export const getAssignedClassesToTeacher = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const assignedClasses = await Class.find({ teacher: facultyId })
      .populate("course")
      .populate("students", "username email");

    res.status(200).json({ assignedClasses });
  } catch (error) {
    console.error("Error fetching assigned classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
