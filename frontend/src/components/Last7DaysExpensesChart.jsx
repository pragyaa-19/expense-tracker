import React from "react";
import "../styles/MonthlyExpensesChart.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Last7DaysExpensesChart({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses to show.</p>;
  }

  // Get last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }).reverse(); // chronological order

  // Group expenses by day
  const dailyTotals = {};
  last7Days.forEach(date => dailyTotals[date] = 0);

  expenses.forEach(exp => {
    if (dailyTotals.hasOwnProperty(exp.date)) {
      dailyTotals[exp.date] += Number(exp.amount);
    }
  });

  // Convert to Recharts-friendly format
  const chartData = last7Days.map(date => {
    const d = new Date(date);
    const label = d.toLocaleString("default", { day: "2-digit", month: "short" });
    return { day: label, total: dailyTotals[date] };
  });

  return (
    <div className="card" style={{ padding: "20px", marginTop:"20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "40px" }}></h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(v) => `₹${v}`} />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Bar dataKey="total" barSize={40} fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      <h3 style={{ textAlign: "center", marginTop: "40px" }}></h3>

    </div>
  );
}

export default Last7DaysExpensesChart;
