import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#E5E7EB"]; // Indigo, Green, Soft Gray

const PerformanceChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  const data = results.map((r) => ({
    name: new Date(r.createdAt).toLocaleDateString(),
    percentage: r.percentage,
  }));

  const avg = Math.round(
    results.reduce((sum, r) => sum + r.percentage, 0) / results.length
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="bg-white/90 border border-gray-100 rounded-2xl shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">
          Performance Over Time
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ stroke: "#4F46E5", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white/90 border border-gray-100 rounded-2xl shadow-md p-4 text-center">
        <h3 className="font-semibold text-gray-800 mb-3">Average Performance</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Score", value: avg },
                { name: "Remaining", value: 100 - avg },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
              cornerRadius={10}
              dataKey="value"
            >
              <Cell fill="#6366F1" /> {/* Score */}
              <Cell fill="#E5E7EB" /> {/* Remaining */}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <p className="mt-2 text-3xl font-semibold text-indigo-600">{avg}%</p>
      </div>
    </div>
  );
};

export default PerformanceChart;
