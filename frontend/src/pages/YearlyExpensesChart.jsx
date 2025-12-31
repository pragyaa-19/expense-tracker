import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function YearlyExpensesChart({ expenses }) {
  if (!expenses || expenses.length === 0) return <p>No expenses to show.</p>;

  const currentYear = new Date().getFullYear();
  const monthlyTotals = {};

  expenses.forEach(exp => {
    const d = new Date(exp.date);
    if (d.getFullYear() === currentYear) {
      const month = d.toLocaleString("default", { month: "short" });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(exp.amount);
    }
  });

  const chartData = Object.entries(monthlyTotals).map(([month, total]) => ({ month, total }));

  return (
    <div className="card p-3 mb-4">
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Yearly Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={v => `₹${v}`} />
          <Tooltip formatter={v => `₹${v}`} />
          <Bar dataKey="total" fill="#82ca9d" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default YearlyExpensesChart;
