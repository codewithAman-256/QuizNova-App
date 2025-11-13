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

  // ✅ Fetch quizzes (with optional filters)
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        // You can make these dynamic later (e.g., from dropdown)
        const params = { category: "All Categories", limit: 5 };
        const data = await getFiveQuizzes(params);

        if (!data || data.length === 0) {
          setError("No quizzes available in this category.");
        } else {
          setQuizzes(data);
        }
      } catch (err) {
        console.error("❌ Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // ✅ Handle user's answer
  const handleAnswer = async (selectedOption) => {
    const currentQuiz = quizzes[current];
    const isCorrect = selectedOption === currentQuiz.correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    if (current + 1 < quizzes.length) {
      setScore(updatedScore);
      setCurrent((prev) => prev + 1);
    } else {
      const percentage = Math.round((updatedScore / quizzes.length) * 100);

      try {
        await saveResult({
          score: updatedScore,
          totalQuestions: quizzes.length,
          percentage,
        });
      } catch (err) {
        console.error("❌ Error saving result:", err);
      }

      navigate("/result", {
        state: { score: updatedScore, total: quizzes.length },
      });
    }
  };

  // ✅ Loading state
  if (loading)
    return (
        <Loader text="Wait For Starting Quiz..."/>
    );

  // ✅ Error state
  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  // ✅ No quiz state
  if (quizzes.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-600 text-lg">
        No quizzes found for this category.
      </p>
    );
  }

  // ✅ Main quiz interface
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <ProgressBar current={current + 1} total={quizzes.length} />

      <QuizQuestion question={quizzes[current]} onAnswer={handleAnswer} />

      <p className="text-sm text-gray-600 mt-4 text-center">
        Question {current + 1} / {quizzes.length}
      </p>

      {/* ✅ Score preview during quiz */}
      <p className="text-center text-gray-700 mt-2">
        Current Score: <span className="font-semibold">{score}</span>
      </p>
    </div>
  );
};

export default QuizAttempt;
