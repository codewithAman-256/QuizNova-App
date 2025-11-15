import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import adminStatsRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import dailyChallengeRoutes from "./routes/dailyRoutes.js";
import compression from "compression";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();
app.use(compression());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------ CORS FIX ------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://quiz-nova-app.vercel.app",
  "https://quiznovabyaman.netlify.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});
// ------------------------------------------------

app.use(express.json());

// API Routes
app.get("/", (req, res) => res.send("QuizNova API is running..."));

app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/daily", dailyChallengeRoutes);

// Production build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
