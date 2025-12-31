import React, { useMemo } from "react";

const StreakCard = ({ expenses, theme }) => {
  // ================= STREAK CALCULATION =================
  const streak = useMemo(() => {
    if (!expenses.length) return 0;

    // Set of all expense dates (YYYY-MM-DD)
    const datesSet = new Set(expenses.map(e => e.date.slice(0, 10)));

    let streakCount = 0;
    let currentDate = new Date();

    while (datesSet.has(currentDate.toISOString().slice(0, 10))) {
      streakCount += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streakCount;
  }, [expenses]);

  const cardClass = `card shadow-sm p-3 ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`;

  return (
    <div className={cardClass}>
      <h6>🔥 Streak</h6>
      <p>{streak} {streak === 1 ? "day" : "days"}</p>
    </div>
  );
};

export default StreakCard;
