import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import adminStatsRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://quiznovabyaman.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuizNova API is running...");
});

// Quiz routes
app.use("/api/quizzes", quizRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Result routes
app.use("/api/results", resultRoutes);

// Admin stats routes
app.use("/api/admin", adminStatsRoutes);

// profile routes
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Leaderboard Routes
app.use("/api/leaderboard", leaderboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ server running on port ${PORT}`));
