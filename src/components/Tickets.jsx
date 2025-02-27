import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import axiosInstance from '../auth';
import { Link } from 'react-router-dom';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [limit, setLimit] = useState(5); //  State for number of records per page    
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchTickets(page, limit);
    }, [page, limit]);
    const fetchTickets = async (pageNumber = 1, pageSize = 5) => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get(`http://localhost:5000/tickets?page=${pageNumber}&limit=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let sortedTickets = response.data.result.tickets || [];

            sortedTickets.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            setTickets(sortedTickets);

            setTotalPages(response.data.pagination.totalPages);
            setLoading(false);
        } catch (err) {
            setError('Error fetching tickets');
            setLoading(false);
        }
    };
    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage); // Now updates and refetches data
        }
    };

    const handleDelete = async (ticketid) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;

        try {
            await axiosInstance.delete(`http://localhost:5000/ticket/${ticketid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh ticket list after deletion
            fetchTickets(page);
        } catch (err) {
            console.error("Error deleting ticket:", err);
            alert("Failed to delete ticket.");
        }
    };


    const columns = useMemo(
        () => [
            {
                header: 'S.No',
                cell: ({ row }) => row.index + 1 + (page - 1) * limit,
            },
            {
                header: 'Ticket ID',
                accessorKey: 'ticketid',
                cell: ({ row }) => (
                    <Link
                        to={`/ticket/${row.original.ticketid}`}
                        className="text-blue-500 underline"
                    >
                        {row.original.ticketid}
                    </Link>

                ),
            },
            { header: 'Subject', accessorKey: 'subject' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Type', accessorKey: 'type' },
            { header: 'Status', accessorKey: 'status' },
            { header: 'Priority', accessorKey: 'priority' },
            { header: 'Created By', accessorKey: 'created_by' },
            { header: 'Description', accessorKey: 'description' },
            { header: 'Contact No', accessorKey: 'contactno' },
            {
                header: 'Agent',
                accessorKey: 'agent.name'
            },
            {
                header: 'Department',
                accessorKey: 'department.deptname'
            },
            {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">

                        <button
                            onClick={() => handleDelete(row.original.ticketid)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                ),
            },

        ],
        [page]
    );

    const table = useReactTable({
        data: tickets,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">All Tickets</h2>
            <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
                <table className="min-w-full table-auto text-md">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2 text-gray-900">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2 text-gray-900">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                        className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="text-lg font-semibold">Page {page} of {totalPages}</span>
                    <button
                        className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
                {/*  Records Per Page Dropdown */}
                <div className="flex justify-end mb-4">
                    <label className="mr-2 text-gray-700 font-medium">Records per page:</label>
                    <select
                        value={limit}
                        onChange={handleLimitChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Tickets;
