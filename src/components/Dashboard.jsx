import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./socket";

export const Dashboard = () => {
    const [assignedTickets, setAssignedTickets] = useState([]);

    // Retrieve the logged-in user ID from local storage
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            if (!socket.connected) {
                socket.connect();
            }

            console.log(`Joining user room: user_${userId}`);
            socket.emit("join_user_room", String(userId)); // Ensure user joins their specific room

            // Handle automatic reconnection
            socket.on("connect", () => {
                console.log("Reconnecting... Joining room");
                socket.emit("join_user_room", String(userId));
            });
        }


        // Handle assigned ticket event (only for logged-in user)
        const handleAssignedTicket = (data) => {
            console.log("Assigned Ticket Received:", data);
            toast.success(data.message);
            setAssignedTickets((prev) => [...prev, data]);
        };

        // Attach event listeners
        socket.on("ticket_assigned", handleAssignedTicket);

        return () => {
            // Cleanup listeners on unmount
            socket.off("ticket_assigned", handleAssignedTicket);
            socket.off("connect"); // Cleanup reconnection listener
        };
    }, [userId]);


    return (
        <div>
            <h1>Dashboard</h1>
            <ToastContainer />

            <h2>New Tickets</h2>


            <h2>My Assigned Tickets</h2>
            <ul>
                {assignedTickets.map((ticket) => (
                    <li key={ticket.ticketid}>{ticket.message}</li>
                ))}
            </ul>
        </div>
    );
};
