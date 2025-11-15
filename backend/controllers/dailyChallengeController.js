import DailyChallenge from "../models/DailyChallenge.js";
import Streak from "../models/Streak.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

// 🧩 GET TODAY'S DAILY CHALLENGE (random quiz once per day)
export const getTodayChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    // Check if today's challenge already exists
    let daily = await DailyChallenge.findOne({ date: today }).populate("quizId");

    // If exists → return the quiz directly
    if (daily) {
      return res.json({
        question: daily.quizId.question,
        options: daily.quizId.options,
        difficulty: daily.quizId.difficulty,
      });
    }

    // Fetch all quizzes
    const quizzes = await Quiz.find();
    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes available" });
    }

    // Pick one random quiz
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];

    // Create today's daily challenge
    daily = new DailyChallenge({
      date: today,
      quizId: randomQuiz._id,
    });

    await daily.save();

    return res.json({
      question: randomQuiz.question,
      options: randomQuiz.options,
      difficulty: randomQuiz.difficulty,
    });
  } catch (err) {
    console.error("Daily challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 🧠 SUBMIT DAILY CHALLENGE
export const submitDailyChallenge = async (req, res) => {
  try {
    const { userAnswer } = req.body;
    const userId = req.user.id;

    const todayStr = new Date().toISOString().split("T")[0];

    // Get today's challenge + quiz data
    const daily = await DailyChallenge.findOne({ date: todayStr }).populate("quizId");

    if (!daily) {
      return res.status(404).json({ message: "No challenge found" });
    }

    const quiz = daily.quizId;

    const correct = quiz.correctAnswer === userAnswer;

    // ⭐ Find or create streak
    let streak = await Streak.findOne({ userId });
    if (!streak) {
      streak = new Streak({ userId, currentStreak: 0 });
      await streak.save();
    }

    const lastDate = streak.lastQuizDate
      ? new Date(streak.lastQuizDate).toISOString().split("T")[0]
      : null;

    // ⛔ Already completed today?
    if (lastDate === todayStr) {
      return res.json({
        correct,
        message: "You’ve already completed today’s challenge!",
        streak: streak.currentStreak,
      });
    }

    // 🔥 Check streak continuation
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (lastDate === yesterday) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }

    streak.lastQuizDate = new Date();
    await streak.save();

    // ⭐ XP SYSTEM
    const xpEarned = correct ? 10 : 2;

    const user = await User.findById(userId);
    user.xp = (user.xp || 0) + xpEarned;
    await user.save();

    res.json({
      correct,
      streak: streak.currentStreak,
      xp: user.xp,
      message: correct
        ? `✅ Correct! +${xpEarned} XP earned!`
        : `❌ Wrong — but you still earned +${xpEarned} XP`,
    });
  } catch (err) {
    console.error("Submit challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
