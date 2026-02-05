import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/categories', newCategory);
            fetchCategories();
            setIsModalOpen(false);
            setNewCategory({ name: '' });
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`http://127.0.0.1:5000/categories/${id}`);
                setCategories(categories.filter(cat => cat._id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/admin/menu?category=${encodeURIComponent(categoryName)}`);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Categories</h2>
                        <p className="text-slate-500">Manage your food categories</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 cursor-pointer"
                        >
                            + New Category
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => (
                        <div
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`p-6 rounded-2xl border-2 ${cat.bg} ${cat.border} hover:shadow-xl transition-all duration-300 cursor-pointer group relative`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 block">{cat.icon}</span>
                                <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 backdrop-blur-sm">
                                    {cat.count}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-1">
                                <h3 className={`text-xl font-bold ${cat.text}`}>{cat.name}</h3>
                                <button
                                    onClick={(e) => handleDelete(e, cat._id)}
                                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                                    title="Delete Category"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                            <div className="w-full bg-white/50 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className={`h-full w-2/3 rounded-full ${cat.text.replace('text', 'bg')}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Add New Category</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Indian"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-lg shadow-indigo-200 cursor-pointer"
                                >
                                    Create Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
