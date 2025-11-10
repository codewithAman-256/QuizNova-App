/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getQuizzes, getAdminStats, deleteQuiz } from "../utils/api";
import QuizForm from "../components/QuizForm";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    categoryStats: [],
  });
  const [loading, setLoading] = useState(true);
  // 🧭 Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Load data
  useEffect(() => {
    fetchDashboardData();
  }, [page]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchStats(), fetchQuizzes()]);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAdminStats(user.token);
      setStats({
        totalUsers: data.totalUsers || 0,
        totalQuizzes: data.totalQuizzes || 0,
        totalAttempts: data.totalAttempts || 0,
        categoryStats: data.categoryStats || [],
      });
    } catch (error) {
      toast.error("Failed to load stats");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes({ search, page, limit: 5 }); // ✅ pass search + pagination
      setQuizzes(data.quizzes || []);
      setTotalPages(data.totalPages || 1);
      setFilteredQuizzes(data.quizzes || []);
    } catch (error) {
      toast.error("Failed to load quizzes");
    }
  };

  // 🔍 Filter logic
  useEffect(() => {
    let data = quizzes;

    if (search.trim()) {
      data = data.filter((q) =>
        q.question.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCategory !== "All") {
      data = data.filter((q) => q.category === filterCategory);
    }
    if (filterDifficulty !== "All") {
      data = data.filter((q) => q.difficulty === filterDifficulty);
    }
    setFilteredQuizzes(data);
  }, [search, filterCategory, filterDifficulty, quizzes]);

  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      toast.success("Quiz deleted!");
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const categories = [
    "All",
    ...new Set(quizzes.map((q) => q.category).filter(Boolean)),
  ];

  const barData = {
    labels: stats.categoryStats?.map((c) => c._id) || [],
    datasets: [
      {
        label: "Quizzes per Category",
        data: stats.categoryStats?.map((c) => c.count) || [],
        backgroundColor: "rgba(99, 102, 241, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Users", "Quizzes", "Attempts"],
    datasets: [
      {
        data: [
          stats.totalUsers || 0,
          stats.totalQuizzes || 0,
          stats.totalAttempts || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-indigo-600">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-lg font-medium animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        🧩 Admin Dashboard – Manage & Analyze Quizzes
      </h1>

      {/* 📊 Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-semibold text-blue-700">
            {stats.totalUsers}
          </h3>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-semibold text-green-700">
            {stats.totalQuizzes}
          </h3>
          <p className="text-gray-600">Total Quizzes</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-semibold text-yellow-700">
            {stats.totalAttempts}
          </h3>
          <p className="text-gray-600">Total Attempts</p>
        </div>
      </div>

      {/* 📈 Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div className="bg-white shadow p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            📈 Quizzes by Category
          </h4>
          {stats.categoryStats.length > 0 ? (
            <Bar data={barData} />
          ) : (
            <p className="text-gray-500 text-center py-10 italic">
              No category data available.
            </p>
          )}
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            📊 Overall Distribution
          </h4>
          <Pie data={pieData} />
        </div>
      </div>

      {/* ➕ Quiz Form */}
      <QuizForm
        quiz={editingQuiz}
        onSuccess={() => {
          setEditingQuiz(null);
          fetchQuizzes();
        }}
      />

      {/* 🔍 Filters Section */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto focus:ring-2 focus:ring-indigo-400"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* 📋 Quizzes Table */}
      <div className="overflow-x-auto mt-8 rounded-lg shadow">
        <table className="w-full border border-gray-200 text-sm sm:text-base">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="p-2 sm:p-3 text-left">Question</th>
              <th className="p-2 sm:p-3 text-left">Category</th>
              <th className="p-2 sm:p-3 text-left">Difficulty</th>
              <th className="p-2 sm:p-3 text-left">Correct Answer</th>
              <th className="p-2 sm:p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr
                key={quiz._id}
                className="border-t hover:bg-indigo-50 transition"
              >
                <td className="p-2 sm:p-3">{quiz.question}</td>
                <td className="p-2 sm:p-3">{quiz.category}</td>
                <td className="p-2 sm:p-3">{quiz.difficulty}</td>
                <td className="p-2 sm:p-3">{quiz.correctAnswer}</td>
                <td className="p-2 sm:p-3 text-center space-x-2">
                  <button
                    onClick={() => setEditingQuiz(quiz)}
                    className="bg-blue-500 text-white px-3 m-1 pt-1 pb-1 pl-6 pr-6  rounded-full hover:text-black hover:bg-green-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="bg-red-500 text-white px-3 pt-1 pb-1 pl-4 pr-4 rounded-full hover:bg-black hover:text-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredQuizzes.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No quizzes found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination Controls */}

      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
