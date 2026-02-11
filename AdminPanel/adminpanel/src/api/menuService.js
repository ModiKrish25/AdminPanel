import { BASE_URL } from './apiConfig';

const API_URL = `${BASE_URL}/menu`;

export const getAllMenuItems = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createMenuItem = async (itemData) => {
    const response = await axios.post(API_URL, itemData);
    return response.data;
};

export const deleteMenuItem = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
