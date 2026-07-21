import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header({ searchTerm = '', onSearchChange }) {
  const { user, login, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (value) => {
    if (location.pathname !== '/') {
      navigate('/');
    }

    onSearchChange?.(value);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="app-header">
      {/* Home */}
      <button
        className="header-icon-btn"
        onClick={handleHomeClick}
        aria-label="Go to home"
        title="Home"
      >
        🏠
      </button>

      {/* Search */}
      <div className="header-search-wrap">
        <input
          type="text"
          className="header-search-input"
          placeholder="Search model, serial, site name..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* User */}
      <div className="header-user">
        {user ? (
          <>
            <span className="header-user-name">
              {user.display_name}
            </span>

            <button
              className="header-auth-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="header-auth-btn"
            onClick={login}
          >
            Login
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="header-menu-wrap">
        <button
          className="header-icon-btn"
          onClick={() => setMenuOpen(!menuOpen)}
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

            <Link
              to="/users"
              className="header-dropdown-item"
              onClick={() => setMenuOpen(false)}
            >
              Users
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}