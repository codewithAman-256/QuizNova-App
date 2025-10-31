import React from "react";

const ResultTable = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-gray-500 text-center">No results yet. Take your first quiz!</p>;
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Score</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{r.score}</td>
              <td className="border px-4 py-2">{r.totalQuestions}</td>
              <td className="border px-4 py-2">{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
