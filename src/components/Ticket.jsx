import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../auth';

const socket = io("http://localhost:5000");  // init the connection

export const Ticket = () => {

    // const [date, setDate] = useState("");
    const [tickets, setTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        subject: "",
        email: "",
        priority: "Medium",
        type: "",
        description: "",
        status: "Open",
        created_by: "",
        created_date: "",
        contactno: "",
        comment: "",
        deptid: "",
        agentid: "",
    });

    useEffect(() => {
        // const today = new Date().toISOString().slice(0, 10);
        // setDate(today);

        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No token found!");
                return;
            }

            try {
                const deptResponse = await axiosInstance.get("http://localhost:5000/departments", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (deptResponse.data.success) {
                    setDepartments(deptResponse.data.data);
                } else {
                    console.error("Failed to fetch departments");
                }

                const agentResponse = await axiosInstance.get("http://localhost:5000/agents", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (agentResponse.data.success) {
                    setAgents(agentResponse.data.data);
                } else {
                    console.error("Failed to fetch agents");
                }

            } catch (error) {
                console.error("Error fetching departments and agents:", error);
            }
        };

        fetchData();


        // remove event listener
        return () => {
            socket.off("ticket_created");
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Ticket Data:", formData);

        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("You are not authorized to create a ticket.");
            return;
        }

        try {
            const response = await axiosInstance.post(
                "http://localhost:5000/tickets",
                { ...formData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const newTicket = response.data.ticket;
                setTickets((prevTickets) => [newTicket, ...prevTickets]);

                // Convert agent ID to string before emitting
                if (newTicket.agentid) {
                    socket.emit("assign_ticket", {
                        ticketid: newTicket.ticketid,
                        assignedUserId: String(newTicket.agentid),
                    });
                }


                alert("Ticket Created Successfully!");

                // Reset the form data
                setFormData({
                    subject: "",
                    email: "",
                    priority: "Medium",
                    type: "",
                    description: "",
                    status: "Open",
                    created_by: "",
                    created_date: "",
                    contactno: "",
                    deptid: "",
                    agentid: "",
                    comment: "",
                });
            } else {
                console.error("Ticket creation failed");
            }
        } catch (err) {
            console.error("Error creating ticket:", err);
            alert("Error creating ticket, please try again.");
        }
    };

    const handleSocket = () => {
        if (!socket.connected) {
            console.error("Socket not connected!");
            return;
        }

        socket.emit("new_ticket", formData);

        // receive message from the server
        socket.on("ticket_created", (newTicket) => {
            console.log("New Ticket from Server:", newTicket);
        });
        socket.emit("assign_ticket", { assignedUserId: formData.agentid });


    }
    return (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Create a Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Priority:</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Type:</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Created By:</label>
                    <input
                        type="text"
                        name="created_by"
                        value={formData.created_by}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Created Date:</label>
                    <input
                        type="date"
                        name="created_date"
                        value={formData.created_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Contact Number:</label>
                    <input
                        type="text"
                        name="contactno"
                        value={formData.contactno}
                        onChange={handleChange}
                        required
                        maxLength="10"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block font-medium">Department:</label>
                    <select
                        name="deptid"
                        value={formData.deptid}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.deptid} value={dept.deptid}>
                                {dept.deptname}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium">Agent:</label>
                    <select
                        name="agentid"
                        value={formData.agentid}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                            <option key={agent.agentid} value={agent.agentid}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Comment:</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Add a comment..."
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={handleSocket}
                >
                    Submit Ticket
                </button>
            </form>
        </div>
    );
}; 