/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getLeaderboard } from "../utils/api.js";
import Loader from "../components/Loader.jsx";
import { Medal, Trophy, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      console.log("LEADERBOARD USERS:", data);  // ⬅ ADD THIS
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchLeaderboard();
}, []);


  if (loading)
    return <Loader text="Loading Leaderboard..." />;

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

const getAvatar = (u) =>
  u.avatar ||
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    u.name
  )}&backgroundType=gradientLinear`;




  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-4 sm:p-6">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-indigo-700 mb-1">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Leaderboard
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Compete, learn & climb the ranks 🔥
        </p>
      </div>

      {/* ===== Top 3 Podium ===== */}
      {top3.length > 0 && (
        <div className="flex justify-center items-end gap-4 mb-14 flex-wrap">

          {top3.map((user, i) => {
            const colors = [
              "border-yellow-400 bg-yellow-50",
              "border-gray-300 bg-gray-50",
              "border-amber-600 bg-orange-50",
            ];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`
                  flex flex-col items-center p-4 rounded-2xl shadow-xl w-28 sm:w-36
                  border-2 ${colors[i]} backdrop-blur-xl
                  ${i === 0 ? "h-44" : i === 1 ? "h-36" : "h-32"}
                `}
              >
                <Crown
                  size={28}
                  className={`
                    mb-1
                    ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-700"}
                  `}
                />

                <img
                  src={getAvatar(user)}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-2"
                />

                <span className="font-semibold text-gray-800 text-sm truncate w-full text-center">
                  {user.name}
                </span>

                <span className="text-indigo-600 font-bold text-lg">
                  {user.totalScore || 0} pts
                </span>
              </motion.div>
            );
          })}

        </div>
      )}

      {/* ===== Leaderboard Table ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-indigo-100
                   rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-6 bg-indigo-600 text-white py-3 px-4 sm:px-6 font-semibold text-xs sm:text-sm">
          <span>#</span>
          <span className="hidden sm:block">Avatar</span>
          <span className="col-span-2 sm:col-span-1 text-left">Player</span>
          <span className="text-center">Score</span>
          <span className="text-center">Avg %</span>
        </div>

        {/* Players */}
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No players yet 😅</p>
        ) : (
          users.map((user, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              className={`
                grid grid-cols-6 items-center py-3 px-4 sm:px-6 border-b border-gray-100
                transition-all
                ${i < 3 ? "bg-indigo-50 font-semibold" : "hover:bg-gray-100"}
              `}
            >
              {/* Rank */}
              <div className="flex items-center gap-2 text-gray-800">
                {i === 0 && <Medal className="text-yellow-500" size={16} />}
                {i === 1 && <Medal className="text-gray-400" size={16} />}
                {i === 2 && <Medal className="text-amber-700" size={16} />}
                <span>{i + 1}</span>
              </div>

              {/* Avatar */}
              <div className="hidden sm:block">
                <img
                  src={getAvatar(user)}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              </div>

              {/* Player name */}
              <span className="col-span-2 sm:col-span-1 truncate text-gray-700">
                {user.name}
              </span>

              {/* Total Score */}
              <span className="text-center text-indigo-600 font-semibold">
                {user.totalScore || 0}
              </span>

              {/* Avg Percentage */}
              <span className="text-center font-medium">
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
        transition={{ delay: 0.5 }}
        className="text-center mt-6 text-gray-500 text-sm flex items-center justify-center gap-1"
      >
        <Sparkles className="w-4 h-4 text-yellow-400" />
        Keep learning, keep winning! ✨
      </motion.p>
    </div>
  );
};

export default Leaderboard;
