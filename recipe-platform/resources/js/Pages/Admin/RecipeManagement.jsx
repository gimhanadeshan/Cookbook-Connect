import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

const RecipeManagement = ({ auth, recipes}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterPublished, setFilterPublished] = useState('all');

    useEffect(() => {
        filterRecipes(searchTerm, filterPublished);
    }, [searchTerm, filterPublished]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this recipe?')) {
            setIsLoading(true);
            Inertia.delete(route('recipes.destroy', id)).then(() => {
                setFilteredRecipes(filteredRecipes.filter(recipe => recipe.id !== id));
                setIsLoading(false);
            }).catch(error => {
                setIsLoading(false);
                console.error('Delete error:', error);
            });
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    const handleFilterPublishedChange = (e) => {
        const publishedStatus = e.target.value;
        setFilterPublished(publishedStatus);
    };

    const filterRecipes = (term, publishedStatus) => {
        const filtered = recipes.filter(recipe => {
            const matchesTerm = recipe.title.toLowerCase().includes(term.toLowerCase());
            if (publishedStatus === 'all') {
                return matchesTerm;
            } else if (publishedStatus === 'true') {
                return matchesTerm && recipe.published;
            } else if (publishedStatus === 'false') {
                return matchesTerm && !recipe.published;
            }
            return true; // Default to showing all if no valid filter applied
        });
        setFilteredRecipes(filtered);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setFilterPublished('all');
        setFilteredRecipes(recipes);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Recipe Management
                </h2>
            }
        >
            <Head title="Recipe Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recipes</h3>
                            <div className="flex items-center mb-4">
                                <div className="flex-1">
                                    <a href={route('recipes.create')} className="bg-blue-500 text-white px-4 py-2 rounded inline-block">Create New Recipe</a>
                                </div>
                                <div className="relative flex-1 ml-4">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search by title..."
                                        className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
                                    />
                                    {searchTerm && (
                                        <button onClick={clearSearch} className="absolute inset-y-0 right-0 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded">
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="relative flex-1 ml-4">
                                    <select
                                        value={filterPublished}
                                        onChange={handleFilterPublishedChange}
                                        className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
                                    >
                                        <option value="all">All</option>
                                        <option value="true">Published</option>
                                        <option value="false">Unpublished</option>
                                    </select>
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">Loading...</td>
                                        </tr>
                                    ) : filteredRecipes.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">No recipes found</td>
                                        </tr>
                                    ) : (
                                        filteredRecipes.map((recipe) => (
                                            <tr key={recipe.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{recipe.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{recipe.published ? 'Yes' : 'No'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{recipe.category.name ? recipe.category.name : 'Uncategorized'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{recipe.user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={route('recipes.show', recipe.id)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">View</Link>
                                                    <Link href={route('recipes.edit', recipe.id)} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</Link>
                                                    <Link onClick={() => handleDelete(recipe.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</Link>
                                                    <a href={route('recipes.downloadpdf', recipe.id)} className="bg-green-500 text-white px-4 py-2 rounded ml-2">Download PDF</a>
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

export default RecipeManagement;
