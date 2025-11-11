import Result from "../models/Result.js";
import User from "../models/User.js";

export const saveResult = async (req, res) => {
  try {
    // userId comes from auth middleware
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const { score, totalQuestions, percentage } = req.body;

    if (score === undefined || totalQuestions === undefined || percentage === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Save quiz result
    const result = new Result({ userId, score, totalQuestions, percentage });
    await result.save();

    // ✅ Fetch user for streak tracking
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const lastQuizDate = user.lastQuizDate ? new Date(user.lastQuizDate) : null;

    if (lastQuizDate) {
      const diffInDays = Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        // same day - no change
      } else if (diffInDays === 1) {
        // next day → increase streak
        user.streakCount = (user.streakCount || 0) + 1;
      } else {
        // missed days → reset streak
        user.streakCount = 1;
      }
    } else {
      // first time streak
      user.streakCount = 1;
    }

    user.lastQuizDate = today;
    await user.save();

    res.status(201).json({
      message: "✅ Result saved successfully",
      result,
      streak: user.streakCount,
    });

  } catch (error) {
    console.error("❌ Error saving result:", error);
    res.status(500).json({
      message: "Error saving result",
      error: error.message,
    });
  }
};

export const showResult = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results" });
  }
};
