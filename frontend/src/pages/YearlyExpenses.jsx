import { useEffect, useMemo, useState } from "react";
import api from "../api";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function YearlyExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [theme] = useState(localStorage.getItem("theme") || "light");

    // fetch expenses
    useEffect(() => {
        api.get("/expenses/")
            .then(res => setExpenses(res.data))
            .catch(console.error);
    }, []);

    // filter yearly expenses
    const yearlyExpenses = useMemo(() => {
        return expenses.filter(e => {
            const d = new Date(e.date);
            return d.getFullYear() === year;
        });
    }, [expenses, year]);

    // month-wise totals
    const monthlyTotals = useMemo(() => {
        const totals = Array(12).fill(0);
        yearlyExpenses.forEach(e => {
            const m = new Date(e.date).getMonth();
            totals[m] += Number(e.amount || 0);
        });
        return totals;
    }, [yearlyExpenses]);

    const yearlyTotal = monthlyTotals.reduce((a, b) => a + b, 0);
    const avgPerMonth = yearlyTotal / 12;

    const cardClass = `card p-3 shadow-sm ${theme === "dark" ? "bg-dark text-light" : "bg-light"
        }`;

    const downloadCSV = () => {
        if (yearlyExpenses.length === 0) {
            alert("No expenses found for this year");
            return;
        }

        const headers = ["Date", "Title", "Category", "Amount"];
        const rows = yearlyExpenses.map(e => [
            e.date,
            e.title,
            e.category,
            e.amount,
        ]);

        let csvContent =
            headers.join(",") + "\n" +
            rows.map(r => r.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `yearly-expenses-${year}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    };


    return (
        <div className="container mt-5 pt-4">
            <h2 className="mb-4"> Yearly Expenses</h2>

            {/* Year Selector */}
            <div className="mb-4">
                <select
                    className="form-select w-auto"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {[2023, 2024, 2025].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {/* Summary */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className={cardClass}>
                        <h6 className="text-muted">Total Spent</h6>
                        <h4>₹{yearlyTotal}</h4>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className={cardClass}>
                        <h6 className="text-muted">Avg / Month</h6>
                        <h4>₹{avgPerMonth.toFixed(0)}</h4>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className={cardClass}>
                        <h6 className="text-muted">Active Months</h6>
                        <h4>{monthlyTotals.filter(v => v > 0).length}/12</h4>
                    </div>
                </div>
            </div>

            {/* Month-wise List (for now) */}
            <div className="row g-3">
                {MONTHS.map((m, i) => (
                    <div key={m} className="col-6 col-md-3">
                        <div className={cardClass}>
                            <small className="text-muted">{m}</small>
                            <p className="fw-bold mb-0">₹{monthlyTotals[i]}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-5">
                <button
                    className="btn btn-outline-success mb-4"
                    onClick={downloadCSV}
                >
                    ⬇ Download Yearly Report (CSV)
                </button>

            </div>
        </div>
    );
}

export default YearlyExpenses;
