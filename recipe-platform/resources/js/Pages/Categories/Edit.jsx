import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

const Edit = ({ auth, category }) => {
    const [name, setName] = useState(category.name);
    const [image, setImage] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("name", name);
        if (image) {
            formData.append("image", image);
        }

        Inertia.post(`/categories/${category.id}`, formData, {
            headers: {
                "X-HTTP-Method-Override": "PUT",
            },
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        setImage(file);
    };

    const handleFileInputChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Category
                </h2>
            }
        >
            <Head title="Edit Category" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="container max-w-4xl mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-4">
                            Edit Category
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`border-2 border-dashed p-4 flex-1 ${
                                        dragging ? "bg-gray-100" : ""
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <label className="block text-sm font-medium text-gray-700">
                                        Drag & Drop Image Here
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                </div>
                                <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded">
                                    Choose File
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {image && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                        Selected Image:
                                    </p>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Selected"
                                        className="mt-2 rounded-lg shadow-md max-h-48"
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                            >
                                Update Category
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
