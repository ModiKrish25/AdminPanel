import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import your components
import AuthPage from './AuthPage';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import MenuPage from './MenuPage';
import CategoryPage from './CategoryPage';
import UserPage from './UserPage';
import OrdersPage from './OrdersPage';

export default function App() {

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState([
    { email: 'shraddha@star.com', password: 'admin123' },
    { email: 'viveons@ig.com', password: 'admin' }
  ]);

  const [error, setError] = useState('');

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {

      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setError('');
    } else {
      setError('Invalid email or password. Access restricted to admins.');
    }
  };


  const handleLogout = () => {

    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const AdminLayout = () => {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 p-8">
          <Outlet />
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? (
              <AuthPage
                onLogin={handleLogin}
                error={error}
              />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />

        {currentUser ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="users" element={<UserPage />} />

            <Route path="orders" element={<OrdersPage />} />
            <Route path="settings" element={
              <div className="p-8 text-center text-gray-500 text-xl font-bold">
                Settings Page Coming Soon ⚙️
              </div>
            } />

            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}