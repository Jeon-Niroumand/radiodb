import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ searchTerm = '', onSearchChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className="app-header">
      {/* Left: Home */}
      <button
        className="header-icon-btn"
        onClick={handleHomeClick}
        aria-label="Go to home"
        title="Home"
      >
        🏠
      </button>

      {/* Center: Search */}
      <div className="header-search-wrap">
        <input
          type="text"
          className="header-search-input"
          placeholder="Search model, serial, site name..."
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Right: Gear + dropdown */}
      <div className="header-menu-wrap">
        <button
          className="header-icon-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open settings menu"
          title="Menu"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="header-dropdown">
            <Link
              to="/"
              className="header-dropdown-item"
              onClick={() => setMenuOpen(false)}
            >
              Radios
            </Link>

            <Link
              to="/sites"
              className="header-dropdown-item"
              onClick={() => setMenuOpen(false)}
            >
              Sites
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}