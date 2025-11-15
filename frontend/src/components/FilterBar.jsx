import React from "react";
import { Search } from "lucide-react";

const FilterBar = ({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  search,
  setSearch,
  categories,
  setPage,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-indigo-100 shadow-xl transition-all duration-300">

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

        {/* Search */}
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-1/4 px-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full sm:w-1/4 px-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setSearch("");
            setCategory("");
            setDifficulty("");
            setPage(1);
          }}
          className="w-full sm:w-1/4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition"
        >
          Reset
        </button>
      </div>

      {/* Underline animation */}
      <div className="h-[2px] mt-5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
    </div>
  );
};

export default FilterBar;
