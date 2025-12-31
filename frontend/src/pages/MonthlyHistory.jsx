import { useEffect, useState, useMemo } from "react";
import api from "../api";
import MonthlyExpensesVertical from "../components/MonthlyExpensesChart";

function MonthlyHistory({ theme }) {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({}); // { '2025-12': 5000, ... }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, expensesRes] = await Promise.all([
          api.get("/expenses/user-info/"),
          api.get("/expenses/"),
        ]);
        setUser(userRes.data);
        setBudgets(userRes.data.budgets || {});
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Group expenses by month-year for cards
  const monthlyData = useMemo(() => {
    const data = {};

    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!data[key]) data[key] = [];
      data[key].push(e);
    });

    const result = [];
    for (const monthKey in data) {
      const monthExpenses = data[monthKey];
      const spent = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const budget = budgets[monthKey] || user?.budget || 0;
      const extra = Math.max(spent - budget, 0);
      const saved = spent < budget ? budget - spent : 0;

      result.push({ monthKey, budget, spent, extra, saved });
    }

    return result.sort((a, b) => (a.monthKey < b.monthKey ? 1 : -1));
  }, [expenses, budgets, user]);

  const cardClass = `card p-3 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`;

  return (
    <div className={`container mt-5 pt-4 ${theme === "dark" ? "bg-dark text-light" : ""}`}>
      <h2 className={theme === "dark" ? "text-light" : "text-dark"}>Monthly History</h2>

      {/* 📊 Chart */}
      <div className="mb-5">
        <MonthlyExpensesVertical expenses={expenses} budgets={budgets} />
      </div>

      {/* 📋 Monthly Cards */}
      <div className="row g-3 mt-4">
        {monthlyData.map((m) => {
          const [year, month] = m.monthKey.split("-");
          const monthName = new Date(year, month - 1).toLocaleString("default", { month: "short" });
          return (
            <div key={m.monthKey} className="col-12 col-md-6 col-lg-4">
              <div className={cardClass}>
                <h6 className="text-muted">{monthName} {year}</h6>
                <p className="mb-1">Budget: ₹{m.budget}</p>
                <p className="mb-1">Spent: ₹{m.spent}</p>
                <p className="mb-1 text-danger">Extra: ₹{m.extra}</p>
                <p className="mb-0 text-success">Saved: ₹{m.saved}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyHistory;
