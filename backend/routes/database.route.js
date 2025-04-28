import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { getAll, getDocById, addDoc, getStudentDocuments,getFacultyAndAdminDocuments } from "../controllers/database.controller.js";
const router = express.Router()

router.post("/addDoc",protectRoute,addDoc);
router.get("/getAll",protectRoute,getAll)
router.get("/getDoc/:id",protectRoute,getDocById);
router.post("/student-documents",protectRoute, getStudentDocuments);
router.get("/getFacultyAndAdminDocs",protectRoute,getFacultyAndAdminDocuments);


export default router;