import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import * as orderService from './api/orderService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: '₹0',
      totalOrders: '0',
      pendingOrders: '0',
      newCustomers: '0'
    },
    recentOrders: [],
    popularCategories: [],
    revenueTrends: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await orderService.getDashboardData();
        if (data.success) {
          setDashboardData({
            stats: data.stats,
            recentOrders: data.recentOrders,
            popularCategories: data.popularCategories,
            revenueTrends: data.revenueTrends
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: 'Total Revenue', value: dashboardData.stats.totalRevenue, change: '', color: 'bg-emerald-100 text-emerald-700' },
    { title: 'Total Orders', value: dashboardData.stats.totalOrders, change: '', color: 'bg-sky-100 text-sky-700' },
    { title: 'Total Menu Items', value: dashboardData.stats.totalItems, change: '', color: 'bg-indigo-100 text-indigo-700' },
    { title: 'New Customers', value: dashboardData.stats.newCustomers, change: '', color: 'bg-violet-100 text-violet-700' },
  ];

  const revenueData = dashboardData.revenueTrends;
  const categoryData = dashboardData.popularCategories;
  const recentOrders = dashboardData.recentOrders;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h2>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-500 font-medium text-sm">{stat.title}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Revenue Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4338ca' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4338ca"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Popular Categories</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales Count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>


      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Recent Orders</h3>
          <button className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm hover:cursor-pointer">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono text-sm text-slate-500">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 font-medium text-slate-800">{order.userName}</td>
                  <td className="p-4 text-slate-600 text-sm">
                    {order.items.map(item => `${item.quantity}x ${item.title}`).join(', ')}
                  </td>
                  <td className="p-4 font-bold text-slate-800">₹{order.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                          'bg-sky-100 text-sky-700'
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
