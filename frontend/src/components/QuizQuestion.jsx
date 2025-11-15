import React, { useState } from "react";

const QuizQuestion = ({ question, onAnswer }) => {
  const [locked, setLocked] = useState(false);

  if (!question) return null;

  const handleClick = (option) => {
    if (locked) return;
    setLocked(true);

    setTimeout(() => {
      onAnswer(option);
      setLocked(false);
    }, 500);
  };

  return (
    <div className="w-full mt-4 bg-white/90 border border-gray-200 rounded-2xl shadow-lg p-5 sm:p-6">
      {/* Question */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 text-center">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            disabled={locked}
            onClick={() => handleClick(option)}
            className="
              w-full py-3 px-4 rounded-xl 
              bg-gray-100 hover:bg-indigo-100 
              text-gray-800 font-medium 
              transition-all duration-200
              border border-gray-300
              active:scale-[0.97]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {option}
          </button>
        ))}
      </div>

      {/* Category & Difficulty */}
      <div className="flex justify-between mt-6 text-xs sm:text-sm text-gray-600">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {question.category}
        </span>
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 capitalize">
          {question.difficulty}
        </span>
      </div>
    </div>
  );
};

export default QuizQuestion;
