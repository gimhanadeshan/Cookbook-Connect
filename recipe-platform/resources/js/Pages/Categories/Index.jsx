import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

const Index = ({ auth, categories }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFilteredCategories(categories);
    }, [categories]);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setIsLoading(true);
            Inertia.delete(`/categories/${id}`)
                .then(() => {
                    setFilteredCategories(
                        filteredCategories.filter(
                            (category) => category.id !== id
                        )
                    );
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        filterCategories(term);
    };

    const filterCategories = (term) => {
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setFilteredCategories(categories);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Categories
                </h2>
            }
        >
            <Head title="Categories" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium">Categories</h3>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <Link
                                        href="/categories/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded inline-flex"
                                    >
                                        Create Category
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search by name..."
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
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : filteredCategories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center py-4"
                                            >
                                                No categories found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {category.image && (
                                                        <img
                                                            src={`/storage/${category.image}`}
                                                            alt={category.name}
                                                            className="h-16 rounded"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={`/categories/${category.id}/edit`}
                                                        className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id
                                                            )
                                                        }
                                                        className="bg-red-500 text-white px-4 py-1 rounded"
                                                    >
                                                        Delete
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
