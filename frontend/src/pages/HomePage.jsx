import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Layers } from "lucide-react";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-6 md:px-8 text-center">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mt-10 sm:mt-0">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-snug"
        >
          Welcome to QuizNova 🎯
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          {user
            ? `Hey ${user.name}, test your skills, challenge yourself, and track your progress through fun, smart quizzes! 🚀`
            : "Sharpen your mind and have fun! Login or register to explore hundreds of exciting quizzes across multiple categories."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8"
        >
          {user ? (
            <>
              <Link
                to="/attempt"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                🎯 Start a Quiz
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-white border border-indigo-200 text-indigo-700 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-300"
              >
                📊 My Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  ⚙️ Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                🔐 Login
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                📝 Register
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-16 w-full max-w-5xl px-4"
      >
        <div className="p-5 sm:p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
          <Sparkles className="mx-auto text-indigo-600 mb-3" size={28} />
          <h3 className="font-semibold text-lg text-gray-800">Smart Quizzes</h3>
          <p className="text-sm text-gray-500 mt-2">
            Curated quizzes that adapt to your skill level — fun and
            challenging!
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
          <BarChart3 className="mx-auto text-purple-600 mb-3" size={28} />
          <h3 className="font-semibold text-lg text-gray-800">
            Track Progress
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Visualize your performance and keep improving with insights.
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
          <Layers className="mx-auto text-pink-600 mb-3" size={28} />
          <h3 className="font-semibold text-lg text-gray-800">
            Multiple Categories
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Explore topics like MERN, JavaScript, React, and more — all in one
            place.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
