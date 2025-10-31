import Result from "../models/resultModel.js";

export const saveResult = async (req, res) => {
  try {
    // userId comes from the token middleware
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const { score, totalQuestions, percentage } = req.body;

    if (score === undefined || !totalQuestions || percentage === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = new Result({ userId, score, totalQuestions, percentage });
    await result.save();

    res.status(201).json({ message: "✅ Result saved successfully", result });
  } catch (error) {
    console.error("❌ Error saving result:", error);
    res
      .status(500)
      .json({ message: "Error saving result", error: error.message });
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
