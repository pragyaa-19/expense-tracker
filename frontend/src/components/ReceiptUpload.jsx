import React, { useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CATEGORY_CHOICES = [
  "Food", "Dairy", "Groceries", "Health", "Shopping",
  "Electronics", "Education", "Travel", "Rent", "Bill",
  "Entertainment", "Gifts", "Insurance", "Other"
];

const ReceiptUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [items, setItems] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file first.");
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/receipts/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedItems = res.data.items.map((item) => ({
        title: item.title || `Receipt - ${item.vendor || "Other"}`,
        amount: item.amount || "",
        date: item.date || new Date().toISOString().split("T")[0],
        vendor: CATEGORY_CHOICES.includes(item.vendor) ? item.vendor : "Other",
      }));

      setItems(extractedItems);
      setMessage("Receipt uploaded! Verify items below.");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleCreateExpense = async (itemIndex) => {
    const item = items[itemIndex];
    if (!item.amount) return setMessage("Amount is required.");

    try {
      await api.post("/expenses/", {
        title: item.title,
        amount: item.amount,
        date: item.date,
        category: item.vendor,
      });
      setMessage(`Expense "${item.title}" added successfully!`);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error(err);
      setMessage(`Failed to add expense "${item.title}".`);
    }
  };

  const handleAddAll = async () => {
    let allSuccess = true;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.amount) {
        allSuccess = false;
        continue;
      }
      try {
        await api.post("/expenses/", {
          title: item.title,
          amount: item.amount,
          date: item.date,
          category: item.vendor,
        });
      } catch {
        allSuccess = false;
      }
    }

    setMessage(allSuccess
      ? "All expenses added successfully!"
      : "Some items could not be added. Check amounts.");
    if (onUploadSuccess) onUploadSuccess();
  };

  return (
    <div className="container py-5 mt-5" style={{ minHeight: "100vh", backgroundColor: "#f0f8ff" }}>
      <div className="card shadow-lg p-4">
        <div className="text-center mb-4">
          <h1 className="mb-2"><i className="bi bi-receipt"></i> Upload Your Receipt</h1>
          <p className="text-muted">Quickly extract expenses from your receipts</p>
        </div>

        {/* File Upload */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 mb-3">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.txt"
            className="form-control mb-2 mb-sm-0"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {message && <p className="text-center text-secondary mb-3">{message}</p>}

        {/* Preview */}
        {previewUrl && (
          <div className="text-center mb-4">
            {file && file.name.endsWith(".pdf") ? (
              <a href={previewUrl} target="_blank" rel="noreferrer" className="text-decoration-underline">
                View PDF
              </a>
            ) : (
              <img src={previewUrl} alt="Preview" className="img-fluid rounded shadow" style={{ maxHeight: "300px" }} />
            )}
          </div>
        )}

        {/* Items Table */}
        {items.length > 0 && (
          <div className="table-responsive">
            <div className="d-flex justify-content-end mb-2">
              <button onClick={handleAddAll} className="btn btn-success">Add All</button>
            </div>
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => handleItemChange(index, "date", e.target.value)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <select
                        value={item.vendor}
                        onChange={(e) => handleItemChange(index, "vendor", e.target.value)}
                        className="form-select"
                      >
                        {CATEGORY_CHOICES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleCreateExpense(index)}
                        className="btn btn-success btn-sm me-1 mb-1"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => alert(JSON.stringify(item, null, 2))}
                        className="btn btn-info btn-sm me-1 mb-1"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                          setItems([]);
                          setMessage("");
                        }}
                        className="btn btn-secondary btn-sm mb-1"
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload;
