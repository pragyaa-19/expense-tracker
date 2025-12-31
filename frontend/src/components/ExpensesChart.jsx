// src/components/ExpensesChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpensesChart({ expenses, theme = "light" }) {
  if (!expenses || expenses.length === 0) return <p>No expenses to show.</p>;

  const normalizedExpenses = expenses.map(exp => ({
    ...exp,
    category: exp.category ? exp.category.trim() : "Uncategorized",
    amount: Number(exp.amount) || 0
  }));

  const labels = [...new Set(normalizedExpenses.map(exp => exp.category))];

  const dataValues = labels.map(category =>
    normalizedExpenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
  );

  // Random colors, but slightly brighter for dark mode
  const generateColors = num => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      let r = Math.floor(Math.random() * 155 + 100); // 100-255
      let g = Math.floor(Math.random() * 155 + 100);
      let b = Math.floor(Math.random() * 155 + 100);
      if (theme === "dark") {
        r = Math.floor(r / 2); // darker shades for dark mode
        g = Math.floor(g / 2);
        b = Math.floor(b / 2);
      }
      colors.push(`rgb(${r},${g},${b})`);
    }
    return colors;
  };

  const backgroundColor = generateColors(labels.length);

  const data = {
    labels,
    datasets: [
      {
        label: "Expenses by Category",
        data: dataValues,
        backgroundColor,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#222" : "#fff"
      },
    ],
  };

  const containerStyle = {
    maxWidth: "550px",
    margin: "25px auto",
    padding: "15px",
    boxShadow: theme === "dark" 
      ? "0 4px 12px rgba(0,0,0,0.6)" 
      : "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    backgroundColor: theme === "dark" ? "#2b2b2b" : "#fff",
    color: theme === "dark" ? "#eee" : "#000"
  };

  return (
    <div className="chart-container" style={containerStyle}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Spending by Category</h3>
      <Pie data={data} />
    </div>
  );
}

export default ExpensesChart;
