import { useState } from "react";
import "../styles/SideBar.css";
import ExpensesList from "../components/ExpenseList";

import { 
  FaHome, FaTachometerAlt, FaPlusCircle, FaListAlt, FaChartBar, FaUser, FaChevronDown, FaChevronUp 
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({}); // Track open state per item
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/home" },
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Add Expense", icon: <FaPlusCircle />, path: "/add-expense" },
    { name: "Expenses List", icon: <FaListAlt />, path: "/ExpensesList" },
    { 
      name: "Reports", 
      icon: <FaChartBar />, 
      submenu: [
        { name: "Weekly", path: "/reports/weekly" },
        { name: "Monthly", path: "/reports/monthly" },
        { name: "Yearly", path: "/reports/yearly" }
      ]
    },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
  ];

  const toggleSubmenu = (name) => {
    setSubmenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className={`sidebar-container ${open ? "open" : "closed"}`}>

      {/* Toggle Button */}
      <button
        className="toggle-btn"
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className="sidebar shadow">
        <h3 className="sidebar-title">Menu</h3>
        <ul className="sidebar-links">
          {menuItems.map((item) => (
            <li key={item.name} 
                className={(location.pathname === item.path || 
                           (item.submenu && item.submenu.some(s => s.path === location.pathname)))
                           ? "active" : ""}>
              {item.submenu ? (
                <>
                  <div 
                    className="submenu-toggle" 
                    onClick={() => toggleSubmenu(item.name)}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="link-text">{item.name}</span>
                    <span className="chevron">
                      {submenuOpen[item.name] ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                  {submenuOpen[item.name] && (
                    <ul className="submenu-links">
                      {item.submenu.map((sub) => (
                        <li key={sub.name} className={location.pathname === sub.path ? "active" : ""}>
                          <a href={sub.path}>{sub.name}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a href={item.path}>
                  <span className="icon">{item.icon}</span>
                  <span className="link-text">{item.name}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
