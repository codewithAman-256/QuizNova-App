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
    <div className="w-full overflow-x-auto bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-xl p-4 sm:p-6">

      <table className="min-w-max w-full text-sm sm:text-base">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="p-3 text-left whitespace-nowrap">📅 Date</th>
            <th className="p-3 text-left whitespace-nowrap">📊 Score</th>
            <th className="p-3 text-left whitespace-nowrap">❓ Total Questions</th>
            <th className="p-3 text-left whitespace-nowrap">📈 Percentage</th>
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
                className="border-t hover:bg-indigo-50/70 transition-all"
              >
                {/* DATE */}
                <td className="p-3 font-medium text-gray-800 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

                {/* SCORE */}
                <td className="p-3 font-semibold text-indigo-700 whitespace-nowrap">
                  {r.score}
                </td>

                {/* TOTAL */}
                <td className="p-3 text-gray-700 whitespace-nowrap">
                  {r.totalQuestions}
                </td>

                {/* PERCENTAGE BADGE */}
                <td className="p-3 whitespace-nowrap">
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
