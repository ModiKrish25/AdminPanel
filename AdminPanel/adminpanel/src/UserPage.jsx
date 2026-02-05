import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserPage() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">User Management</h2>
          <span className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-slate-500 shadow-sm border border-slate-100">
            {users.length} Users
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-50 text-indigo-900 text-sm uppercase tracking-wider">
                  <th className="p-5 font-bold">User Name</th>
                  <th className="p-5 font-bold">Email</th>
                  <th className="p-5 font-bold">Role</th>
                  <th className="p-5 font-bold">Join Date</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition duration-200">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-600">{user.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'Admin'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-sky-100 text-sky-700 border border-sky-200'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-sm font-mono">{user.joinDate}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition hover:cursor-pointer"
                        title="Delete User"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-10 text-center text-slate-400 bg-slate-50">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
