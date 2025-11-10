import { useEffect, useState } from "react";
import { getLeaderboard } from "../utils/api.js";
import Loader from "../components/Loader.jsx";
import { Medal, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setUsers(data);
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-indigo-700">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="text-3xl sm:text-4xl font-extrabold">Leaderboard</h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          🧠 Keep playing quizzes to climb the ranks and earn glory!
        </p>
      </div>

      {/* Top 3 Podium */}
      {users.length > 0 && (
        <div className="flex justify-center items-end gap-4 mb-10 flex-wrap ">
          {users.slice(0, 3).map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex flex-col items-center bg-white shadow-xl rounded-2xl p-4 w-28 sm:w-36 ${
                i === 0
                  ? "h-40 border-2 border-yellow-400"
                  : i === 1
                  ? "h-32 border-2 border-gray-300"
                  : "h-28 border-2 border-amber-600"
              }`}
            >
              <Medal
                size={28}
                className={`${
                  i === 0
                    ? "text-yellow-400"
                    : i === 1
                    ? "text-gray-400"
                    : "text-amber-700"
                } mb-1`}
              />
              <span className="font-semibold text-gray-800 truncate w-full text-center">
                {user.name}
              </span>
              <span className="text-blue-600 font-bold text-lg mt-1">
                {user.totalScore || 0} pts
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg border border-indigo-100 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header Row */}
        <div className="grid grid-cols-5 bg-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 font-semibold text-xs sm:text-base rounded-t-2xl">
          <span>#</span>
          <span className="truncate">Attempts</span>
          <span className="text-left">Player</span>
          <span className="text-center">Score</span>
          <span className="text-center">Avg %</span>
        </div>

        {/* Rows */}
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No players yet 😅</p>
        ) : (
          users.map((user, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              className={`grid grid-cols-5 items-center py-2 sm:py-3 px-4 sm:px-6 border-b border-gray-100 transition-all ${
                i < 3
                  ? "bg-gradient-to-r from-indigo-100 to-purple-50 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-2 text-gray-800 ">
                {i === 0 && <Medal className="text-yellow-500 " size={16} />}
                {i === 1 && <Medal className="text-gray-400" size={16} />}
                {i === 2 && <Medal className="text-amber-700" size={16} />}
                <span>{i + 1}</span>
              </div>

              {/* Attempts */}
              <span className="text-gray-700 text-center  sm:pr-17">
                {user.attempts || 0}
              </span>

              {/* Player */}
              <span className="truncate text-gray-700">{user.name}</span>

              {/* Score */}
              <span className="text-center text-blue-600 font-semibold">
                {user.totalScore || 0}
              </span>

              {/* Avg % */}
              <span className="text-center">
                {user.averagePercentage
                  ? user.averagePercentage.toFixed(1)
                  : 0}
                %
              </span>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-500 text-sm mt-6 flex justify-center items-center gap-1"
      >
        <Sparkles className="w-4 h-4 text-yellow-400" />
        Keep learning, keep winning! ✨
      </motion.p>
    </div>
  );
};

export default Leaderboard;
