import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#EF4444"];

const PerformanceChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  const data = results.map((r) => ({
    name: new Date(r.createdAt).toLocaleDateString(),
    percentage: r.percentage,
  }));

  const avg = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);

  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      {/* Line Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="percentage" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="font-semibold mb-3">Average Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Score", value: avg },
                { name: "Remaining", value: 100 - avg },
              ]}
              cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5}
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="mt-2 text-lg font-bold text-blue-600">{avg}%</p>
      </div>
    </div>
  );
};

export default PerformanceChart;
