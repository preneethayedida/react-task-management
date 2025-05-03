import React, { useState } from "react";
import { signup, login } from "../api/authApi";

const AuthForm = ({ type, onAuthSuccess }) => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = type === "signup" ? await signup(formData) : await login(formData);
            localStorage.setItem("token", userData.token); // ✅ Store token for authentication
            onAuthSuccess();
        } catch (err) {
            setError(err.error || "Authentication failed");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center">{type === "signup" ? "Sign Up" : "Login"}</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {type === "signup" && (
                    <input name="username" placeholder="Username" onChange={handleChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                )}
                <input name="email" placeholder="Email" onChange={handleChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">Submit</button>
            </form>
        </div>
    );
};

export default AuthForm;