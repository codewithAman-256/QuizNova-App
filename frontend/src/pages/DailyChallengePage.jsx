import { useEffect, useState } from "react";
import { getDailyChallenge, submitDailyChallenge } from "../utils/api";
import confetti from "canvas-confetti";
import Loader from "../components/Loader";

const DailyChallengePage = () => {
  const [challenge, setChallenge] = useState(null);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await getDailyChallenge();
        setChallenge(data);
      } catch (err) {
        console.error("Error fetching challenge:", err);
      }
    };
    fetchChallenge();
  }, []);

  const handleSubmit = async () => {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const data = await submitDailyChallenge(selected);
      setResult(data.message);
      setStreak(data.streak);
      setXp(data.xp);

      if (data.correct) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Error submitting challenge:", err);
      setResult("⚠️ Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  if (!challenge) return <Loader text= "Loading challenge..."/>;

  return (
    <div className="p-8 max-w-lg mx-auto text-center bg-gradient-to-b from-gray-50 to-white shadow-xl rounded-2xl border border-gray-100">
      {/* 🏆 Header */}
      <h1 className="text-3xl font-extrabold mb-2 text-gray-800 flex items-center justify-center gap-2">
        🔥 Daily Challenge
      </h1>
      <p className="text-gray-600 text-sm mb-6">
        Test your JavaScript knowledge and keep your streak alive!
      </p>

      {/* 💬 Question */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-4">
        <p className="text-lg font-medium text-gray-800">{challenge.question}</p>
      </div>

      {/* 🧠 Options */}
      <div className="space-y-2">
        {challenge.options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            disabled={isSubmitting}
            className={`block w-full p-3 rounded-xl border text-sm font-medium transition-all ${
              selected === opt
                ? "bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]"
                : "bg-gray-100 hover:bg-gray-200 border-gray-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* 🚀 Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`mt-6 px-6 py-2.5 rounded-lg font-semibold transition-all ${
          isSubmitting
            ? "bg-green-400 cursor-not-allowed opacity-70"
            : "bg-green-600 hover:bg-green-700 text-white shadow-md"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </button>

      {/* 🎯 Result Section */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-xl">
          <p className="text-lg font-semibold text-gray-800">{result}</p>

          {/* 🔥 Streak Info */}
          <div className="mt-3 flex flex-col items-center">
            <p className="text-sm text-gray-600">
              🔥 Current Streak: <b>{streak}</b> days
            </p>
            <p className="text-sm text-gray-600">
              ⚡ Total XP: <b>{xp}</b>
            </p>

            {/* 🏅 Streak Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3 max-w-xs mx-auto">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${(streak % 7) * 14.3}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-gray-500">
              {streak % 7 === 0 && streak !== 0
                ? "🏆 Weekly streak complete! Bonus XP unlocked!"
                : `${7 - (streak % 7)} days left for weekly reward!`}
            </p>
          </div>
        </div>
      )}

      {/* 🌟 Bonus Message */}
      {streak > 0 && (
        <div className="mt-4 text-sm text-green-600 font-medium">
          {streak >= 7
            ? "🔥 You're unstoppable! Keep that streak going!"
            : "💪 You're building great consistency!"}
        </div>
      )}
    </div>
  );
};

export default DailyChallengePage;
