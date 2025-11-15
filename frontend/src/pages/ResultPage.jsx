import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Loader from "../components/Loader";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // No state passed → invalid access
  if (!state)
    return (
      <p className="text-center mt-24 text-gray-600 text-lg sm:text-xl">
        No result data found.
      </p>
    );

  const { score, total } = state;
  const percentage = Math.round((score / total) * 100);

  // Confetti stops after 5 sec
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Window resize logic
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    setLoading(false);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <Loader text="Preparing your result..." />;

  // Badge styling
  const getBadge = () => {
    if (percentage >= 80)
      return (
        <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
          🏆 Excellent
        </span>
      );
    if (percentage >= 50)
      return (
        <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
          👍 Good Job
        </span>
      );
    return (
      <span className="px-4 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-sm">
        💪 Keep Improving
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center px-4 py-10 relative">

      {/* CONFETTI */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      {/* RESULT CARD */}
      <div className="bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-md w-full text-center">

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Quiz Completed 🎉
        </h1>

        {/* Badge */}
        <div className="mb-4">{getBadge()}</div>

        {/* Circular Progress */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto my-6">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              textColor: "#4F46E5",
              textSize: "16px",
              trailColor: "#E5E7EB",
              pathColor:
                percentage >= 80
                  ? "#10B981"
                  : percentage >= 50
                  ? "#F59E0B"
                  : "#EF4444",
              pathTransitionDuration: 1.2,
            })}
          />
        </div>

        {/* Score */}
        <p className="text-lg font-semibold text-gray-700">
          Score: {score} / {total}
        </p>

        <p className="text-sm text-gray-500 mt-2 mb-6">
          {percentage >= 80
            ? "🔥 Outstanding performance!"
            : percentage >= 50
            ? "👏 Great effort!"
            : "💪 Don't give up — keep practicing!"}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

          <button
            onClick={() => navigate("/attempt")}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            🔁 Try Again
          </button>

          <button
            onClick={() => navigate("/quizList")}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            🏠 Back to Quizzes
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;
