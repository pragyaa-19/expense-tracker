import React, { useEffect, useState } from "react";
import api from "../api";
import { FaDownload } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

function ExpenseReport() {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, expensesRes] = await Promise.all([
          api.get("/expenses/user-info/"),
          api.get("/expenses/")
        ]);
        setUser(userRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Group expenses by month
  useEffect(() => {
    const totals = {};
    expenses.forEach(exp => {
      const d = new Date(exp.date);
      const monthYear = d.toLocaleString("default", { month: "short", year: "numeric" });
      if (!totals[monthYear]) totals[monthYear] = 0;
      totals[monthYear] += Number(exp.amount);
    });

    const monthlyArr = Object.entries(totals).map(([month, total]) => ({ month, total }));
    setMonthlyTotals(monthlyArr);
  }, [expenses]);

  // Download CSV for a month with timestamp and user info
  const handleDownload = (month) => {
    if (!user) return;

    const monthExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.toLocaleString("default", { month: "short", year: "numeric" }) === month;
    });

    const downloadStamp = new Date().toLocaleString("en-IN", { hour12: false });
    const header = `Monthly Expense Report for ${user.fullname}\nDownloaded on: ${downloadStamp}\n\n`;
    const csvHeader = "Date,Title,Amount,Category,Note\n";
    const csvRows = monthExpenses.map(exp => 
      `${exp.date},${exp.title},${exp.amount},${exp.category},${exp.note}`
    ).join("\n");

    const csvContent = header + csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${month.replace(" ", "_")}_Expenses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4 text-center">Monthly Expense Report</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Month</th>
              <th>Total Spent (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {monthlyTotals.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">No expenses yet.</td>
              </tr>
            ) : (
              monthlyTotals.map(({ month, total }) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>{total}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleDownload(month)}
                    >
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseReport;
