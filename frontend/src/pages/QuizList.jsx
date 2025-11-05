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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // ✅ Debounce Search (delay API call while typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // ✅ Fetch quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizzes({
        page,
        limit,
        category,
        difficulty,
        search: debouncedSearch,
      });

      // handle different possible backend shapes
      const quizList = data?.quizzes || (Array.isArray(data) ? data : []);
      setQuizzes(quizList);
      setTotalPages(data?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching quizzes:", err);
      toast.error("Failed to load quizzes");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refetch when filters, debounced search, or page changes
  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty, debouncedSearch, page]);

  // ✅ Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [category, difficulty, search]);

  // ✅ Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-600 text-center text-lg">
          ⚠️ Something went wrong: {error}
        </p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 min-h-[80vh] bg-gradient-to-br from-gray-50 via-white to-indigo-50 transition-all duration-300">
      {/* Header */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center drop-shadow-sm animate-fade-in">
        🧠 Explore Quizzes
      </h1>

      {/* Filters */}
      <FilterBar
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        search={search}
        setSearch={setSearch}
      />

      {/* Quiz Cards */}
      {quizzes.length === 0 ? (
        <p className="text-gray-600 text-center mt-16 text-lg animate-fade-in">
          😕 No quizzes found. Try adjusting filters or search terms!
        </p>
      ) : (
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
              animate-fade-in-slow
            "
          >
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-10 gap-2 flex-wrap animate-fade-in">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={`px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 font-medium hover:bg-indigo-100 transition-all ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    page === i + 1
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-white text-gray-700 hover:bg-indigo-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 font-medium hover:bg-indigo-100 transition-all ${
                  page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;
