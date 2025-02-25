import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        navigate("/login");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        // setIsAuthenticated(false);
        // setSidebarOpen(false); // Close sidebar on logout
        
    };

    return (
        <>
            {/* Navbar */}
            <nav className="bg-gray-900 text-white p-4 shadow-md  w-full top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
                        <span>🎫</span>
                        <span>Ticket System</span>
                    </Link>
                    <button
                        className="text-white focus:outline-none"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={32} />
                    </button>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-700">
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <button onClick={() => setSidebarOpen(false)}>
                        <X size={28} />
                    </button>
                </div>

                <ul className="p-5 space-y-4">
                    <li>
                        <Link
                            to="/ticket"
                            className="block text-lg font-medium hover:text-indigo-300 transition duration-300"
                            onClick={() => setSidebarOpen(false)}
                        >
                            Create Ticket
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/tickets"
                            className="block text-lg font-medium hover:text-indigo-300 transition duration-300"
                            onClick={() => setSidebarOpen(false)}
                        >
                            All Tickets
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li className="text-lg font-medium text-gray-300">
                                Welcome, <span className="text-indigo-300 font-semibold">{username}</span>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md w-full transition duration-300 shadow-md"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link
                                to="/login"
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md w-full transition duration-300 shadow-md block text-center"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
