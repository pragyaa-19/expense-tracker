function DayExpensesModal({ date, expenses, onClose, theme }) {
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className={`modal-content ${theme === "dark" ? "bg-dark text-light" : ""}`}>
          <div className="modal-header">
            <h5 className="modal-title">🧾 Expenses on {date}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {expenses.map(e => (
              <div key={e.id} className="border-bottom py-2 d-flex justify-content-between">
                <div>
                  <strong>{e.title}</strong>
                  <div className="text-muted small">{e.category}</div>
                </div>
                <div>₹{e.amount}</div>
              </div>
            ))}

            <hr />
            <h5 className="text-end">Total: ₹{total}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayExpensesModal;
