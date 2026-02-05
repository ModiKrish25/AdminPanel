import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/categories';

export const getAllCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
