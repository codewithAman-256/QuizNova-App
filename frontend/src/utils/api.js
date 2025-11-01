import axios from "axios";

const api = axios.create({
  baseURL: "https://quiznova-app-8c5o.onrender.com/api"
  //*|| "http://localhost:5000/api"*/,
});

// ✅ Get all quizzes
export const getQuizzes = async () => {
  const res = await api.get("/quizzes");
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
  const token = localStorage.getItem("token");
  const res = await api.post("/quizzes", quizData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Update quiz
export const updateQuiz = async (id, quizData) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/quizzes/${id}`, quizData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Delete quiz
export const deleteQuiz = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/quizzes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Save quiz result
export const saveResult = async (resultData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/results", resultData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Get user-specific results
export const getUserResults = async (userId) => {
  const res = await api.get(`/results/user/${userId}`);
  return res.data;
};

export default api;
