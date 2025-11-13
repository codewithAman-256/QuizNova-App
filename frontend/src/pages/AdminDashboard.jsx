/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  getQuizzes,
  getAdminStats,
  deleteQuiz,
  getUsers,
  toggleAdmin,
  getAdminRequests,
  processAdminRequest,
} from "../utils/api";
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
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import {
  SunIcon,
  TableCellsIcon,
  UserIcon,
  BellAlertIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TABS = [
  { id: "overview", label: "Overview", icon: SunIcon },
  { id: "quizzes", label: "Quizzes", icon: TableCellsIcon },
  { id: "users", label: "Users", icon: UserIcon },
  { id: "requests", label: "Admin Requests", icon: BellAlertIcon },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [adminRequests, setAdminRequests] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    categoryStats: [],
  });

  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Users (RBAC)
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchRequests();
    // eslint-disable-next-line
  }, [page]);

  // fetch all primary dashboard data
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
      const data = await getAdminStats();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalQuizzes: data.totalQuizzes || 0,
        totalAttempts: data.totalAttempts || 0,
        categoryStats: data.categoryStats || [],
      });
    } catch (err) {
      toast.error("Failed to load stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsersList(res.data || res);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await getAdminRequests();
      setAdminRequests(res.data || res);
    } catch (err) {
      toast.error("Failed to load admin requests");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes({
        search,
        page,
        limit: 8,
        category: filterCategory,
        difficulty: filterDifficulty,
      });

      setQuizzes(data.quizzes || []);
      setFilteredQuizzes(data.quizzes || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Failed to load quizzes");
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line
  }, [page, search, filterCategory, filterDifficulty]);

  // -------- Actions --------
  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      toast.success("Quiz deleted!");
      fetchQuizzes();
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  const openCreateModal = () => {
    setEditingQuiz(null);
    setShowQuizModal(true);
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setShowQuizModal(true);
  };

  const onQuizSaved = () => {
    setShowQuizModal(false);
    setEditingQuiz(null);
    fetchQuizzes();
  };

  const handleAdminDecision = async (id, decision) => {
    try {
      await processAdminRequest(id, decision);
      toast.success(`Request ${decision}ed`);
      fetchRequests();
      fetchUsers();
    } catch (err) {
      toast.error("Failed to process request");
    }
  };

  const handleRoleToggle = async (id) => {
    try {
      await toggleAdmin(id);
      toast.success("Role updated!");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  // derived
  const categories = [
    ...new Set(quizzes.map((q) => q.category).filter(Boolean)),
  ];

  const barData = {
    labels: stats.categoryStats.map((c) => c._id),
    datasets: [
      {
        label: "Quizzes per Category",
        data: stats.categoryStats.map((c) => c.count),
        backgroundColor: "rgba(99,102,241,0.8)",
      },
    ],
  };

  const pieData = {
    labels: ["Users", "Quizzes", "Attempts"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalQuizzes, stats.totalAttempts],
        backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
      },
    ],
  };

  if (loading) return <Loader text="Loading your Admin Panel..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
            <span>🧩</span> Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage quizzes, users & requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <PencilSquareIcon className="w-5 h-5" />
            New Quiz
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav
        className="
  flex gap-2 items-center mb-6 
  overflow-x-auto scrollbar-none 
  py-2 px-1
"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap 
          px-4 py-2 rounded-full transition-all text-sm
          ${
            active
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border border-gray-200 hover:shadow-sm"
          }
        `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* TAB PANELS */}
      <section>
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  color: "from-blue-100 to-blue-50 text-blue-700",
                },
                {
                  label: "Total Quizzes",
                  value: stats.totalQuizzes,
                  color: "from-green-100 to-green-50 text-green-700",
                },
                {
                  label: "Total Attempts",
                  value: stats.totalAttempts,
                  color: "from-yellow-100 to-yellow-50 text-yellow-700",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${card.color} p-5 rounded-xl text-center shadow-lg`}
                >
                  <h3 className="text-3xl font-bold">{card.value}</h3>
                  <p className="text-gray-600">{card.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-4">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                  📊 Quizzes by Category
                </h4>
                <div className="w-full h-64 md:h-80">
                  <Bar
                    data={barData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                  📈 Overall Stats
                </h4>
                <div className="w-full h-64 md:h-80">
                  <Pie
                    data={pieData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <FilterBar
                category={filterCategory}
                setCategory={setFilterCategory}
                difficulty={filterDifficulty}
                setDifficulty={setFilterDifficulty}
                search={search}
                setSearch={setSearch}
                categories={categories}
                setpage={setPage}
              />
              
            </div>

            <div className="w-full overflow-x-auto rounded-xl shadow bg-white border border-indigo-100">
              <table className="min-w-max w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm">
                    <th className="p-3 text-left">Question</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Difficulty</th>
                    <th className="p-3 text-left">Correct Answer</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuizzes.map((quiz) => (
                    <tr
                      key={quiz._id}
                      className="border-t hover:bg-indigo-50 transition text-sm"
                    >
                      <td className="p-3 max-w-[250px] break-words">
                        {quiz.question}
                      </td>
                      <td className="p-3 capitalize">{quiz.category}</td>
                      <td className="p-3 capitalize">{quiz.difficulty}</td>
                      <td className="p-3">{quiz.correctAnswer}</td>

                      <td className="p-3 flex flex-col sm:flex-row justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(quiz)}
                          className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-green-500 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(quiz._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-black hover:text-red-500 transition"
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
                        No quizzes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center mt-4 gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-2 rounded-lg ${
                      page === i + 1
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-white text-gray-700 hover:bg-indigo-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="w-full overflow-x-auto rounded-xl shadow bg-white border border-indigo-100">
              <table className="min-w-max w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm">
                    <th className="p-3 text-left">Avatar</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {usersList.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t hover:bg-purple-50 transition text-sm"
                    >
                      <td className="p-3">
                        <img
                          src={u.avatar || "/default-avatar.png"}
                          alt="avatar"
                          className="w-10 h-10 rounded-full border"
                        />
                      </td>

                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize font-semibold">{u.role}</td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRoleToggle(u._id)}
                          className={`px-4 py-1 rounded-full text-white transition ${
                            u.role === "admin"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {usersList.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Requests */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <div className="w-full overflow-x-auto rounded-xl shadow bg-white border border-purple-200">
              <table className="min-w-max w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {adminRequests.length > 0 ? (
                    adminRequests.map((req) => (
                      <tr key={req._id} className="border-t hover:bg-purple-50">
                        <td className="p-3">{req.name}</td>
                        <td className="p-3">{req.email}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              handleAdminDecision(req._id, "approve")
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded-lg mx-1"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleAdminDecision(req._id, "reject")
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded-lg mx-1"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-5 text-gray-500"
                      >
                        No requests pending.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ---------- Quiz Modal ---------- */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowQuizModal(false)}
          />
          <div className="relative w-full max-w-3xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  {editingQuiz ? "Edit Quiz" : "Create Quiz"}
                </h3>
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <QuizForm
                quiz={editingQuiz}
                onSuccess={() => {
                  onQuizSaved();
                }}
                onCancel={() => {
                  setShowQuizModal(false);
                  setEditingQuiz(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
