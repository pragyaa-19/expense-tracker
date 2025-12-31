import { useMemo } from "react";

function Totals({ expenses, todayStr, theme }) {
  const cardClass = `card shadow-sm p-3 ${
    theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
  }`;

  const todayTotal = useMemo(() => {
    return expenses
      .filter(e => e.date.slice(0, 10) === todayStr)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenses, todayStr]);

  const yesterdayTotal = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yStr = y.toISOString().slice(0, 10);

    return expenses
      .filter(e => e.date.slice(0, 10) === yStr)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenses]);

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-6">
        <div className={cardClass}>
          <h6>📅 Today</h6>
          <h4 className="fw-bold">₹{todayTotal}</h4>
        </div>
      </div>

      <div className="col-md-6">
        <div className={cardClass}>
          <h6>🕒 Yesterday</h6>
          <h4 className="fw-bold">₹{yesterdayTotal}</h4>
        </div>
      </div>
    </div>
  );
}

export default Totals;
