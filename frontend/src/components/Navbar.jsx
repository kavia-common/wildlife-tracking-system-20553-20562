import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-ocean-gradient shadow-soft border border-gray-100" />
          <span className="font-semibold text-lg text-text">Wildlife Tracking</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/bears/new"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-secondary text-white' : 'hover:bg-gray-100'}`
            }
          >
            Add Bear
          </NavLink>
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`
            }
          >
            Alerts
          </NavLink>
          {isAuthenticated && (
            <button onClick={logout} className="ocean-btn ml-2 border border-gray-200 hover:border-gray-300">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
