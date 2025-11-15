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
  const [completedToday, setCompletedToday] = useState(false);

  // => Today's key for localStorage
  const todayKey = new Date().toISOString().slice(0, 10);
  const localKey = `daily_completed_${todayKey}`;

  // ================= FETCH DAILY CHALLENGE =====================
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await getDailyChallenge();
        setChallenge(data);

        const done = localStorage.getItem(localKey) === "true";
        if (done) setCompletedToday(true);

      } catch (err) {
        console.error("Daily Challenge Error:", err);
      }
    };

    fetchChallenge();
    // eslint-disable-next-line
  }, []);

  // ================= SUBMIT ANSWER =====================
  const handleSubmit = async () => {
    if (!selected || isSubmitting || completedToday) return;

    setIsSubmitting(true);

    try {
      const data = await submitDailyChallenge(selected);

      setResult(data.message);
      setStreak(data.streak);
      setXp(data.xp);
      setCompletedToday(true);
      localStorage.setItem(localKey, "true");

      // Show confetti only if correct & not previously completed
      if (data.correct && !data.alreadyCompleted) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error(err);
      setResult("⚠️ Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= LOADING UI =====================
  if (!challenge) return <Loader text="Loading Daily Challenge..." />;

  return (
    <div className="min-h-[80vh] p-6 sm:p-8 flex justify-center">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-indigo-100">

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🔥 Daily Challenge
        </h1>
        <p className="text-gray-600 text-center mt-1 mb-6">
          Keep your streak alive and earn XP!
        </p>

        {/* QUESTION */}
        <div className="bg-white rounded-2xl shadow px-4 py-5 border border-gray-200">
          <p className="text-lg font-semibold text-gray-800 text-center">
            {challenge.quiz?.question || challenge.question}
          </p>
        </div>

        {/* OPTIONS */}
        <div className="mt-5 space-y-3">
          {(challenge.quiz?.options || challenge.options).map((opt, i) => (
            <button
              key={i}
              onClick={() => !completedToday && setSelected(opt)}
              disabled={isSubmitting || completedToday}
              className={`
                w-full px-4 py-3 rounded-xl font-medium transition-all 
                border text-sm sm:text-base shadow-sm
                ${
                  selected === opt
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-lg scale-[1.02]"
                    : "bg-gray-100 border-gray-300 hover:bg-indigo-100 hover:text-indigo-700"
                }
                ${completedToday ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* SUBMIT BTN */}
        <button
          onClick={handleSubmit}
          disabled={!selected || completedToday || isSubmitting}
          className={`
            mt-6 w-full py-3 rounded-xl font-semibold transition-all shadow-lg
            ${
              completedToday
                ? "bg-gray-400 cursor-not-allowed text-white"
                : isSubmitting
                ? "bg-green-400 text-white cursor-not-allowed animate-pulse"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          `}
        >
          {completedToday
            ? "✔ Completed Today"
            : isSubmitting
            ? "Submitting..."
            : "Submit Answer"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-5 bg-white/70 rounded-2xl border shadow">
            <p className="text-lg font-semibold text-gray-800">{result}</p>

            {/* STREAK + XP */}
            <div className="mt-4 text-gray-700 space-y-1 text-sm sm:text-base">
              <p>🔥 Streak: <b>{streak}</b> days</p>
              <p>⚡ XP Earned: <b>{xp}</b></p>
            </div>

            {/* WEEKLY PROGRESS BAR */}
            <div className="w-full max-w-xs mx-auto mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
                style={{ width: `${(streak % 7) * 14.3}%` }}
              ></div>
            </div>

            <p className="text-xs mt-2 text-gray-500">
              {streak % 7 === 0 && streak !== 0
                ? "🏆 Weekly streak complete! Bonus XP awarded!"
                : `${7 - (streak % 7)} days left for weekly reward`}
            </p>
          </div>
        )}

        {/* MOTIVATION */}
        {streak > 0 && (
          <p className="mt-5 text-center text-green-600 font-medium text-sm">
            {streak >= 7
              ? "🔥 Amazing consistency! Keep going!"
              : "💪 You're building strong habits!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyChallengePage;
