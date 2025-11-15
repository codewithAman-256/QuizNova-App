import React, { useEffect, useState, useContext } from "react";
import { getFiveQuizzes, saveResult } from "../utils/api";
import QuizQuestion from "../components/QuizQuestion";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const QuizAttempt = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch 5 quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);

        const params = { category: "All Categories", limit: 5 };
        const data = await getFiveQuizzes(params);

        if (!data || data.length === 0) {
          setError("No quizzes available.");
        } else {
          setQuizzes(data);
        }
      } catch (err) {
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Handle answer
  const handleAnswer = async (selectedOption) => {
    const currentQuiz = quizzes[current];
    const isCorrect =
      selectedOption.trim().toLowerCase() ===
      currentQuiz.correctAnswer.trim().toLowerCase();

    const updatedScore = isCorrect ? score + 1 : score;

    // Next question
    if (current + 1 < quizzes.length) {
      setScore(updatedScore);
      setCurrent((prev) => prev + 1);
    } else {
      // End quiz, save result
      const percentage = Math.round((updatedScore / quizzes.length) * 100);

      try {
        await saveResult({
          score: updatedScore,
          totalQuestions: quizzes.length,
          percentage,
        });
      } catch (err) {
        console.log("Error saving:", err);
      }

      navigate("/result", {
        state: { score: updatedScore, total: quizzes.length },
      });
    }
  };

  // Loading UI
  if (loading) return <Loader text="Preparing Quiz..." />;

  if (error)
    return (
      <p className="text-center mt-20 text-red-600 text-lg font-medium">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-2xl rounded-3xl p-6 sm:p-8">

        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🧠 Quiz Challenge
        </h1>

        {/* Progress Bar */}
        <ProgressBar current={current + 1} total={quizzes.length} />

        {/* Question Component */}
        <QuizQuestion
          question={quizzes[current]}
          onAnswer={handleAnswer}
        />

        <div className="text-center text-gray-600 mt-4">
          <p>
            Question{" "}
            <span className="font-semibold text-indigo-700">
              {current + 1}
            </span>{" "}
            / {quizzes.length}
          </p>

          <p className="mt-2">
            Current Score:{" "}
            <span className="font-bold text-purple-600">{score}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
