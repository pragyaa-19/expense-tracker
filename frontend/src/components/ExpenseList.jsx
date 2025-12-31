import { useState } from "react";
import "../styles/ExpenseList.css";

function ExpensesList({ expenses, onDelete, onUpdate, theme = "light" }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({ ...expense });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(editingId, editData);
    setEditingId(null);
  };

  const cardClass = theme === "dark" ? "expense-card dark" : "expense-card light";

  const categoryOptions = [
    "Food","Dairy","Groceries","Health","Shopping","Electronics",
    "Education","Travel","Rent","Bill","Entertainment","Gifts","Insurance","Other"
  ];

  return (
    <div className="expenses-container">
      <h3><a href="/all-expenses">All Expenses</a></h3>

      {expenses.map((exp) => (
        <div key={exp.id} className={cardClass}>
          <div className="expense-info">
            <p><strong>Title:</strong> {exp.title}</p>
            <p><strong>Amount:</strong> ₹{exp.amount}</p>
            <p><strong>Category:</strong> {exp.category}</p>
            <p><strong>Date:</strong> {exp.date}</p>
            <p><strong>Note:</strong> {exp.note}</p>
          </div>

          <div className="expense-actions">
            <button className="btn btn-sm btn-primary me-2" onClick={() => startEdit(exp)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(exp.id)}>Delete</button>
          </div>

          {/* Modal-like Edit Card */}
          {editingId === exp.id && (
            <div className={`edit-modal ${theme === "dark" ? "dark" : "light"}`}>
              <div className="edit-card">
                <h5>Edit Expense</h5>
                <input name="title" value={editData.title || ""} onChange={handleChange} placeholder="Title" />
                <input name="amount" type="number" value={editData.amount || ""} onChange={handleChange} placeholder="Amount" />
                <select name="category" value={editData.category || ""} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="date" type="date" value={editData.date || ""} onChange={handleChange} />
                <input name="note" value={editData.note || ""} onChange={handleChange} placeholder="Note" />

                <div className="edit-actions mt-2">
                  <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default ExpensesList;
