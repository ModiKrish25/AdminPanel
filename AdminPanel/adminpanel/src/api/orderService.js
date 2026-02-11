import { BASE_URL } from './apiConfig';

const API_URL = `${BASE_URL}/orders`;

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
