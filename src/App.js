import './App.css';
import { Ticket } from './components/Ticket';
import Navbar from './components/Navbar';
import { Login } from './components/Login';
import './index.css';
import { useState, useEffect } from 'react';
import { Register } from './components/Register';
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Dashboard } from './components/Dashboard';
import Tickets from './components/Tickets';
import EditTicket from './components/EditTicket';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    setIsAuthenticated(!!localStorage.getItem("accessToken"));
  }, []);

  // Hide Navbar on login & register pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && isAuthenticated && (
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      )}

      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/ticket"
          element={isAuthenticated ? <Ticket /> : <Navigate to="/ticket" replace />}
        />
        <Route
          path="/tickets"
          element={isAuthenticated ? <Tickets /> : <Navigate to="/tickets" replace />}
        />
        <Route path="/ticket/:ticketid" element={<EditTicket />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/dashboard" replace />}
        />

        <Route path="/*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;
