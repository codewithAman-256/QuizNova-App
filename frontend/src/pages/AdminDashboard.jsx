import React, { useState, useEffect } from "react";
import { getQuizzes, deleteQuiz } from "../utils/api";
import QuizForm from "../components/QuizForm";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await getQuizzes();
      setQuizzes(res);
      setFilteredQuizzes(res);
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700">
        🧩 Admin Dashboard – Manage Quizzes
      </h2>

      {/* ➕ Quiz Form */}
      <QuizForm
        quiz={editingQuiz}
        onSuccess={() => {
          setEditingQuiz(null);
          fetchQuizzes();
        }}
      />

      {/* 🔍 Filters Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
                  className="text-center py-6 text-gray-500 text-sm sm:text-base"
                >
                  No quizzes found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
