const AchievementCard = ({ title, unlocked }) => (
  <div
    className={`p-4 rounded shadow ${unlocked} ? "bg-yellow-100 border-yellow-400" : "bg-gray-200 opacity-60"`}
  >
    <h3 className="font-bold">{title}</h3>
    <p>{unlocked ? "✅Unlocked" : "🔒Locked"}</p>
  </div>
);

export default AchievementCard;
