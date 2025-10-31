import React from "react";

const QuizCard = ({ quiz }) => {
  return (
    <div
      className="quiz-card bg-white border border-gray-200 rounded-2xl 
      shadow-md hover:shadow-xl hover:-translate-y-1 
      transition-all duration-300 p-5 sm:p-6 flex flex-col 
      justify-between h-full w-full"
    >
      {/* ✅ Question */}
      <h3
        className="question text-base sm:text-lg md:text-xl 
        font-semibold mb-4 text-gray-800 leading-snug 
        text-center sm:text-left"
      >
        {quiz.question}
      </h3>

      {/* ✅ Options Section */}
      <div className="options mb-6">
        <p className="text-sm sm:text-base font-medium text-gray-700 mb-3 text-center sm:text-left">
          Options:
        </p>

        {quiz.options && quiz.options.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quiz.options.map((option, index) => (
              <li
                key={index}
                className="option py-2.5 px-4 bg-gray-100 rounded-lg 
                hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer 
                transition-all duration-200 ease-in-out text-center sm:text-left 
                text-sm sm:text-base font-medium break-normal whitespace-normal"
              >
                {option}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic text-center sm:text-left">
            No options available.
          </p>
        )}
      </div>

      {/* ✅ Details */}
      <div
        className="details mt-auto pt-3 border-t border-gray-100 
        text-xs sm:text-sm text-gray-600 
        flex flex-col sm:flex-row justify-between 
        items-center sm:items-start gap-2 sm:gap-0"
      >
        <p>
          <strong className="text-gray-700">Category:</strong>{" "}
          {quiz.category || "N/A"}
        </p>
        <p>
          <strong className="text-gray-700">Difficulty:</strong>{" "}
          {quiz.difficulty || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default QuizCard;
