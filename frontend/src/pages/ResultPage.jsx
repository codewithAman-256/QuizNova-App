import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  if (!state)
    return (
      <p className="text-center mt-24 text-gray-600 text-lg sm:text-xl">
        No result data found.
      </p>
    );

  const { score, total } = state;
  const percentage = Math.round((score / total) * 100);

  // 🎉 Stop confetti after few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // 🪟 Handle window resize
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 relative px-4 sm:px-6">
      {/* 🎊 Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={250}
        />
      )}

      {/* 🧩 Result Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md text-center border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-700">
          Quiz Completed 🎉
        </h2>

        {/* 🟣 Circular Progress Bar */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              textColor: "#4f46e5",
              pathColor: percentage >= 50 ? "#10b981" : "#ef4444",
              trailColor: "#e5e7eb",
              textSize: "16px",
              pathTransitionDuration: 1.2,
            })}
          />
        </div>

        {/* 🧾 Score Info */}
        <p className="text-base sm:text-lg font-semibold mb-2 text-gray-700">
          Score: {score} / {total}
        </p>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          {percentage >= 80
            ? "🔥 Excellent work!"
            : percentage >= 50
            ? "👍 Good effort!"
            : "💪 Keep practicing!"}
        </p>

        {/* 🧭 Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/attempt")}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm sm:text-base"
          >
            Try Again 🔁
          </button>

          <button
            onClick={() => navigate("/quizList")}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm sm:text-base"
          >
            Back to Quizzes 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
