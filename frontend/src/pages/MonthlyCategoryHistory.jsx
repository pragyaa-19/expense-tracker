import { useEffect, useState, useMemo } from "react";
import api from "../api";

function MonthlyCategoryHistory({ theme }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expenses/");
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExpenses();
  }, []);

  // Group expenses by month and category
  const monthlyCategories = useMemo(() => {
    const data = {};

    expenses.forEach(exp => {
      const d = new Date(exp.date);
      const monthKey = d.toLocaleString("default", { month: "short", year: "numeric" });

      if (!data[monthKey]) data[monthKey] = {};
      data[monthKey][exp.category] = (data[monthKey][exp.category] || 0) + Number(exp.amount);
    });

    return Object.entries(data)
      .map(([month, categories]) => ({ month, categories }))
      .sort((a, b) => new Date(b.month) - new Date(a.month));
  }, [expenses]);

  const cardClass = `card shadow-sm mb-3 ${theme === "dark" ? "bg-dark text-light border-secondary" : "bg-light text-dark"}`;

  return (
    <div className={`container mt-5 pt-4 ${theme === "dark" ? "bg-dark text-light" : ""}`}>
      <h2 className={theme === "dark" ? "text-light mb-4" : "text-dark mb-4"}>
        Monthly Expenses by Category
      </h2>

      <div className="accordion" id="monthlyCategoryAccordion">
        {monthlyCategories.map((m, idx) => (
          <div key={m.month} className={cardClass}>
            <div className="accordion-item">
              <h2 className="accordion-header" id={`heading-${idx}`}>
                <button
                  className={`accordion-button ${theme === "dark" ? "bg-dark text-light" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${idx}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${idx}`}
                >
                  {m.month}
                </button>
              </h2>
              <div
                id={`collapse-${idx}`}
                className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                aria-labelledby={`heading-${idx}`}
                data-bs-parent="#monthlyCategoryAccordion"
              >
                <div className="accordion-body">
                  <ul className="list-group list-group-flush">
                    {Object.entries(m.categories).map(([cat, amt]) => (
                      <li
                        key={cat}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          theme === "dark" ? "bg-dark text-light border-secondary" : ""
                        }`}
                      >
                        {cat}
                        <span className="fw-bold">₹{amt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyCategoryHistory;
