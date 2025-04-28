import express from 'express';
import {
  getAllClasses,
  getClassDetails,
  joinClass,
  leaveClass,
  assignTeacher,
  removeTeacher,
  suggestClasses,
  getJoinedClassesByStudent,
  getAssignedClassesToTeacher
} from '../controllers/class.controller.js';

import { protectRoute } from "../middleware/protectRoute.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router = express.Router();

router.get('/', getAllClasses);

router.get("/joined", protectRoute, getJoinedClassesByStudent);
router.get("/assigned", protectRoute,authorizeRoles("faculty"), getAssignedClassesToTeacher);

router.get("/suggest", protectRoute, suggestClasses);
router.get('/:classId', getClassDetails);

router.post('/joinClass/:classId',protectRoute, joinClass);
router.post('/leaveClass/:classId',protectRoute, leaveClass);

router.post('/:classId/assign-teacher', protectRoute, authorizeRoles("faculty", "admin"),assignTeacher);
router.post('/:classId/remove-teacher',protectRoute, authorizeRoles("faculty", "admin"), removeTeacher);



export default router;
