import React, { useEffect, useState, useCallback } from "react";
import { getQuizzes } from "../utils/api";
import QuizCard from "../components/QuizCard";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    try {
      setFetching(true);

      const data = await getQuizzes({
        page,
        limit,
        category,
        difficulty,
        search: debouncedSearch,
      });

      const quizList = data?.quizzes || (Array.isArray(data) ? data : []);
      setQuizzes(quizList);
      setTotalPages(data?.totalPages || 1);
      setError(null);
    } catch (err) {
      toast.error("Failed to load quizzes");
      setError(err.message);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [page, limit, category, difficulty, debouncedSearch]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, difficulty, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (loading) return <Loader text="Loading Quizzes..." />;

  if (error)
    return (
      <p className="text-red-600 text-center mt-10 text-lg">
        Something went wrong: {error}
      </p>
    );

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow mb-8">
          🧠 Explore Quizzes
        </h1>

        {/* Filter Bar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          categories={[...new Set(quizzes.map((q) => q.category))]}
          setPage={setPage}
        />

        {/* Fetching indicator */}
        {fetching && (
          <p className="text-indigo-500 text-center mt-4 animate-pulse">
            Updating results...
          </p>
        )}

        {/* Quiz Cards Grid */}
        {quizzes.length === 0 ? (
          <p className="text-gray-700 text-center mt-12 text-lg">
            😕 No quizzes found. Try different filters!
          </p>
        ) : (
          <div
            className="
              grid 
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
              mt-8
              animate-fade-in
            "
          >
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={`px-4 py-2 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-100 transition ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 rounded-xl transition-all ${
                  page === i + 1
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-100 transition ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
