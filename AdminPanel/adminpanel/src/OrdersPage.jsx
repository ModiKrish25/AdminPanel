import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/orders/all');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:5000/orders/update/${orderId}`, { status: newStatus });
            if (response.data.success) {
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Order Management</h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        Monitor and process live orders
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl border border-slate-100">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-black text-indigo-600 leading-none">{orders.length}</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">New</p>
                        <p className="text-2xl font-black text-emerald-500 leading-none">
                            {orders.filter(o => o.status === 'Order Placed').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-8">
                {orders.map((order) => (
                    <div key={order._id} className="group bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border-2 border-transparent hover:border-indigo-100 transition-all duration-500 overflow-hidden">
                        <div className="flex flex-col xl:flex-row">

                            {/* Order Info Sidebar */}
                            <div className="xl:w-80 bg-slate-50/50 p-8 border-r border-slate-100 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Order Token</p>
                                        <h3 className="text-xl font-black text-slate-800 font-mono">#{order._id.slice(-8).toUpperCase()}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <span className={`inline-flex px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-emerald-500 text-white' :
                                                order.status === 'Cancelled' ? 'bg-rose-500 text-white' :
                                                    order.status === 'Preparing' ? 'bg-blue-500 text-white' : 'bg-slate-900 text-white'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
                                            🕒 {formatDate(order.date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-200/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-xl">👤</div>
                                        <div>
                                            <p className="text-slate-900 font-black leading-tight">{order.address?.fullName || order.userName}</p>
                                            <p className="text-slate-400 text-[11px] font-bold truncate max-w-[140px]">{order.userEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Details Area */}
                            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                                {/* Items Column */}
                                <div className="lg:col-span-1 space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        📦 Order Items
                                    </h4>
                                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">{item.quantity}x</span>
                                                    <span className="text-slate-800 font-bold text-sm tracking-tight">{item.title}</span>
                                                </div>
                                                <span className="text-slate-400 font-bold text-xs">₹{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Address & Summary Column */}
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            📍 Shipping To
                                        </h4>
                                        <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-50">
                                            <p className="text-slate-600 text-xs leading-relaxed font-bold">
                                                {order.address?.street || 'Dubai, India'}, {order.address?.city || 'Dubai'},<br />
                                                {order.address?.state || 'India'} ({order.address?.zip || '382721'})
                                            </p>
                                            <p className="text-indigo-600 text-xs font-black mt-3">📞 {order.address?.phone || '9876543245'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-rose-300 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                                            <span className="text-3xl font-black text-rose-500 tracking-tighter">₹{order.amount}</span>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">💰</div>
                                    </div>
                                </div>

                                {/* Action Buttons Column */}
                                <div className="flex flex-col justify-center space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Command Center</h4>
                                    <button
                                        onClick={() => updateStatus(order._id, 'Preparing')}
                                        disabled={order.status !== 'Order Placed'}
                                        className="w-full py-4 px-6 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 font-black text-[10px] uppercase tracking-widest flex items-center justify-between hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale group"
                                    >
                                        Start Preparing <span className="text-lg group-hover:translate-x-1 transition-transform">▶</span>
                                    </button>
                                    <button
                                        onClick={() => updateStatus(order._id, 'Completed')}
                                        disabled={order.status !== 'Preparing'}
                                        className="w-full py-4 px-6 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[10px] uppercase tracking-widest flex items-center justify-between hover:bg-emerald-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale group"
                                    >
                                        Mark Delivered <span className="text-lg group-hover:scale-110 transition-transform">✓</span>
                                    </button>
                                    <button
                                        onClick={() => updateStatus(order._id, 'Cancelled')}
                                        disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                                        className="w-full py-4 px-6 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-black text-[10px] uppercase tracking-widest flex items-center justify-between hover:bg-rose-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale group"
                                    >
                                        Cancel Order <span className="text-lg group-hover:rotate-12 transition-transform">✕</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 shadow-inner">
                        <div className="text-8xl mb-8 opacity-20">📦</div>
                        <p className="text-slate-300 font-black text-2xl uppercase tracking-[0.3em]">Hangar is Empty</p>
                        <p className="text-slate-400 font-bold mt-2">No active orders to display at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
