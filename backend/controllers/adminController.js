import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import User from "../models/User.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();

    const avgScore = await Result.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);

    const categoryStats = await Quiz.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalQuizzes,
      totalAttempts,
      avgScore: avgScore[0]?.avgScore || 0,
      categoryStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};