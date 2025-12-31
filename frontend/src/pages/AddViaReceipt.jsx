import React, { useEffect, useState } from "react";
import ReceiptUpload from "../components/ReceiptUpload";
import api from "../api";

const AddViaReceipt = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewItem, setViewItem] = useState(null); // for modal

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/expenses/");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Could not load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Upload Receipt */}
      <ReceiptUpload onUploadSuccess={fetchExpenses} />

      <h2 className="text-xl font-bold mt-6 mb-2">Expenses</h2>

      {loading && <p>Loading expenses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && expenses.length === 0 && (
        <p className="text-gray-500">No expenses yet.</p>
      )}

      <ul className="space-y-2">
        {expenses.map((e) => (
          <li
            key={e.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <span>
              <strong>{e.title}</strong>
              <br />
              <span className="text-sm text-gray-600">{e.date}</span>
            </span>
            <span className="flex gap-2 items-center">
              <span className="font-semibold">₹{e.amount}</span>
              <button
                onClick={() => setViewItem(e)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
              >
                View
              </button>
            </span>
          </li>
        ))}
      </ul>

      {/* Modal for viewing expense details */}
      {viewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full relative">
            <h3 className="text-lg font-bold mb-2">Expense Details</h3>
            <p><strong>Title:</strong> {viewItem.title}</p>
            <p><strong>Amount:</strong> ₹{viewItem.amount}</p>
            <p><strong>Date:</strong> {viewItem.date}</p>
            <p><strong>Category:</strong> {viewItem.category}</p>
            <button
              onClick={() => setViewItem(null)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddViaReceipt;
