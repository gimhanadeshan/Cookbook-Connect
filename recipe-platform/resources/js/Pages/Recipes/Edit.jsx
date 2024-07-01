import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";

const Edit = ({ recipe, auth, categories }) => {
    const [title, setTitle] = useState(recipe.title);
    const [description, setDescription] = useState(recipe.description);
    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [instructions, setInstructions] = useState(recipe.instructions);
    const [selectedCategory, setSelectedCategory] = useState(
        recipe.category_id || ""
    );
    const [published, setPublished] = useState(recipe.published);
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.put(
            route("recipes.update", recipe.id),
            {
                title,
                description,
                ingredients,
                instructions,
                category_id: selectedCategory, // Include selected category ID
                published,
            },
            {
                onSuccess: () => {
                    alert("Recipe updated successfully!");
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Recipe
                </h2>
            }
        >
            <Head title="Edit Recipe" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="container max-w-4xl mx-auto bg-white rounded-lg shadow-md p-10 mb-6">
                        <h1 className="text-3xl font-bold mb-4">Edit Recipe</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="block w-full border border-gray-300 p-2 rounded"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Ingredients
                                </label>
                                <textarea
                                    value={ingredients}
                                    onChange={(e) =>
                                        setIngredients(e.target.value)
                                    }
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                    rows="5"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Instructions
                                </label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) =>
                                        setInstructions(e.target.value)
                                    }
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                    rows="5"
                                ></textarea>
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Image
                            </label>
                            {recipe.image && (
                                <img
                                src={`/storage/${recipe.image}`}
                                    alt={title}
                                    className="mt-2 rounded-lg shadow-md max-h-64"
                                />
                            )}
                        </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Publish
                                </label>
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) =>
                                        setPublished(e.target.checked)
                                    }
                                    className="mt-1"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 rounded"
                            >
                                Update Recipe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
