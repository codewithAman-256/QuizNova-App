import Quiz from "../models/Quiz.js";

// ✅ Get quizzes (for both users & admins)
export const getQuizzes = async (req, res) => {
  try {
    const { search = "", page, limit, category, difficulty, random } = req.query;

    // 🎯 Build dynamic query
    const query = {};

    // Optional search by question (case-insensitive)
    if (search.trim()) {
      query.question = { $regex: search, $options: "i" };
    }

    // Optional category filter
    if (category && category !== "") {
      query.category = category;
    }

    // Optional difficulty filter
    if (difficulty && difficulty !== "") {
      query.difficulty = difficulty;
    }

    // 🎲 Random quizzes mode (for user home/quiz list)
    if (random === "true") {
      const count = await Quiz.countDocuments(query);
      const sampleSize = limit ? parseInt(limit) : 5;
      const quizzes = await Quiz.aggregate([
        { $match: query },
        { $sample: { size: sampleSize } },
      ]);
      return res.json(quizzes);
    }

    // 📑 Pagination (for admin or long lists)
    if (page && limit) {
      const total = await Quiz.countDocuments(query);
      const quizzes = await Quiz.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      return res.json({
        quizzes,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
      });
    }

    // 🧾 Default: return all quizzes
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    res.json(quizzes);

  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};




// ✅ Get quizzes by category (e.g. /api/quizzes/category/JavaScript)
export const getQuizzesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const quizzes = await Quiz.find({ category });
    if (quizzes.length === 0)
      return res.status(404).json({ message: "No quizzes found for this category" });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get any 5 random quizzes
export const getFiveQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.aggregate([{ $sample: { size: 5 } }]);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Create new quiz (Admin only)
export const createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: "Error creating quiz", error: error.message });
  }
};

// ✅ Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: "Error updating quiz", error: error.message });
  }
};

// ✅ Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting quiz", error: error.message });
  }
};
