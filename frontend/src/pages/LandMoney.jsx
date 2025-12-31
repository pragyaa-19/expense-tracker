import React, { useState } from "react";

export default function LandMoney() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    type: "lent",
    name: "",
    amount: "",
    date: "",
    returnDate: "",
    returned: false,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Add new entry
  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.date) return;

    setEntries([...entries, { ...form, id: Date.now() }]);
    setForm({
      type: "lent",
      name: "",
      amount: "",
      date: "",
      returnDate: "",
      returned: false,
    });
  };

  // Toggle returned status directly in table
  const toggleReturned = (id) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, returned: !entry.returned } : entry
      )
    );
  };

  // Determine readable status
  const getReturnedStatus = (entry) => {
    if (entry.returned) return "Returned";
    if (entry.returnDate) {
      const today = new Date();
      const returnDate = new Date(entry.returnDate);
      if (today >= returnDate) return "Not Returned";
    }
    return "Pending";
  };

  // Determine color class for status
  const getStatusColor = (entry) => {
    const status = getReturnedStatus(entry);
    if (status === "Returned") return "text-success";
    if (status === "Not Returned") return "text-danger";
    return "text-warning";
  };

  return (
    <div className="container mt-5 p-3">
      <h3 className="mb-4 text-center">Land Money Tracker</h3>

      {/* Form */}
      <form onSubmit={handleAddEntry} className="mb-5 border p-3 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="lent">Lent</option>
            <option value="borrowed">Borrowed</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Person Name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="form-control"
            placeholder="Amount"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Returning Date (optional)</label>
          <input
            type="date"
            name="returnDate"
            value={form.returnDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="returned"
            checked={form.returned}
            onChange={handleChange}
            className="form-check-input"
            id="returnedCheck"
          />
          <label className="form-check-label" htmlFor="returnedCheck">
            Already Returned
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Entry
        </button>
      </form>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Returning Date</th>
            <th>Status</th>
            <th>Mark Returned</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No entries yet.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.type === "lent" ? "Lent" : "Borrowed"}</td>
                <td>{entry.name}</td>
                <td>{entry.amount}</td>
                <td>{entry.date}</td>
                <td>{entry.returnDate || "-"}</td>
                <td className={`fw-bold text-center ${getStatusColor(entry)}`}>
                  {getReturnedStatus(entry)}
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={entry.returned}
                    onChange={() => toggleReturned(entry.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
