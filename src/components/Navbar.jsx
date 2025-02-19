import React, { useState } from 'react';

const Navbar = ({ studentName, dateInput, onDateChange, onRefresh, onToggleDarkMode, onViewChange, onStudentNameChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    onToggleDarkMode(!isDarkMode);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="student-name">
          Étudiant :
          <input
            type="text"
            placeholder="prenom.nom"
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            className="student-input"
          />
        </span>
        <button className="refresh-button" onClick={onRefresh}>
          <img src="/icons/refresh.svg" alt="Rafraîchir" />
        </button>
      </div>
      <div className="navbar-center">
        <span className="date">Date : {dateInput}</span>
        <input
          type="date"
          className="date-picker"
          value={dateInput}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div className="navbar-right">
        <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
          <img src={isDarkMode ? "/icons/sun.svg" : "/icons/moon.svg"} alt={isDarkMode ? "Mode clair" : "Mode sombre"} />
        </button>
        <div className="view-toggle">
          <button onClick={() => onViewChange('daily')}>Daily View</button>
          <button onClick={() => onViewChange('weekly')}>Weekly View</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;