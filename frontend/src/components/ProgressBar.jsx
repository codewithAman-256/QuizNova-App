const ProgressBar = ({ current, total }) => {
  const percent = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-6">
      <div
        className="
          h-3 rounded-full 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          transition-all duration-500
        "
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
