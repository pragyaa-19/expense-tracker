import React, { useEffect, useState } from "react";
import api from "../api"; // your axios instance
import ExpensesList from "../components/ExpenseList";

const AllExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expenses/"); // adjust endpoint if different
        setExpenses(res.data); // set fetched expenses
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle deleting an expense
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}/`);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // Handle updating an expense
  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await api.patch(`/expenses/${id}/`, updatedData);
      setExpenses(expenses.map((exp) => (exp.id === id ? res.data : exp)));
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  if (loading) return <p>Loading expenses...</p>;

  if (expenses.length === 0) return <p>No expenses found.</p>;

  return (
    <div className="mt-5 p-2 mb-2">
      
      <ExpensesList
        expenses={expenses}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AllExpensesList;
