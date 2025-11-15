const AchievementCard = ({ title, unlocked, icon }) => {
  return (
    <div
      className={`
        p-4 rounded-2xl shadow-md border transition-all
        ${unlocked
          ? "bg-gradient-to-r from-green-100 to-emerald-200 border-green-400"
          : "bg-gray-200 border-gray-300 opacity-60"}
      `}
    >
      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
        {icon} {title}
      </h3>

      <p className="mt-1 font-medium">
        {unlocked ? "✅ Unlocked" : "🔒 Locked"}
      </p>
    </div>
  );
};

export default AchievementCard;
