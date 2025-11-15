import React from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserResults } from "../utils/api";
import { useFetch } from "../hooks/useFetch";
import PerformanceChart from "../components/PerformanceChart";
import ResultTable from "../components/ResultTable";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { data: results, loading } = useFetch(
    () => getUserResults(user._id),
    [user._id]
  );

  if (loading) return <Loader text="Loading your results..." />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER CARD */}
        <div className="bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              👋 Hey {user?.name || "User"},
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Welcome back! Let’s check your performance 📊
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-red-600 hover:shadow-xl transition-all w-full sm:w-auto"
          >
            🚪 Logout
          </button>
        </div>

        {/* PERFORMANCE OVERVIEW */}
        <div className="bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl p-6 sm:p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 flex gap-2 mb-4">
            📈 Performance Overview
          </h3>
          <PerformanceChart results={results} />
        </div>

        {/* QUIZ HISTORY TABLE */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex gap-2">
            📝 Your Quiz History
          </h3>
        </div>

        <ResultTable results={results} />
      </div>
    </div>
  );
};

export default Dashboard;
