import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/auth/register", formData);
            setSuccess("Account created successfully!");
            setTimeout(() => navigate("/login")); // Redirect after success       
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl">
                <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-6">Create Account</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-lg font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Already have an account?
                    <Link to="/login" className="text-blue-400 hover:underline ml-1">Login</Link>
                </p>
            </div>
        </div>

    );
};
