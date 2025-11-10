import User from "../models/User.js";
import Result from "../models/Result.js";

// ✅ Leaderboard (Aggregate user scores)
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          averagePercentage: { $avg: "$percentage" },
          attempts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          totalScore: 1,
          averagePercentage: 1,
          attempts: 1,
        },
      },
      { $sort: { totalScore: -1 } },
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};
