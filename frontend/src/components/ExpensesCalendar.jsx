import { useState, useMemo } from "react";
import DayExpensesModal from "./DayExpensesModal";

function ExpensesCalendar({ expenses, theme }) {
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= GROUP BY DATE ================= */
  const expensesByDate = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const d = e.date.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(e);
    });
    return map;
  }, [expenses]);

  /* ================= CALENDAR DATA ================= */
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleString("default", { month: "long" });
  const todayStr = today.toISOString().slice(0, 10);

  /* ================= STREAK LOGIC ================= */
  const streakDates = useMemo(() => {
    const dates = Object.keys(expensesByDate).sort();
    const set = new Set();

    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        set.add(dates[i]);
        set.add(dates[i - 1]);
      }
    }
    return set;
  }, [expensesByDate]);

  return (
    <>
      <div
        className={`card shadow-sm p-4 ${
          theme === "dark" ? "bg-dark text-light" : "bg-light"
        }`}
      >
        {/* HEADER */}
        <div className="text-center ">
          <h4 className="fw-bold">{monthName} {year}</h4>
        </div>

        {/* WEEKDAYS */}
        <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-center fw-semibold text-muted mb-2">
              {d}
            </div>
          ))}
        </div>

        {/* DATES GRID */}
        <div
          className="d-grid gap-2"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {/* EMPTY CELLS */}
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const hasExpenses = !!expensesByDate[dateStr];
            const isToday = dateStr === todayStr;
            const isStreak = streakDates.has(dateStr);

            return (
              <div
                key={day}
                className={`calendar-cell rounded ${
                  theme === "dark" ? "bg-secondary text-light" : "bg-white"
                } ${hasExpenses ? "border border-success" : "border"}`}
                style={{
                  aspectRatio: "1 / 1",
                  cursor: hasExpenses ? "pointer" : "default",
                  position: "relative",
                  padding: "6px",
                }}
                onClick={() => hasExpenses && setSelectedDate(dateStr)}
              >
                {/* DAY NUMBER */}
                <div
                  className={`fw-semibold ${
                    isToday ? "text-primary" : ""
                  }`}
                >
                  {day}
                </div>

                {/* DOT FOR EXPENSE */}
                {hasExpenses && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: "#28a745",
                      borderRadius: "50%",
                      position: "absolute",
                      bottom: 6,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}

                {/* STREAK */}
                {isStreak && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 6,
                      fontSize: "0.8rem",
                    }}
                  >
                    🔥
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <small className="text-muted mt-3 d-block">
          ● Expense day &nbsp; 🔥 Streak &nbsp; Blue = Today
        </small>
      </div>

      {/* MODAL */}
      {selectedDate && (
        <DayExpensesModal
          date={selectedDate}
          expenses={expensesByDate[selectedDate]}
          onClose={() => setSelectedDate(null)}
          theme={theme}
        />
      )}
    </>
  );
}

export default ExpensesCalendar;
