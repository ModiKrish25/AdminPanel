import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/orders';

export const getDashboardData = async () => {
    const response = await axios.get(`${API_URL}/dashboard-data`);
    return response.data;
};

export const getAllOrders = async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/update/${id}`, { status });
    return response.data;
};
