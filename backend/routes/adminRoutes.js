import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getAdminStats);

export default router;
