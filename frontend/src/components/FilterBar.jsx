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
  setPage
}) => {
    return (
      <div className="w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
          {/* ✅ Search Bar */}
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400" />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/4 px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full sm:w-1/4 px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setDifficulty("");
              setPage(1);
            } }
            className="w-full sm:w-1/4  py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-2">

        </div>

        {/* Subtle Animation Underline */}
        <div className="h-[2px] mt-5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
      </div>
    );
  };

export default FilterBar;
