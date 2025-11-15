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

const AdminDashboard = () => {
  const { user, logout } = useAuth();

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

  const TABS = [
    { id: "overview", label: "Overview", icon: SunIcon },
    { id: "quizzes", label: "Quizzes", icon: TableCellsIcon },
    ...(user?.role === "superadmin"
      ? [
          { id: "users", label: "Users", icon: UserIcon },
          { id: "requests", label: "Admin Requests", icon: BellAlertIcon },
        ]
      : []),
  ];

  useEffect(() => {
    fetchDashboardData();
    if (user?.role === "superadmin") {
      fetchUsers();
      fetchRequests();
    }
    // eslint-disable-next-line
  }, [page, user]);

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
    } catch {
      toast.error("Failed to load stats");
    }
  };

  const fetchUsers = async () => {
    try {
      if (user?.role !== "superadmin") return;
      const res = await getUsers();
      setUsersList(res.data || res);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const fetchRequests = async () => {
    try {
      if (user?.role !== "superadmin") return;
      const res = await getAdminRequests();
      setAdminRequests(res.data || res);
    } catch {
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

  // Actions
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
    } catch {
      toast.error("Failed to process request");
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    try {
      if (currentRole === "superadmin") {
        toast("Cannot change superadmin role", { icon: "⚠️" });
        return;
      }
      await toggleAdmin(id);
      toast.success("Role updated!");
      fetchUsers();

      if (id === user._id) logout();
    } catch {
      toast.error("Failed to update role");
    }
  };

  // Derived
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-indigo-100 shadow-xl">
        <div className="px-5 py-4 border-b border-indigo-50">
          <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            QuizNova Admin
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {user?.name} • {user?.role}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-indigo-50">
          <button
            onClick={logout}
            className="w-full text-sm bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition shadow"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Mobile Header + Tabs */}
        <header className="md:hidden mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                🧩 Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Manage quizzes, users & requests
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs shadow"
            >
              <PencilSquareIcon className="w-4 h-4" />
              New
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto py-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Desktop header bar */}
        <header className="hidden md:flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 flex items-center gap-3">
              <span>🧩</span> Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage quizzes, users & requests
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-full shadow-lg text-sm"
          >
            <PencilSquareIcon className="w-5 h-5" />
            New Quiz
          </button>
        </header>

        {/* ================== TAB PANELS ================== */}
        <section className="space-y-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    label: "Total Users",
                    value: stats.totalUsers,
                    color:
                      "from-blue-50 via-blue-100/70 to-blue-50 text-blue-800",
                  },
                  {
                    label: "Total Quizzes",
                    value: stats.totalQuizzes,
                    color:
                      "from-green-50 via-green-100/70 to-green-50 text-green-800",
                  },
                  {
                    label: "Total Attempts",
                    value: stats.totalAttempts,
                    color:
                      "from-yellow-50 via-yellow-100/70 to-yellow-50 text-yellow-800",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${card.color} p-4 sm:p-5 rounded-2xl text-center shadow-md`}
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold">
                      {card.value}
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm mt-1">
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border border-indigo-50">
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

                <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border border-indigo-50">
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

          {/* QUIZZES */}
          {activeTab === "quizzes" && (
            <section className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                <div className="flex-1">
                  <FilterBar
                    category={filterCategory}
                    setCategory={setFilterCategory}
                    difficulty={filterDifficulty}
                    setDifficulty={setFilterDifficulty}
                    search={search}
                    setSearch={setSearch}
                    categories={categories}
                    setPage={setPage}
                  />
                </div>
              </div>

              {/* Table / Cards */}
              <div className="w-full">
                {/* Desktop Table */}
                <div className="hidden sm:block w-full overflow-x-auto rounded-2xl bg-white border border-indigo-100 shadow-sm">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
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
                          className="border-t hover:bg-indigo-50/70 transition"
                        >
                          <td className="p-3 max-w-xs break-words">
                            {quiz.question}
                          </td>
                          <td className="p-3 capitalize">{quiz.category}</td>
                          <td className="p-3 capitalize">{quiz.difficulty}</td>
                          <td className="p-3">{quiz.correctAnswer}</td>
                          <td className="p-3 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => openEditModal(quiz)}
                                className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(quiz._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm"
                              >
                                Delete
                              </button>
                            </div>
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

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {filteredQuizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-50"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold mb-1 break-words">
                            {quiz.question}
                          </h4>
                          <div className="text-xs text-gray-500 flex gap-2 flex-wrap">
                            <span className="capitalize">{quiz.category}</span>
                            <span>•</span>
                            <span className="capitalize">
                              {quiz.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openEditModal(quiz)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(quiz._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-full text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-gray-600">
                        <strong>Answer:</strong> {quiz.correctAnswer}
                      </p>
                    </div>
                  ))}

                  {filteredQuizzes.length === 0 && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-gray-500">
                      No quizzes found.
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center mt-4 gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 rounded-lg text-sm ${
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
                    className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          )}

          {/* USERS (Superadmin) */}
          {user?.role === "superadmin" && activeTab === "users" && (
            <div className="space-y-4">
              {/* ===== Desktop Table ===== */}
              <div className="hidden sm:block w-full overflow-x-auto rounded-2xl shadow bg-white border border-indigo-100">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
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
                            className="w-10 h-10 rounded-full border object-cover"
                          />
                        </td>

                        <td className="p-3">{u.name}</td>
                        <td className="p-3 break-all">{u.email}</td>
                        <td className="p-3 capitalize font-semibold">
                          {u.role}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRoleToggle(u._id, u.role)}
                            className={`px-4 py-1 rounded-full text-white transition ${
                              u.role === "admin"
                                ? "bg-red-500 hover:bg-red-600"
                                : u.role === "superadmin"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={u.role === "superadmin"}
                          >
                            {u.role === "admin"
                              ? "Remove Admin"
                              : u.role === "superadmin"
                              ? "Superadmin"
                              : "Make Admin"}
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

              {/* ===== Mobile Cards ===== */}
              <div className="sm:hidden space-y-3">
                {usersList.map((u) => (
                  <div
                    key={u._id}
                    className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={u.avatar || "/default-avatar.png"}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border"
                      />
                      <div>
                        <p className="text-sm font-semibold">{u.name}</p>
                        <p className="text-xs text-gray-500 break-all">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          u.role === "superadmin"
                            ? "bg-gray-300 text-gray-800"
                            : u.role === "admin"
                            ? "bg-green-200 text-green-800"
                            : "bg-indigo-200 text-indigo-800"
                        }`}
                      >
                        {u.role}
                      </span>

                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        className={`px-3 py-1 text-xs rounded-full text-white ${
                          u.role === "admin"
                            ? "bg-red-500"
                            : u.role === "superadmin"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600"
                        }`}
                        disabled={u.role === "superadmin"}
                      >
                        {u.role === "admin"
                          ? "Remove"
                          : u.role === "superadmin"
                          ? "Locked"
                          : "Make Admin"}
                      </button>
                    </div>
                  </div>
                ))}

                {usersList.length === 0 && (
                  <div className="bg-white p-4 rounded-xl text-center text-gray-500">
                    No users found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADMIN REQUESTS (Superadmin) */}
          {user?.role === "superadmin" && activeTab === "requests" && (
            <div className="space-y-4">
              <div className="w-full overflow-x-auto rounded-2xl shadow bg-white/90 border border-purple-200">
                <table className="min-w-max w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminRequests.length > 0 ? (
                      adminRequests.map((req) => (
                        <tr
                          key={req._id}
                          className="border-t hover:bg-purple-50/70"
                        >
                          <td className="p-3">{req.name}</td>
                          <td className="p-3">{req.email}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() =>
                                handleAdminDecision(req._id, "approve")
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded-lg mx-1 text-xs sm:text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAdminDecision(req._id, "reject")
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded-lg mx-1 text-xs sm:text-sm"
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

        {/* QUIZ MODAL */}
        {showQuizModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setShowQuizModal(false);
                setEditingQuiz(null);
              }}
            />
            <div className="relative w-full max-w-3xl">
              <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {editingQuiz ? "Edit Quiz" : "Create Quiz"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowQuizModal(false);
                      setEditingQuiz(null);
                    }}
                    className="text-gray-500 hover:text-gray-800 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <QuizForm quiz={editingQuiz} onSuccess={onQuizSaved} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
