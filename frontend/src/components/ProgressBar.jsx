const ProgressBar = ({ current, total }) => {
  const percent = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 h-3 rounded-full my-4">
      <div
        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
