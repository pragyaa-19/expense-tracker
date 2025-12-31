import React, { useEffect, useState } from "react";
import api from "../api";
import Last7DaysExpensesChart from "../components/Last7DaysExpensesChart";

function DailyChartPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expenses/");
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <p>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Last 7 Days Expenses</h2>
            <Last7DaysExpensesChart expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyChartPage;
