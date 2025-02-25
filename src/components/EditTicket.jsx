import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../auth';

const EditTicket = () => {
    const { ticketid } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    const [ticket, setTicket] = useState({});

    const [agents, setAgents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ticketid) {
            fetchTicket();
            fetchAgents();
            fetchDepartments();
            fetchComments();
        }
    }, [ticketid]);

    const fetchTicket = async () => {
        console.log("Fetching ticket for ID:", ticketid);

        if (!ticketid) {
            console.error("Ticket ID is undefined");
            return;
        }

        try {
            setLoading(true); // Start loading
            const response = await axiosInstance.get(`http://localhost:5000/ticket/${ticketid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data);
            console.log("FETCHING DATA  ============>", response.data.result.ticket);
            setTicket(response.data.result.ticket);
        } catch (error) {
            console.error("Error fetching ticket:", error.response?.data || error.message);
            setTicket({});
        } finally {
            setLoading(false); // Stop loading
        }
    };



    const fetchAgents = async () => {
        try {
            const response = await axiosInstance.get("http://localhost:5000/agents", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setAgents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axiosInstance.get("http://localhost:5000/departments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setDepartments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:5000/comments/${ticketid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.put(`http://localhost:5000/ticket/${ticketid}`, ticket, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Ticket updated successfully!');
            navigate('/tickets');
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('Error updating ticket.');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        try {
            const response = await axiosInstance.post(
                'http://localhost:5000/comments',
                {
                    ticketid,
                    comment: newComment,
                    agentid: ticket.agentid, // Ensure this is set correctly
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // if (response.data.success) {
            //     setComments([...comments, response.data.newComment]); // Update state
            alert('Comment add successfully!');
            setNewComment(''); // Clear input field
            fetchComments(); // Refetch comments to update UI instantly
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Error adding comment.');
        }
    };



    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Edit Ticket</h2>

            {/* Read-Only Fields */}
            {loading ? (
                <p>Loading...</p>
            ) : ticket ? (
                <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-700">Subject</span>
                        <input type="text" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            value={ticket?.subject || "N/A"} />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Email</span>
                        <input type="email" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            value={ticket?.email || "N/A"} />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Type</span>
                        <input type="text" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            value={ticket?.type || "N/A"} disabled />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Created By</span>
                        <input type="text" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            value={ticket?.created_by || "N/A"} disabled />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Contact Number</span>
                        <input type="text" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            value={ticket?.contactno || "N/A"} disabled />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Create Date</span>
                        <input type="text" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            value={ticket?.created_date || "N/A"} disabled />
                    </label>
                </div>
            ) : (
                <p>No ticket data found.</p>
            )}


            {/* Ticket Form */}

            <div className="grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-gray-700">Status</span>
                    <select
                        className="w-full p-2 border rounded"
                        value={ticket.status || ''}
                        onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
                    >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                    </select>
                </label>

                <label className="block">
                    <span className="text-gray-700">Priority</span>
                    <select
                        className="w-full p-2 border rounded"
                        value={ticket.priority || ''}
                        onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                    >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>

                <label className="block col-span-2">
                    <span className="text-gray-700">Description</span>
                    <textarea
                        className="w-full p-2 border rounded"
                        rows="4"
                        value={ticket.description || ''}
                        onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Agent</span>
                    <select
                        className="w-full p-2 border rounded"
                        value={ticket.agentid || ''}
                        onChange={(e) => setTicket({ ...ticket, agentid: e.target.value })}
                    >
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                            <option key={agent.agentid} value={agent.agentid}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-gray-700">Department</span>
                    <select
                        className="w-full p-2 border rounded"
                        value={ticket.deptid || ''}
                        onChange={(e) => setTicket({ ...ticket, deptid: e.target.value })}
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.deptid} value={dept.deptid}>
                                {dept.deptname}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Update Button */}
            <div className="mt-6 flex gap-2">
                <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-md">Update Ticket</button>
                <button onClick={() => navigate('/tickets')} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
            </div>

            {/* Display Existing Comments */}
            {Array.isArray(comments) && comments.length > 0 ? (
                comments
                    .filter(c => c && c.comment) // Ensure c exists and has a comment
                    .map((c, index) => (
                        <div key={index} className="bg-gray-100 p-3 rounded-md mb-2">
                            <p className="text-gray-700">{c.comment}</p>
                            <p className="text-sm text-gray-500">By Agent ID: {c.agentid}</p>
                        </div>
                    ))
            ) : (
                <p className="text-gray-500">No comments yet.</p>
            )}
            {/* Add New Comment */}
            <textarea
                className="w-full p-2 border rounded mt-3"
                rows="2"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-green-500 text-white rounded-md mt-2"
            >
                Add Comment
            </button>

        </div>
    );
};

export default EditTicket;
