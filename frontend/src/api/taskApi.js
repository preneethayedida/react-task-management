import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tasks';

// ✅ Make sure each function has `export` before it
export const getTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await axios.put(`${API_URL}/${taskId}`, taskData);
    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await axios.delete(`${API_URL}/${taskId}`);
    return response.data;
};