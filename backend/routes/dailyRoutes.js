import express from "express";
import { getTodayChallenge, submitDailyChallenge } from "../controllers/dailyChallengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getTodayChallenge);
router.post("/submit", protect, submitDailyChallenge);

export default router;