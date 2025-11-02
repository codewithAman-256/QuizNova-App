import React, { useState } from "react";

const QuizCard = ({ quiz, isPractice = false }) => {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option) => {
    if (isAnswered) return; // prevent double click
    setSelected(option);
    setIsAnswered(true);
  };

  const getOptionClass = (option) => {
    const isCorrect =
      quiz.correctAnswer &&
      option.trim().toLowerCase() === quiz.correctAnswer.trim().toLowerCase();

    if (isAnswered) {
      if (option === selected && isCorrect)
        return "bg-green-100 text-green-800 border-green-400";
      if (option === selected && !isCorrect)
        return "bg-red-100 text-red-800 border-red-400";
      if (isCorrect) return "bg-green-50 text-green-700 border-green-200";
      return "bg-gray-100 text-gray-700";
    }

    // before answering
    return isPractice
      ? isCorrect
        ? "bg-gray-100 hover:bg-green-100 hover:text-green-800"
        : "bg-gray-100 hover:bg-gray-200"
      : "bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700";
  };

  return (
    <div
      className="quiz-card bg-white border border-gray-200 rounded-2xl 
      shadow-md hover:shadow-xl hover:-translate-y-1 
      transition-all duration-300 p-5 sm:p-6 flex flex-col 
      justify-between h-full w-full overflow-hidden box-border"
    >
      {/* ✅ Question */}
      <h3
        className="question text-base sm:text-lg md:text-xl 
        font-semibold mb-4 text-gray-800 leading-snug 
        text-center sm:text-left break-words"
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
                onClick={() => handleSelect(option)}
                className={`option flex items-center justify-center sm:justify-start
                  min-h-[60px] sm:min-h-[70px] px-4 py-2 
                  rounded-lg font-medium text-sm sm:text-base
                  text-center sm:text-left break-words
                  cursor-pointer transition-all duration-200 ease-in-out 
                  ${getOptionClass(option)}
                `}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "normal",
                }}
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
