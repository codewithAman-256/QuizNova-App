import React from "react";

const ResultTable = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-4 text-lg italic">
        🚀 No results yet — Start your first quiz!
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-xl p-4 sm:p-6">
      <table className="min-w-max w-full text-sm sm:text-base">
        <thead>
          <tr className="text-gray-700 border-b">
            <th className="p-3 text-left font-semibold">📅 Date</th>
            <th className="p-3 text-left font-semibold">📊 Score</th>
            <th className="p-3 text-left font-semibold">❓ Questions</th>
            <th className="p-3 text-left font-semibold">📈 Percentage</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r, i) => {
            const percentage = r.percentage;
            const badgeColor =
              percentage >= 80
                ? "bg-green-500"
                : percentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500";

            return (
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-indigo-50/60 transition-all"
              >
                <td className="p-3 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 font-semibold text-indigo-700 whitespace-nowrap">
                  {r.score}
                </td>

                <td className="p-3">{r.totalQuestions}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium ${badgeColor}`}
                  >
                    {percentage}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
