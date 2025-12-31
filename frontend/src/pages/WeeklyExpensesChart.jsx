import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function WeeklyExpensesChart({ expenses }) {
  if (!expenses || expenses.length === 0) return <p>No expenses to show.</p>;

  // Group expenses by week number
  const weeklyTotals = {};
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const week = Math.ceil((((d - new Date(d.getFullYear(),0,1)) / 86400000) + 1) / 7);
    const key = `Week ${week}`;
    weeklyTotals[key] = (weeklyTotals[key] || 0) + Number(exp.amount);
  });

  const chartData = Object.entries(weeklyTotals).map(([week, total]) => ({ week, total }));

  return (
    <div className="card p-3 mb-4">
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Weekly Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" />
          <YAxis tickFormatter={v => `₹${v}`} />
          <Tooltip formatter={v => `₹${v}`} />
          <Bar dataKey="total" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyExpensesChart;
