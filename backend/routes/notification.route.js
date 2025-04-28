import express from "express";
import{ protectRoute }from "../middleware/protectRoute.js";
import { getNotifications, deleteNotifications, raiseNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.post("/", protectRoute, raiseNotification);

export default router;
