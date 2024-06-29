import React from "react";
import { Link } from "@inertiajs/react";
import moment from "moment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";


const RecipesByCategory = ({ recipes, category, auth }) => {
    

    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {category.name} Recipes
                </h2>
            }
        >          
            <Head title="Recipes"/>
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-4">{category.name} Recipes</h1> */}
            
            
            {recipes.length > 0 ? (
                 <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <li key={recipe.id} className="mb-4">
                            <Link href={route("recipes.show", recipe.id)}>
                                <div className="flex items-center">
                                    <img
                                        src={`/storage/${recipe.image}`}
                                        alt={recipe.title}
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h3 className="text-md font-medium text-gray-800">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            By {recipe.user.name} • {moment(recipe.created_at).fromNow()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-600">No recipes available for this category.</p>
            )}
        </div>

        </AuthenticatedLayout>
    
    );

    
};

export default RecipesByCategory;
