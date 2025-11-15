/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { createQuiz, updateQuiz } from "../utils/api";
import toast from "react-hot-toast";

const QuizForm = ({ quiz, onSuccess }) => {
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
    } else {
      setForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        category: "",
        difficulty: "Easy",
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

      onSuccess();
    } catch {
      toast.error("Error saving quiz");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5"
    >
      <h2 className="text-xl font-semibold mb-1 text-indigo-700">
        🧩 {quiz ? "Edit Quiz" : "Create New Quiz"}
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        Add or update quiz details below.
      </p>

      {/* Question */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Question
        </label>
        <textarea
          name="question"
          placeholder="Enter quiz question"
          value={form.question}
          onChange={handleChange}
          className="border p-2.5 w-full rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          rows={3}
          required
        />
      </div>

      {/* Options */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {form.options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          ))}
        </div>
      </div>

      {/* Correct Answer */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Correct Answer
        </label>
        <input
          type="text"
          name="correctAnswer"
          placeholder="Type the correct answer exactly as one of the options"
          value={form.correctAnswer}
          onChange={handleChange}
          className="border p-2.5 w-full rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      {/* Category & Difficulty */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Category
          </label>
          <input
            type="text"
            name="category"
            placeholder="e.g. JavaScript, React"
            value={form.category}
            onChange={handleChange}
            className="border p-2.5 w-full rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div className="w-full sm:w-40">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="border p-2.5 w-full rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow"
        >
          {quiz ? "Update Quiz" : "Add Quiz"}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
