import axios from "axios";

const API_URL = "http://localhost:5001/api/auth"; // ✅ Adjust if needed

// ✅ Signup API Call
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// ✅ Login API Call
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};