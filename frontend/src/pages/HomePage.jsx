import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 sm:px-8 text-center bg-gray-50">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">
        Welcome to QuizNova 🎯
      </h1>

      <p className="text-base sm:text-lg text-gray-600 max-w-xl">
        {user
          ? `Test your knowledge and track your progress, ${user.name}!`
          : "Please login or register to access exciting quizzes."}
      </p>

      {user ? (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            to="/attempt"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Start a Quiz
          </Link>
          <Link
            to="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
          {
            user?.role ==="admin" && (
              <Link
              to="/admin"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition"
              >Admin Dashboard</Link>
            )
          }

        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
