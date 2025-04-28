import express from "express";
import { signUp, login, logout, getMe, getTeacherAndAdmins } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signUp",signUp);
router.post("/login",login);
router.post("/logout",logout);
router.get("/getMe",protectRoute,getMe);
router.get("/getTeacherAndAdmins",protectRoute,getTeacherAndAdmins);

export default router;