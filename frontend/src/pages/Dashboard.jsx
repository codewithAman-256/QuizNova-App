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

  if (loading) {
    return <Loader text="Loading your results..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/90 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-lg p-6">
        
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
            👋 Hey {user?.name || "User"},
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Welcome back! Here’s your learning progress 📊
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-5 sm:mt-0 bg-red-500 text-white px-6 py-2 rounded-xl shadow hover:bg-red-600 hover:shadow-md transition-all w-full sm:w-auto"
        >
          🚪 Logout
        </button>
      </div>

      {/* PERFORMANCE CHART CARD */}
      <div className="bg-white/90 backdrop-blur-md border border-indigo-100 shadow-xl rounded-2xl p-4 sm:p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          📈 Performance Overview
        </h3>
        <PerformanceChart results={results} />
      </div>

      {/* QUIZ HISTORY */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        📝 Your Quiz History
      </h3>

      <div className="bg-white/90 backdrop-blur-md border border-indigo-100 shadow-lg rounded-2xl overflow-x-auto">
        <ResultTable results={results} />
      </div>

    </div>
  );
};

export default Dashboard;
