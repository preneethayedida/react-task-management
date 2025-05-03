import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login"); // ✅ Redirect to login page after logout
    };

    return (
        <nav className="bg-gray-800 text-white flex justify-between p-4">
            <h1 className="text-2xl">Task Manager</h1>
            {user && (
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700">
                    Logout
                </button>
            )}
        </nav>
    );
};

export default Navbar;