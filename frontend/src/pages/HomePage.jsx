import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Layers } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext) || {};
  // Fallback if context is not available for some reason
  const storedUser =
    user || JSON.parse(localStorage.getItem("user") || "null") || null;

  const headlineText = "Welcome to QuizNova 🎯";

  return (
    <main className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-6 md:px-8">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto pt-10 pb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-snug"
        >
          {headlineText}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          {storedUser
            ? `Hey ${storedUser.name}, test your skills, challenge yourself, and track your progress through fun, smart quizzes! 🚀`
            : "Sharpen your mind and have fun! Login or register to explore exciting quizzes across multiple categories — from MERN and JavaScript to general knowledge."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8"
        >
          {storedUser ? (
            <>
              <Link
                to="/attempt"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                🎯 Start a Quiz
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-white border border-indigo-200 text-indigo-700 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-300"
              >
                📊 My Dashboard
              </Link>
              {(storedUser?.role === "admin" ||
                storedUser?.role === "superadmin") && (
                <Link
                  to="/admin"
                  className="w-full sm:w-auto inline-flex justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  ⚙️ Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                🔐 Login
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex justify-center items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                📝 Register
              </Link>
            </>
          )}
        </motion.div>

        {/* Small trust indicators (optional, nice on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-2"
        >
          <span>⚡ Daily challenges, streaks & leaderboard</span>
          <span className="hidden sm:inline">•</span>
          <span>📈 Perfect for MERN & DSA interview prep</span>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-5xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-4 px-1 sm:px-2"
        >
          <article className="p-5 sm:p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Sparkles className="mx-auto text-indigo-600 mb-3" size={28} />
            <h3 className="font-semibold text-lg text-gray-800">
              Smart Quizzes
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Curated quizzes that feel fun but challenging — perfect for daily
              practice.
            </p>
          </article>

          <article className="p-5 sm:p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <BarChart3 className="mx-auto text-purple-600 mb-3" size={28} />
            <h3 className="font-semibold text-lg text-gray-800">
              Track Progress
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Visualize your performance with stats, streaks, and detailed
              results.
            </p>
          </article>

          <article className="p-5 sm:p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Layers className="mx-auto text-pink-600 mb-3" size={28} />
            <h3 className="font-semibold text-lg text-gray-800">
              Multiple Categories
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              From MERN and JavaScript to core CS concepts — all in one place.
            </p>
          </article>
        </motion.div>
      </section>
    </main>
  );
};

export default HomePage;
