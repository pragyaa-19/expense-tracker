
import { useState } from "react";

function TodayExpensesList({ expenses, onDelete, onUpdate, theme }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    note: "",
  });

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      note: expense.note || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (expense) => {
    await onUpdate(expense.id, {
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
      note: formData.note,
      date: expense.date, // keep original date
    });
    setEditingId(null);
  };

  const cardClass = `card shadow-sm p-3 mb-3 ${
    theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
  }`;

  return (
    <div className="mb-4">
      <h5 className="mb-3">Today’s Expenses</h5>

      {expenses.length === 0 && (
        <div className={`p-3 text-center rounded ${theme === "dark" ? "bg-secondary text-light" : "bg-light text-dark"}`}>
          <h6>No expenses today 💤</h6>
          <small className="text-muted">Enjoy your day!</small>
        </div>
      )}

      {expenses.map((expense) => (
        <div key={expense.id} className={cardClass}>
          {editingId === expense.id ? (
            <>
              <input
                className="form-control mb-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-2"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />

              <textarea
                className="form-control mb-2"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => saveEdit(expense)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h6 className="mb-1">{expense.title}</h6>
              <small className="text-muted d-block">
                {expense.category}
              </small>
              <p className="fw-bold mb-1">₹{expense.amount}</p>
              {expense.note && (
                <small className="text-muted">{expense.note}</small>
              )}

              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => startEdit(expense)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodayExpensesList;
