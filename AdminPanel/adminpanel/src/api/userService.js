import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/users';

export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
