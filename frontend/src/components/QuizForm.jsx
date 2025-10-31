import React, { useState, useEffect } from "react";
import { createQuiz, updateQuiz } from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const QuizForm = ({ quiz, onSuccess }) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    category: "",
    difficulty: "Easy",
  });

  useEffect(() => {
    if (quiz) {
      setForm({
        question: quiz.question,
        options: quiz.options || ["", "", "", ""],
        correctAnswer: quiz.correctAnswer || "",
        category: quiz.category || "",
        difficulty: quiz.difficulty || "Easy",
      });
    }
  }, [quiz]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (quiz) {
        await updateQuiz(quiz._id, form);
        toast.success("Quiz updated!");
      } else {
        await createQuiz(form);
        toast.success("Quiz created!");
      }

      setForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        category: "",
        difficulty: "Easy",
      });
      onSuccess();
    } catch (error) {
      toast.error("Error saving quiz");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-50 rounded shadow border border-gray-200"
    >
      <div className="mb-4">
        <input
          type="text"
          name="question"
          placeholder="Enter quiz question"
          value={form.question}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {form.options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="border p-2 rounded"
            required
          />
        ))}
      </div>

      {/* Correct Answer */}
      <div className="mb-4">
        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct Answer"
          value={form.correctAnswer}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Category & Difficulty */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {quiz ? "Update Quiz" : "Add Quiz"}
      </button>
    </form>
  );
};

export default QuizForm;
