import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ModalNew from "@/Components/ModalNew";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";


const UserManagement = ({ auth, users}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isRemoveAdminModalOpen, setIsRemoveAdminModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        // Initially set filtered users to all users
        setFilteredUsers(users);
    }, [users]);

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const openAdminModal = (user) => {
        setSelectedUser(user);
        setIsAdminModalOpen(true);
    };

    const openRemoveAdminModal = (user) => {
        setSelectedUser(user);
        setIsRemoveAdminModalOpen(true);
    };

    const handleDelete = () => {
        Inertia.delete(route("users.destroy", { user: selectedUser.id }), {
            onFinish: () => {
                setIsDeleteModalOpen(false);
                fetchUsers(); // Refresh user list after deletion
            },
        });
    };

    const handleMakeAdmin = () => {
        Inertia.put(route("users.makeAdmin", { user: selectedUser.id }), {
            onFinish: () => {
                setIsAdminModalOpen(false);
                fetchUsers(); // Refresh user list after making admin
            },
        });
    };

    const handleRemoveAdmin = () => {
        Inertia.put(route("users.removeAdmin", { user: selectedUser.id }), {
            onFinish: () => {
                setIsRemoveAdminModalOpen(false);
                fetchUsers(); // Refresh user list after removing admin
            },
        });
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        filterUsers(searchTerm);
    };

    const filterUsers = (term) => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setFilteredUsers(users); // Reset filtered users to all users
    };

    // Determine which users to display based on search term
    const usersToDisplay = searchTerm === '' ? users : filteredUsers;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    User Management
                </h2>
            }
        >
             <Head title="User Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium">Users</h3>
                            <div className="mt-4 relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name or email..."
                                    className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {usersToDisplay.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(user)
                                                    }
                                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                                >
                                                    Delete
                                                </button>
                                                {!user.is_admin && (
                                                    <button
                                                        onClick={() =>
                                                            openAdminModal(user)
                                                        }
                                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                                    >
                                                        Make Admin
                                                    </button>
                                                )}
                                                {user.is_admin && (
                                                    <button
                                                        onClick={() =>
                                                            openRemoveAdminModal(
                                                                user
                                                            )
                                                        }
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Remove Admin
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ModalNew
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Delete User</h2>
                    <p>Are you sure you want to delete {selectedUser?.name}?</p>
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </ModalNew>

            <ModalNew
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Make Admin</h2>
                    <p>
                        Are you sure you want to make {selectedUser?.name} an
                        admin?
                    </p>
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={() => setIsAdminModalOpen(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleMakeAdmin}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Make Admin
                        </button>
                    </div>
                </div>
            </ModalNew>

            <ModalNew
                isOpen={isRemoveAdminModalOpen}
                onClose={() => setIsRemoveAdminModalOpen(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Remove Admin</h2>
                    <p>
                        Are you sure you want to remove admin rights from{" "}
                        {selectedUser?.name}?
                    </p>
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={() => setIsRemoveAdminModalOpen(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRemoveAdmin}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Remove Admin
                        </button>
                    </div>
                </div>
            </ModalNew>
        </AuthenticatedLayout>
    );
};

export default UserManagement;
