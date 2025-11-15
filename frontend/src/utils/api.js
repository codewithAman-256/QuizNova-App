import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  baseURL: "https://quiznova-app-a24g.onrender.com/api",

  withCredentials: true,
});

// ✅ Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("user"))?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Unified Get Quizzes (for both Users & Admin)
export const getQuizzes = async (options = {}) => {
  const { search = "", page, limit, category, difficulty } = options;

  const params = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category) params.category = category;
  if (difficulty) params.difficulty = difficulty;

  const res = await api.get(`/quizzes`, { params });
  return res.data;
};
/* ============================
    Quizzes API
============================= */
// ✅ Get quizzes by category
export const getQuizzesByCategory = async (category) => {
  const res = await api.get(`/quizzes/category/${category}`);
  return res.data;
};

// ✅ Get 5 random quizzes
export const getFiveQuizzes = async () => {
  const res = await api.get("/quizzes/getFiveQuizzes");
  return res.data;
};

// ✅ Create new quiz (Admin only)
export const createQuiz = async (quizData) => {
  const res = await api.post("/quizzes", quizData);
  return res.data;
};

// ✅ Update quiz
export const updateQuiz = async (id, quizData) => {
  const res = await api.put(`/quizzes/${id}`, quizData);
  return res.data;
};

// ✅ Delete quiz
export const deleteQuiz = async (id) => {
  const res = await api.delete(`/quizzes/${id}`);
  return res.data;
};

/* ============================
    Result API
============================= */

// ✅ Save quiz result
export const saveResult = async (resultData) => {
  const res = await api.post("/results", resultData);
  return res.data;
};

// ✅ Get user-specific results
export const getUserResults = async (userId) => {
  const res = await api.get(`/results/user/${userId}`);
  return res.data;
};

/* ============================
   🧑‍💼 PROFILE API
============================= */

// ✅ Get profile
export const getProfile = async () => {
  try {
    const res = await api.get("/profile");
    return res.data;
  } catch (err) {
    toast.error("Failed to load profile");
    throw err;
  }
};

// ✅ Update profile (name + email)
export const updateProfile = async (formData) => {
  const res = await api.put("/profile/update", formData);
  return res.data;
};

// ✅ Update avatar
export const uploadAvatar = async (file) => {
  const fd = new FormData();
  fd.append("avatar", file);

  const res = await api.post("/profile/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
/* ============================
   🧑‍💼 ADMIN And Super Admin Leaderboard API
============================= */

export const getUsers = async () => {
  const res = await api.get("/users/all");
  return res.data;
};

export const toggleAdmin = async (id) => {
  const res = await api.put(`/users/toggle-admin/${id}`);
  return res.data;
};
// User requests admin access
export const requestAdminAccess = () => api.post("/users/request-admin");
// Admin gets pending requests
export const getAdminRequests = () => api.get("/users/admin/requests");

// Admin approves or rejects
export const processAdminRequest = (id, decision) =>
  api.put(`/users/admin/handle-request/${id}`, { decision });

// ✅ Get admin stats
export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

// ✅ Get Leaderboard
export const getLeaderboard = async () => {
  const res = await api.get("/leaderboard");
  return res.data;
};
/* ============================
   🎯 DAILY CHALLENGE API
============================= */

// 🧩 Get today's daily challenge
export const getDailyChallenge = async () => {
  try {
    const res = await api.get("/daily");

    // Avoid multiple notifications
    if (!sessionStorage.getItem("challengeToastShown")) {
      toast.success("🎯 Daily Challenge Loaded!");
      sessionStorage.setItem("challengeToastShown", "true");
    }

    return res.data; // { question, options, difficulty }
  } catch (err) {
    console.error("Daily challenge fetch error:", err);
    toast.error("⚠️ Failed to load today's challenge.");
    throw err;
  }
};

// 🧠 Submit daily challenge
export const submitDailyChallenge = async (userAnswer) => {
  try {
    const res = await api.post("/daily/submit", { userAnswer });

    // eslint-disable-next-line no-unused-vars
    const { correct, streak, xp, message } = res.data;

    // 🎉 Dynamic success / error feedback (from backend)
    if (correct) {
      const messages = [
        "🔥 You're on fire!",
        "💪 Keep that streak alive!",
        "🏆 Champion mode activated!",
        "⚡ Unstoppable energy!",
      ];

      toast.success(
        `✅ Correct!\n🔥 Streak: ${streak} days\n⚡ XP: ${xp}\n${
          messages[Math.floor(Math.random() * messages.length)]
        }`,
        { icon: "🏆", duration: 4000 }
      );
    } else {
      toast.error(`❌ Wrong answer — but you still earned XP! (${xp})`);
    }

    return res.data; // return { correct, streak, xp, message }
  } catch (err) {
    console.error("Submit error:", err);
    toast.error("⚠️ Submission failed. Try again.");
    throw err;
  }
};

export default api;
