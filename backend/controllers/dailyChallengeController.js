import DailyChallenge from "../models/DailyChallenge.js";
import Streak from "../models/Streak.js";
import User from "../models/User.js";

// 🧩 Get today’s challenge
export const getTodayChallenge = async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  // Find challenge for exact today
  let challenge = await DailyChallenge.findOne({ date: today });

  // If not exists → create one
  if (!challenge) {
    challenge = new DailyChallenge({
      date: today,  // FIX #1 — store today's date
      question: "Which method converts JSON data to a JavaScript object?",
      options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObj()"],
      correctAnswer: "JSON.parse()",
      difficulty: "easy",
    });

    await challenge.save();
  }

  res.json(challenge);
};

// 🧠 Submit daily challenge
export const submitDailyChallenge = async (req, res) => {
  const { userAnswer } = req.body;
  const userId = req.user.id;
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const challenge = await DailyChallenge.findOne({
    date: { $gte: new Date(todayStr) },
  });
  if (!challenge) return res.status(404).json({ message: "No challenge found" });

  const correct = challenge.correctAnswer === userAnswer;

  // Find or create streak
  let streak = await Streak.findOne({ userId });
  if (!streak) {
    streak = new Streak({ userId, currentStreak: 0 });
    await streak.save();
  }

  const lastQuizDate = streak.lastQuizDate
    ? new Date(streak.lastQuizDate).toISOString().split("T")[0]
    : null;

  // ✅ Only count once per day
  if (lastQuizDate === todayStr) {
    return res.json({
      correct,
      message: "You’ve already completed today’s challenge ✅",
      streak: streak.currentStreak,
    });
  }

  // 🔥 Handle streak continuation or reset
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastQuizDate === yesterdayStr) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }

  streak.lastQuizDate = today;
  await streak.save();

  // 🪙 Add XP or coins
  const xpEarned = correct ? 10 : 2;
  const user = await User.findById(userId);
  user.xp = (user.xp || 0) + xpEarned;
  await user.save();

  res.json({
    correct,
    message: correct
      ? `✅ Correct! +${xpEarned} XP earned!`
      : `❌ Incorrect! But you still earned +${xpEarned} XP for trying.`,
    streak: streak.currentStreak,
    xp: user.xp,
  });
};
