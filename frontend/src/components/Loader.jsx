const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    {/* Spinner */}
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      <div className="absolute inset-1 rounded-full border-4 border-indigo-200 border-t-transparent animate-spin-slow" />
    </div>

    {/* Loading Text */}
    <p className="text-base sm:text-lg font-semibold text-indigo-600 animate-pulse tracking-wide text-center">
      {text}
    </p>
  </div>
);

export default Loader;
