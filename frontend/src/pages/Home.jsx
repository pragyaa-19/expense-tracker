import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Totals from "../components/Totals";


import StreakCard from "../components/StreakCard";
import ExpensesCalendar from "../components/ExpensesCalendar";

import AddExpense from "../components/AddExpense";
import TodayExpensesList from "../components/TodayExpenses";
import YesterdaysExpensesList from "../components/YesterdayExpenses";
import ExpensesChart from "../components/ExpensesChart";
import MonthlyExpensesChart from "../components/MonthlyExpensesChart";
import WeeklyExpensesChart from "../pages/WeeklyExpensesChart";
import YearlyExpensesChart from "../pages/YearlyExpensesChart";


function Home() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [addedFrequentIds, setAddedFrequentIds] = useState([]);
  const [theme] = useState(localStorage.getItem("theme") || "light");
  const [budgetMonth, setBudgetMonth] = useState(
    localStorage.getItem("budgetMonth") || new Date().getMonth()
  );

  const navigate = useNavigate();

  const showSummary = localStorage.getItem("showSummary") !== "false";
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();


  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const res = await api.post("/expenses/upload-receipt/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update user receipts immediately
      setUser((prev) => ({
        ...prev,
        receipts: [res.data, ...(prev.receipts || [])],
      }));
    } catch (err) {
      console.error(err);
    }
  };



  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, expensesRes] = await Promise.all([
          api.get("/expenses/user-info/"),
          api.get("/expenses/"),
        ]);
        setUser(userRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ================= MONTHLY BUDGET RESET =================
  useEffect(() => {
    if (!user) return;
    if (Number(budgetMonth) !== currentMonth) {
      let newBudget = prompt(
        "Enter your budget for this month (₹):",
        user.budget || 0
      );
      newBudget = Number(newBudget) || 0;

      api
        .patch("/expenses/user-info/", { budget: newBudget })
        .then((res) => setUser(res.data))
        .catch(console.error);

      localStorage.setItem("budgetMonth", currentMonth);
      setBudgetMonth(currentMonth);
    }
  }, [budgetMonth, user, currentMonth]);

  // ================= MONTHLY CALCULATIONS =================
  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [expenses, currentMonth, currentYear]
  );

  const totalBudget = Number(user?.budget || 0);
  const totalSpent = useMemo(
    () =>
      monthlyExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [monthlyExpenses]
  );

  let available = totalBudget - totalSpent;
  let extra = 0;
  if (available < 0) {
    extra = Math.abs(available);
    available = 0;
  }

  // ================= FREQUENT EXPENSES =================
  const frequentExpenses = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const key = `${e.title}-${e.category}-${e.amount}`;
      if (!map[key]) map[key] = { ...e, count: 0 };
      map[key].count += 1;
    });

    return Object.values(map)
      .filter((e) => e.count >= 3)
      .sort((a, b) => b.count - a.count);
  }, [expenses]);

  // ================= TODAY ADDED KEYS =================
  const addedTodayKeys = useMemo(
    () =>
      expenses
        .filter((e) => e.date.slice(0, 10) === todayStr)
        .map((e) => `${e.title}-${e.category}-${e.amount}`),
    [expenses, todayStr]
  );

  // ================= DISPLAY FREQUENT FOR TODAY =================
  const displayFrequentExpenses = useMemo(
    () =>
      frequentExpenses.filter(
        (e) => !addedTodayKeys.includes(`${e.title}-${e.category}-${e.amount}`)
      ),
    [frequentExpenses, addedTodayKeys]
  );

  // ================= HANDLERS =================
  const handleAdd = async (expense) => {
    try {
      const res = await api.post("/expenses/", expense);
      setExpenses((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/expenses/${id}/`);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdate = async (id, data) => {
    const res = await api.patch(`/expenses/${id}/`, data);
    setExpenses((prev) => prev.map((e) => (e.id === id ? res.data : e)));
  };

  // ================= UI =================
  const cardClass = `card shadow-sm p-3 ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
    }`;
  const progressPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className={`container mt-5 pt-4 ${theme === "dark" ? "bg-dark text-light" : ""}`}>
      {/* HEADER */}
      <h2 className="mb-4">Welcome, {user?.fullname || "Loading..."} 👋</h2>

      {/* SUMMARY */}
      {showSummary && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className={cardClass}>
              <h6 className="text-muted">Budget</h6>
              <p className="fs-5">₹{totalBudget}</p>
              <div className="progress" style={{ height: 8 }}>
                <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={cardClass}>
              <h6 className="text-muted">Spent</h6>
              <p className="fs-5">₹{totalSpent}</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={cardClass}>
              <h6 className="text-muted">Available</h6>
              <p className={`fs-5 ${extra > 0 ? "text-danger" : "text-success"}`}>₹{available}</p>
              {extra > 0 && <small className="text-danger">Extra: ₹{extra}</small>}
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={cardClass}>
              <h6 className="text-muted">Today</h6>
              <p className="fs-5">{expenses.filter(e => e.date.slice(0, 10) === todayStr).length}</p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTION BUTTONS */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <input
          type="file"
          id="receiptUpload"
          accept="image/*,application/pdf"
          style={{ display: "none" }}
          onChange={handleReceiptUpload}
        />
        <button
          className="btn btn-outline-primary"
          onClick={() => document.getElementById("receiptUpload").click()}
        >
          Upload Receipt
        </button>

        <button className="btn btn-outline-secondary" onClick={() => navigate("/expenses-reports")}>Generate Report</button>
        <button className="btn btn-outline-warning" onClick={() => navigate("/settings")} >Settings</button>
        <button className="btn btn-outline-info" onClick={() => navigate("/all-expenses")} >View All Expense</button>
        <button className="btn btn-outline-success" onClick={() => navigate("/add-expenses")} >Add Quick Expense</button>
      </div>

      {/* FREQUENT EXPENSES */}
      {displayFrequentExpenses.length > 0 && (
        <div className="mb-4">
          <h6 className="text-muted">💡 Frequent Expenses</h6>
          <div className="d-flex gap-3 flex-wrap align-items-start">
            {displayFrequentExpenses.map((e, i) => (
              <div key={i} className={cardClass} style={{ minWidth: 200 }}>
                <strong>{e.title}</strong>
                <small className="text-muted d-block">{e.category}</small>
                <p className="fw-bold">₹{e.amount}</p>
                <small className="text-muted">Used {e.count} times</small>
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={() =>
                    handleAdd({ ...e, date: todayStr, note: "" })
                  }
                >
                  + Add
                </button>
              </div>
            ))}

            {/* ADD ALL BUTTON */}
            <div className={cardClass} style={{ minWidth: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  displayFrequentExpenses.forEach((e) =>
                    handleAdd({ ...e, date: todayStr, note: "" })
                  )
                }
              >
                + Add All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE */}
      <div className="mb-4">
        <AddExpense onAdd={handleAdd} theme={theme} />
      </div>

      <Totals
        expenses={expenses}
        todayStr={todayStr}
        theme={theme}
      />

      <TodayExpensesList
        expenses={expenses.filter(e => new Date(e.date).toDateString() === new Date().toDateString())}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        theme={theme}
      />

      <YesterdaysExpensesList
        expenses={expenses.filter(e => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return new Date(e.date).toDateString() === yesterday.toDateString();
        })}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        theme={theme}
      />


      {/* CHARTS */}
      <div className="row g-4 mb-5">
        {/* Row 1: Expenses Chart & Streak */}
        <div className="col-lg-6 col-md-12 p-5">
          <ExpensesChart expenses={expenses} theme={theme} />
        </div>
        <div className="col-lg-6 col-md-12 mt-5">
          <StreakCard expenses={expenses} theme={theme} />
          <div className="mt-3">
            <ExpensesCalendar expenses={expenses} theme={theme} />
          </div>
        </div>
      </div>



      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <WeeklyExpensesChart expenses={expenses} />
        </div>
        <div className="col-lg-6">
          <YearlyExpensesChart expenses={expenses} />
        </div>
      </div>



      <div>
        {/* 🧾 RECENT RECEIPTS */}
        <div className="mb-5">
          <h5 className="mb-3">📄 Recent Receipts</h5>
          {user?.receipts && user.receipts.length > 0 ? (
            <div className="d-flex gap-3 flex-wrap">
              {user.receipts
                .slice(0, 5) // show latest 5
                .map((r, i) => (
                  <div
                    key={i}
                    className={cardClass}
                    style={{
                      minWidth: 150,
                      maxWidth: 150,
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={r.file}
                      alt={r.title || "Receipt"}
                      className="img-fluid rounded mb-2"
                      style={{ height: 80, objectFit: "cover" }}
                    />
                    <p className="mb-0 fw-bold">{r.title || "Untitled"}</p>
                    <small className="text-muted">{new Date(r.date).toLocaleDateString()}</small>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted">No receipts uploaded yet.</p>
          )}
        </div>

      </div>

    </div>


  );
}

export default Home;
