import React, { useState } from 'react';

export default function AuthPage({ onLogin, error }) {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-indigo-950 opacity-90 z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px] z-0"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[100px] z-0"></div>

      <div className="bg-black/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/10 overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <h2 className="text-4xl font-black text-center text-white mb-2 tracking-tight">
          Admin Login
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm font-medium">
          Access your secure dashboard
        </p>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-200 p-4 rounded-r-lg mb-6 text-sm backdrop-blur-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-xs font-bold text-indigo-300 uppercase mb-2 tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 ease-out"
              placeholder="admin@example.com"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-indigo-300 uppercase mb-2 tracking-wider ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 ease-out"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 hover:cursor-pointer mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
