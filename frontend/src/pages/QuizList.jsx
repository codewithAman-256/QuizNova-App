import React, { useEffect, useState } from "react";
import { getQuizzes } from "../utils/api";
import QuizCard from "../components/QuizCard";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5); // ✅ default 5 quizzes
  const [error, setError] = useState(null);

  // ✅ Fetch quizzes (supports filters + limit)
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", limit);
      params.append("random", "true");
      if (category) params.append("category", category);
      if (difficulty) params.append("difficulty", difficulty);

      const data = await getQuizzes(`?${params.toString()}`);
      setQuizzes(data);
    } catch (err) {
      console.error("❌ Error fetching quizzes:", err);
      toast.error("Failed to load quizzes");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on mount & when filters change
  useEffect(() => {
    fetchQuizzes();
  }, [category, difficulty, limit]);

  if (loading) return <Loader />;
  if (error)
    return (
      <p className="text-red-600 text-center mt-10 text-lg">
        Something went wrong: {error}
      </p>
    );

  return (
    <div className="p-4 sm:p-6 min-h-[80vh] bg-linear-to-br from-gray-50 via-white to-indigo-50 transition-all duration-300">
      {/* Header */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center sm:text-center drop-shadow-sm" >
        🧠 Available Quizzes
      </h1>

      {/* Filter Bar */}
      <FilterBar
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      {/* Quiz Cards */}
      {quizzes.length > 0 ? (
        <>
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              gap-6 
              mt-8
              px-2
              sm:px-4
              animate-fade-in
            "
          >
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* ✅ Show More Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setLimit((prev) => prev + 5)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              Show More
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center mt-10 text-lg">
          No quizzes found. Try changing filters!
        </p>
      )}
    </div>
  );
};

export default QuizList;
