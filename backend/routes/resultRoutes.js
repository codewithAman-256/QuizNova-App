import express from "express";
import {saveResult,showResult} from "../controllers/resultController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Save quiz result
router.route("/")
.post(protect,saveResult);


// Fetch results (for user dashboard)
router.route("/user/:userId")
.get(showResult);

export default router;
