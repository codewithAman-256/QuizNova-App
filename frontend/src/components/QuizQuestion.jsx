import React from "react";

const QuizQuestion = ({ question, onAnswer }) => {
  if (!question) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border p-6 w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
        {question.question}
      </h2>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Options:</p>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className="w-full bg-gray-100 hover:bg-indigo-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition text-sm sm:text-base"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 mt-4">
        <span>
          <strong>Category:</strong> {question.category}
        </span>
        <span>
          <strong>Difficulty:</strong> {question.difficulty}
        </span>
      </div>
    </div>
  );
};

export default QuizQuestion;
