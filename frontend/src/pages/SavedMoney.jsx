import React, { useState } from "react";

export default function SavedMoney() {
  const [months, setMonths] = useState([
    { id: 1, name: "January", leftover: 500, saved: false },
    { id: 2, name: "February", leftover: 300, saved: false },
    { id: 3, name: "March", leftover: 0, saved: false },
    // Add more months as needed
  ]);

  const [newLeftover, setNewLeftover] = useState({ month: "", amount: "" });

  // Toggle save for a month
  const toggleSave = (id) => {
    setMonths(
      months.map((m) =>
        m.id === id ? { ...m, saved: !m.saved } : m
      )
    );
  };

  // Calculate total saved
  const totalSaved = months.reduce(
    (sum, m) => (m.saved ? sum + Number(m.leftover) : sum),
    0
  );

  // Add new leftover manually
  const handleAddLeftover = (e) => {
    e.preventDefault();
    if (!newLeftover.month || !newLeftover.amount) return;

    const newEntry = {
      id: Date.now(),
      name: newLeftover.month,
      leftover: Number(newLeftover.amount),
      saved: false,
    };
    setMonths([...months, newEntry]);
    setNewLeftover({ month: "", amount: "" });
  };

  return (
    <div className="p-2 container my-5 mt-5">
      <h3 className="mb-4 text-center">Save Money Tracker</h3>

      {/* Table of months */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Month</th>
            <th>Unspent Money</th>
            <th>Save?</th>
          </tr>
        </thead>
        <tbody>
          {months.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No data yet.</td>
            </tr>
          ) : (
            months.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.leftover}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={m.saved}
                    onChange={() => toggleSave(m.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end fw-bold">
              Total Saved: {totalSaved}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Add new leftover manually */}
      <form onSubmit={handleAddLeftover} className="border p-3 rounded bg-light mt-4">
        <h5>Add New Leftover</h5>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Month"
            className="form-control"
            value={newLeftover.month}
            onChange={(e) => setNewLeftover({ ...newLeftover, month: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            placeholder="Amount"
            className="form-control"
            value={newLeftover.amount}
            onChange={(e) => setNewLeftover({ ...newLeftover, amount: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Leftover
        </button>
      </form>
    </div>
  );
}
