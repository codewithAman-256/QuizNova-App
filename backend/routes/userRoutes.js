import express from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
  toggleAdmin,
  requestAdminRole,
  getAdminRequests,
  handleAdminRequest
} from "../controllers/userController.js";
import { isAdmin, isSuperAdmin } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// /api/users

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", protect, isAdmin, getAllUsers);
router.put("/toggle-admin/:id",  protect,isSuperAdmin, toggleAdmin);
router.post("/request-admin", protect, requestAdminRole);
router.get("/admin/requests", protect, isSuperAdmin, getAdminRequests);
router.put("/admin/handle-request/:id", protect, isSuperAdmin, handleAdminRequest);


export default router;
