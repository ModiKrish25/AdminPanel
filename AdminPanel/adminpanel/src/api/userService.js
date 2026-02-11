import { BASE_URL } from './apiConfig';

const API_URL = `${BASE_URL}/users`;

export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
