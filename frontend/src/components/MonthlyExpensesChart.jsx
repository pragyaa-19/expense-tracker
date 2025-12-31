import React from "react";
import "../styles/MonthlyExpensesChart.css";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function MonthlyExpensesVertical({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses to show.</p>;
  }

  // Group by MONTH + YEAR
  const monthlyTotals = {};

  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const monthYear = d.toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = 0;
    }

    monthlyTotals[monthYear] += Number(exp.amount);
  });

  // Convert to recharts-friendly format
  const chartData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <div className="card" style={{ padding: "20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Monthly Expenses</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `₹${v}`} />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Bar dataKey="total" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpensesVertical;
