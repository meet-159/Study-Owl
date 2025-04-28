import Database from "../model/database.model.js"
import User from "../model/user.model.js";
export const addDoc = async (req,res)=>{
   try {
    const userId = req.user._id;
    const docObj = req.body.docObj;
    const db = new Database({
        userId:userId,
        docObj:docObj
    });
    const result = await db.save();
    const user = await User.findById(userId);
    user.docList.push(result._id);
    await user.save();
    return res.status(200).json({addedDoc:result, docList:user.docList});
   } catch (error) {
    console.log("error in addDoc Controller: ", error);
    res.status(500).json({error:"Internal server error"});
   }

}
export const getDocById = async (req,res)=>{
    try {
        const {userId} = req.user;
        const docId = req.params.id;
        const foundDoc = await Database.findOne({
            userId:userId,
            docId:docId
        });
        if(!foundDoc){
            return res.status(404).json({error:"Document not found"});
        }
        return res.status(200).json({foundDoc});
    } catch (error) {
        console.log("error in getDocById Controller: ", error);
    res.status(500).json({error:"Internal server error"});
    }
}
export const getAll = async (req,res)=>{
    try {
        const userId = req.user._id;
        const docs = await Database.find({
            userId
        })
        if(!docs){
            return res.status(404).json({error:"No documents found"})
        }
        return res.status(200).json(docs);
    } catch (error) {
        console.log("error in getAll documents Controller: ", error);
    res.status(500).json({error:"Internal server error"});
    }
}

export const getStudentDocuments = async (req, res) => {
  try {
    const studentDocs = await Database.find()
      .populate({
        path: "userId",
        match: { userType: "student" },
        select: "_id username email userType sem",
      })
      .exec();

    // Filter out documents where no user is matched
    const filteredDocs = studentDocs.filter(doc => doc.userId !== null);

    // Sort by sem
    filteredDocs.sort((a, b) => a.userId.sem - b.userId.sem);

    return res.status(200).json(filteredDocs);
  } catch (err) {
    console.error("Error fetching student documents:", err);
    throw err;
  }
};


  export const getFacultyAndAdminDocuments = async (req,res) => {
    try {
      const adminDocs = await Database.find()
        .populate({
          path: "userId",
          match: { userType: "admin" }, // Only match users who are students
          select: "_id username email userType" // select fields
        })

      const facultyDocs = await Database.find()
        .populate({
          path: "userId",
          match: { userType: "faculty" }, // Only match users who are students
          select: "_id username email userType enrolledClasses" // select fields
        })
        .exec();
  
      // Filter out documents where no user is matched
      const filteredAdminDocs = adminDocs.filter(doc => doc.userId !== null);
      const filteredFacultyDocs = facultyDocs.filter(doc => doc.userId !== null);
  
      return res.status(200).json({facultyDocs:filteredFacultyDocs,adminDocs:filteredAdminDocs});
    } catch (err) {
      console.error("Error fetching student documents:", err);
      throw err;
    }
  };