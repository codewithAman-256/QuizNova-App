import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL || "http:////localhost:5000/api",

// baseURL: "https://quiznova-app-8c5o.onrender.com/api",

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

// ✅ Get admin stats
export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

// ✅ Get Leaderboard
export const getLeaderboard =async () => {
  const res =await api.get("/leaderboard");
  return res.data;
};

export default api;
