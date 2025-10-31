import React from "react";
import { useNavigate } from "react-router-dom";

const FilterBar = ({ category, setCategory, difficulty, setDifficulty }) => {
  const navigate = useNavigate();

  const handleReset = () => {
    setCategory("");
    setDifficulty("");
  };

  return (
    <div className="filter-bar flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg w-full max-w-5xl mx-auto backdrop-blur-sm">
      
      {/* Category Filter */}
      <select
        aria-label="Filter by category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="select-filter p-3 rounded-lg w-full sm:w-44 md:w-56 text-gray-800 bg-white bg-opacity-90 border border-transparent hover:shadow-md focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all"
      >
        <option value="">All Categories</option>
        <option value="MERN Stack">MERN Stack</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node.js">Node.js</option>
      </select>

      {/* Difficulty Filter */}
      <select
        aria-label="Filter by difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="select-filter p-3 rounded-lg w-full sm:w-44 md:w-56 text-gray-800 bg-white bg-opacity-90 border border-transparent hover:shadow-md focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all"
      >
        <option value="">All Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Reset Filters Button */}
      <button
        onClick={handleReset}
        className="p-3 w-full sm:w-44 md:w-56 bg-white bg-opacity-90 text-gray-800 rounded-lg border border-transparent hover:bg-indigo-100 hover:text-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all font-medium"
      >
        Reset Filters
      </button>

      {/* Optional Start Quiz Button */}
      {/* 
      <button
        onClick={() => navigate("/attempt")}
        className="p-3 w-full sm:w-44 md:w-56 bg-white text-gray-800 rounded-lg border border-transparent hover:bg-indigo-100 hover:text-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all font-medium"
      >
        Start Quiz
      </button> 
      */}
    </div>
  );
};

export default FilterBar;
