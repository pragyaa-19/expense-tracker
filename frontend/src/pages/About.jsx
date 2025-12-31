import React from "react";

function About() {
  return (
    <div className="container mt-5 pt-4">
      
      {/* Hero Section */}
      <div className="text-center mb-5">
        <img
          src="https://img.icons8.com/fluency/96/000000/money.png"
          alt="Expense Tracker Logo"
          className="mb-3"
        />
        <h1>Welcome to Expense Tracker</h1>
        <p className="lead">
          Manage your finances effortlessly and make smarter spending decisions.
        </p>
      </div>

      {/* About Content */}
      <div className="card shadow-sm p-4">
        <h2 className="mb-3">About Expense Tracker</h2>
        <p>
          Expense Tracker is designed to help you manage your personal finances efficiently. Track expenses, set budgets, and gain insights into your spending habits — all in one place.
        </p>

        <h5 className="mt-4">Key Features:</h5>
        <ul className="list-group list-group-flush mt-2">
          <li className="list-group-item">Add, edit, and delete your expenses easily.</li>
          <li className="list-group-item">View all expenses in a detailed list.</li>
          <li className="list-group-item">Analyze your spending with reports and charts.</li>
          <li className="list-group-item">Upload receipts and track expenses automatically.</li>
          <li className="list-group-item">Set budgets and monitor your spending habits.</li>
          <li className="list-group-item">Switch between light and dark themes for a better experience.</li>
        </ul>

        <h5 className="mt-4">Our Goal:</h5>
        <p>
          We aim to make personal finance management simple and accessible for everyone. Whether you're a student, professional, or entrepreneur, Expense Tracker helps you make smarter financial choices.
        </p>

        <h5 className="mt-4">Contact Us:</h5>
        <p>
          Feedback or suggestions? Reach out at{" "}
          <a href="mailto:support@expensetracker.com">support@expensetracker.com</a>.
        </p>
      </div>
    </div>
  );
}

export default About;
