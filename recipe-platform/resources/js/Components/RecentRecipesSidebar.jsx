import React from "react";
import { Link } from "@inertiajs/react";
import moment from "moment";

const RecentRecipesSidebar = ({ recipes }) => {
    // Get the 5 most recent recipes
    const recentRecipes = recipes.slice(0, 5);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Recipes
            </h2>
            {recentRecipes.length > 0 ? (
                <ul>
                    {recentRecipes.map((recipe) => (
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
                                            By {recipe.user.name} •{" "}
                                            {moment(
                                                recipe.created_at
                                            ).fromNow()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-600">
                    No recent recipes available.
                </p>
            )}
        </div>
    );
};

export default RecentRecipesSidebar;
