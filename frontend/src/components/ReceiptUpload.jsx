import React, { useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const CATEGORY_CHOICES = [
  "Food",
  "Dairy",
  "Groceries",
  "Health",
  "Shopping",
  "Electronics",
  "Education",
  "Travel",
  "Rent",
  "Bill",
  "Entertainment",
  "Gifts",
  "Insurance",
  "Other",
];

const ReceiptUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  // -----------------------------------
  // File selection
  // -----------------------------------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setMessage("");
  };

  // -----------------------------------
  // Upload receipt
  // -----------------------------------
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/receipts/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const extractedItems = res.data.items.map((item) => ({
        title: item.title || `Receipt - ${item.vendor || "Other"}`,
        amount: item.amount || "",
        date:
          item.date ||
          new Date().toISOString().split("T")[0],
        vendor: CATEGORY_CHOICES.includes(item.vendor)
          ? item.vendor
          : "Other",
      }));

      setItems(extractedItems);
      setMessage(
        `Receipt uploaded! ${extractedItems.length} items found.`
      );

      // Keep preview, but remove selected file state
      setFile(null);

    } catch (err) {
      console.error("Receipt upload error:", err);

      setMessage(
        err.response?.data?.error ||
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Edit extracted item
  // -----------------------------------
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    setItems(newItems);
  };

  // -----------------------------------
  // Delete ONE item
  // -----------------------------------
  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);

    setItems(newItems);

    setMessage("Item removed.");
  };

  // -----------------------------------
  // Reset everything
  // -----------------------------------
  const handleResetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setItems([]);
    setMessage("");
  };

  // -----------------------------------
  // Add ONE expense
  // -----------------------------------
  const handleCreateExpense = async (itemIndex) => {
    const item = items[itemIndex];

    if (!item.amount) {
      setMessage("Amount is required.");
      return;
    }

    try {
      await api.post("/expenses/", {
        title: item.title,
        amount: item.amount,
        date: item.date,
        category: item.vendor,
      });

      setMessage(
        `Expense "${item.title}" added successfully!`
      );

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Go back to home
      navigate("/");

    } catch (err) {
      console.error("Create expense error:", err);

      setMessage(
        `Failed to add expense "${item.title}".`
      );
    }
  };

  // -----------------------------------
  // Add ALL expenses
  // -----------------------------------
  const handleAddAll = async () => {
    if (items.length === 0) {
      setMessage("No items to add.");
      return;
    }

    let allSuccess = true;
    let addedCount = 0;

    for (const item of items) {

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

        addedCount++;

      } catch (err) {
        console.error(
          `Failed to add ${item.title}:`,
          err
        );

        allSuccess = false;
      }
    }

    if (allSuccess) {
      setMessage(
        `${addedCount} expenses added successfully!`
      );

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Go to home
      navigate("/");

    } else {
      setMessage(
        `${addedCount} expenses added. Some items could not be added.`
      );
    }
  };

  return (
    <div
      className="container py-5 mt-5"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f8ff",
      }}
    >
      <div className="card shadow-lg p-4">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="text-center mb-4">

          <h1 className="mb-2">
            <i className="bi bi-receipt"></i>{" "}
            Upload Your Receipt
          </h1>

          <p className="text-muted">
            Quickly extract expenses from your receipts
          </p>

        </div>

        {/* -------------------------------- */}
        {/* File Upload */}
        {/* -------------------------------- */}

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

        {/* -------------------------------- */}
        {/* Message */}
        {/* -------------------------------- */}

        {message && (
          <p className="text-center text-secondary mb-3">
            {message}
          </p>
        )}

        {/* -------------------------------- */}
        {/* Receipt Preview */}
        {/* -------------------------------- */}

        {previewUrl && (
          <div className="text-center mb-4">

            {file && file.name.toLowerCase().endsWith(".pdf") ? (

              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-underline"
              >
                View PDF
              </a>

            ) : (

              <img
                src={previewUrl}
                alt="Receipt Preview"
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: "300px",
                }}
              />

            )}

          </div>
        )}

        {/* -------------------------------- */}
        {/* Extracted Items */}
        {/* -------------------------------- */}

        {items.length > 0 && (

          <div className="table-responsive">

            {/* Items Header */}

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="mb-0">
                Extracted Items ({items.length})
              </h5>

              <div className="d-flex gap-2">

                {/* Reset All */}

                <button
                  onClick={handleResetAll}
                  className="btn btn-secondary"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>{" "}
                  Reset All
                </button>

                {/* Add All */}

                <button
                  onClick={handleAddAll}
                  className="btn btn-success"
                >
                  <i className="bi bi-check2-all"></i>{" "}
                  Add All
                </button>

              </div>

            </div>

            {/* Table */}

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-light">

                <tr>

                  <th>Title</th>

                  <th>Amount (₹)</th>

                  <th>Date</th>

                  <th>Category</th>

                  <th className="text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((item, index) => (

                  <tr key={index}>

                    {/* Title */}

                    <td>
                      {item.title}
                    </td>

                    {/* Amount */}

                    <td>

                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />

                    </td>

                    {/* Date */}

                    <td>

                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />

                    </td>

                    {/* Category */}

                    <td>

                      <select
                        value={item.vendor}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "vendor",
                            e.target.value
                          )
                        }
                        className="form-select"
                      >

                        {CATEGORY_CHOICES.map((category) => (

                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>

                        ))}

                      </select>

                    </td>

                    {/* Actions */}

                    <td className="text-center">

                      {/* Add */}

                      <button
                        onClick={() =>
                          handleCreateExpense(index)
                        }
                        className="btn btn-success btn-sm me-1 mb-1"
                      >
                        <i className="bi bi-plus-lg"></i>{" "}
                        Add
                      </button>

                      {/* View */}

                      <button
                        onClick={() =>
                          alert(
                            JSON.stringify(
                              item,
                              null,
                              2
                            )
                          )
                        }
                        className="btn btn-info btn-sm me-1 mb-1"
                      >
                        <i className="bi bi-eye"></i>{" "}
                        View
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() =>
                          handleDeleteItem(index)
                        }
                        className="btn btn-danger btn-sm mb-1"
                      >
                        <i className="bi bi-trash"></i>{" "}
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* -------------------------------- */}
        {/* No Items */}
        {/* -------------------------------- */}

        {!loading &&
          items.length === 0 &&
          message &&
          message.includes("removed") === false && (
            <p className="text-center text-muted">
              No extracted items.
            </p>
          )}

      </div>
    </div>
  );
};

export default ReceiptUpload;