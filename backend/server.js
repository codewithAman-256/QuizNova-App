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
import dailyChallengeRoutes from "./routes/dailyRoutes.js";
import cloudinary from "./config/cloudinary.js";
import compression from "compression";
import { fileURLToPath } from "url";

const app = express();
app.use(compression());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();



const allowedOrigins = [
  "https://quiz-nova-app.vercel.app",
  "http://localhost:5173",
  "https://quiznovabyaman.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
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

// DailyChallenge Routes
app.use("/api/daily", dailyChallengeRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ server running on port ${PORT}`));
