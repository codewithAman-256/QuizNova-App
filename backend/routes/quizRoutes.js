import express from "express";
import {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getFiveQuizzes,
  getQuizzesByCategory,
} from "../controllers/quizController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/").get(getQuizzes).post(protect, isAdmin, createQuiz);

router.get("/getFiveQuizzes", getFiveQuizzes);
// ✅ New route for category-based quizzes
router.get("/category/:category", getQuizzesByCategory);

router.route("/:id").put(protect, updateQuiz).delete(protect, deleteQuiz);

export default router;
