import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '🍔', label: 'Menu', path: '/admin/menu' },
    { icon: '🍱', label: 'Category', path: '/admin/category' },
    { icon: '🛍️', label: 'Orders', path: '/admin/orders' },
    { icon: '👥', label: 'Users', path: '/admin/users' },
    { icon: '⚙️', label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 h-full shadow-2xl z-20">

      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wider text-indigo-500">
          ADMIN<span className="text-white">PANEL</span>
        </h1>
      </div>


      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${isActive
                    ? 'bg-indigo-600 text-white border-r-4 border-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}
