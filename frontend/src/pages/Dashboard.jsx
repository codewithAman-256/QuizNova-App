import React from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserResults } from "../utils/api";
import { useFetch } from "../hooks/useFetch";
import PerformanceChart from "../components/PerformanceChart";
import ResultTable from "../components/ResultTable";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const {data: results, loading} = useFetch(()=>getUserResults(user._id),[user._id])

  if (loading) return <p className="text-center mt-10">Loading your results...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-0">
          👋 Welcome, {user?.name || "User"}
        </h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-8">
        <PerformanceChart results={results} />
      </div>

      <h3 className="text-xl font-semibold mb-4">Your Quiz History</h3>
      <div className="overflow-x-auto">
        <ResultTable results={results} />
      </div>
    </div>
  );
};

export default Dashboard;
