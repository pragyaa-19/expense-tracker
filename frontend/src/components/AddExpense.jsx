import { useEffect, useState } from "react";
import api from "../api";

function AddExpense({ onAdd, onUpdate, editingExpense, clearEdit, theme }) {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    "Daily","Food", "Dairy", "Groceries", "Health", "Shopping", "Electronics",
    "Education", "Travel", "Rent", "Bill", "Entertainment",
    "Gifts", "Insurance", "Other",
  ];

  // 🟢 Fill form if editing
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date.slice(0, 10));
      setNote(editingExpense.note || "");
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(today);
    setNote("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title: title.trim(),
      amount: Number(amount),
      date,
      category,
      note: note.trim(),
    };

    try {
      if (editingExpense) {
        await onUpdate(editingExpense.id, data);
        clearEdit();
      } else {
        await onAdd(data);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to submit expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card shadow-sm p-4 mb-3 mt-5 ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <h4 className="mb-4 fw-bold text-primary mt-2">{editingExpense ? "Edit Expense" : "Add New Expense"}</h4>
      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control form-control-lg rounded"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-3">
          <input
            type="number"
            className="form-control form-control-lg rounded"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="col-12 col-md-3">
          <input
            type="date"
            className="form-control form-control-lg rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <select
            className="form-select form-select-lg rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control form-control-lg rounded"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="col-12 text-end">
          <button
            type="submit"
            className="btn btn-primary btn-lg px-4"
            disabled={loading}
          >
            {loading ? (editingExpense ? "Updating..." : "Adding...") : (editingExpense ? "Update Expense" : "Add Expense")}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddExpense;
