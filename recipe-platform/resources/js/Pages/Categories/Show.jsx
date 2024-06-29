import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

const Show = ({ auth, category }) => {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {category.name}
                </h2>
            }
        >
            <Head title={category.name} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="container max-w-4xl mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-4">
                            {category.name}
                        </h1>
                        {category.image && (
                            <img
                                src={`/storage/${category.image}`}
                                alt={category.name}
                                className="mt-2 rounded-lg shadow-md max-h-48"
                            />
                        )}
                        <p className="mt-4">
                            {category.description
                                ? category.description
                                : "No description available."}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
