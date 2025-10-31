const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-md font-medium text-indigo-600 mt-3 animate-pulse">{text}</p>
  </div>
);

export default Loader;
