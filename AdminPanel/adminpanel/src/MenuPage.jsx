import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MenuPage() {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [foodForm, setFoodForm] = useState({ name: '', category: '', price: '', image: null, imagePreview: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Filter Logic
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  useEffect(() => {
    fetchFoodItems();
    fetchCategories(); // Fetch categories on load
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/menu');
      setFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const displayedItems = selectedCategory
    ? foodItems.filter(item => item.category === selectedCategory)
    : foodItems;

  useEffect(() => {
    return () => {
      // No longer needed for Base64, but good practice if we used ObjURLs.
    };
  }, [foodForm.imagePreview]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFoodForm({ ...foodForm, image: base64, imagePreview: base64 });
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price || !foodForm.image) return;

    const newItem = {
      name: foodForm.name,
      category: foodForm.category,
      price: foodForm.price,
      image: foodForm.image // Send Base64 string
    };

    try {
      if (editingId) {
        // Update existing item
        await axios.put(`http://127.0.0.1:5000/menu/${editingId}`, newItem);
      } else {
        // Create new item
        await axios.post('http://127.0.0.1:5000/menu', newItem);
      }
      fetchFoodItems();
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/menu/${id}`);
        setFoodItems(foodItems.filter(item => item._id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleEdit = (item) => {
    setFoodForm({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      imagePreview: item.image
    });
    setEditingId(item._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFoodForm({ name: '', category: '', price: '', image: null, imagePreview: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Menu Management</h2>
          {!showAddForm && (
            <button
              onClick={() => {
                setEditingId(null);
                setFoodForm({ name: '', category: '', price: '', image: null, imagePreview: '' });
                setShowAddForm(true);
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 cursor-pointer flex items-center gap-2"
            >
              <span>+</span> Add Menu Item
            </button>
          )}
        </div>

        <div>
          {showAddForm ? (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={resetForm}
                className="mb-6 text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition"
              >
                ← Back to Menu
              </button>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-xl">📝</span>
                  {editingId ? 'Edit Item' : 'Add New Item'}
                </h3>

                <form onSubmit={handleAddFood} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Food Image</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${foodForm.imagePreview
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                          }`}
                      >
                        {foodForm.imagePreview ? (
                          <>
                            <img
                              src={foodForm.imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white font-bold text-sm">Change Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-400">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className="text-sm font-medium">Click to upload image</span>
                            <span className="text-xs mt-1 text-slate-400">PNG, JPG up to 5MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Truffle Burger"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={foodForm.name}
                      onChange={e => setFoodForm({ ...foodForm, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none"
                        value={foodForm.category}
                        onChange={e => setFoodForm({ ...foodForm, category: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        value={foodForm.price}
                        onChange={e => setFoodForm({ ...foodForm, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition duration-300 flex items-center justify-center gap-2 hover:cursor-pointer">
                      <span>{editingId ? 'Save Changes' : '+ Add to Menu'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="col-span-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-slate-700">Current Menu Items</h3>
                  {selectedCategory && (
                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100">
                      <span>Filtered by: {selectedCategory}</span>
                      <button onClick={() => navigate('/admin/menu')} className="hover:text-indigo-900">✕</button>
                    </div>
                  )}
                </div>
                <span className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-slate-500 shadow-sm border border-slate-100">
                  {displayedItems.length} Items
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedItems.map(item => (
                  <div key={item._id} className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl hover:cursor-pointer transition-all duration-300 border border-slate-100 flex flex-col">

                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-slate-900 font-extrabold text-sm">₹{item.price}</span>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {item.category}
                        </span>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(item); }} // prevent card click if we had that
                        className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        title="Edit Item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                        <p className="text-slate-400 text-sm line-clamp-2">Freshly prepared {item.category} dish made with premium ingredients.</p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleDeleteFood(item._id)}
                          className="w-full py-2.5 rounded-lg hover:cursor-pointer border border-rose-100 text-rose-500 font-semibold text-sm hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {foodItems.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-100">
                    <span className="text-4xl mb-2">🍽️</span>
                    <p className="font-medium">The menu is empty.</p>
                    <p className="text-sm">Start by adding some delicious items!</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
