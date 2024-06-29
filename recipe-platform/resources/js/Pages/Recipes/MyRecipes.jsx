import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from "@inertiajs/react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const MyRecipes = ({ auth, recipes, categories }) => {
    const [userRecipes, setUserRecipes] = useState([]);
    const [chartData, setChartData] = useState({});
    const [dailyReviewData, setDailyReviewData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setUserRecipes(recipes);
        generateChartData(recipes);
        generateDailyReviewData(recipes);
    }, [recipes]);

    const handleDeleteRecipe = (recipeId) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            Inertia.delete(`/recipes/${recipeId}`)
                .then(() => {
                    Inertia.get("/recipes/getMyRecipe")
                        .then((response) => {
                            setUserRecipes(response.data.recipes);
                            generateChartData(response.data.recipes);
                            generateDailyReviewData(response.data.recipes);
                        })
                        .catch((error) => {
                            console.error(
                                "Error fetching recipes after deletion:",
                                error
                            );
                        });
                })
                .catch((error) => {
                    console.error("Error deleting recipe:", error);
                });
        }
    };

    const generateChartData = (recipes) => {
        const labels = recipes.map((recipe) => recipe.title);
        const data = recipes.map((recipe) => {
            const totalReviews = recipe.reviews.length;
            const averageRating =
                totalReviews > 0
                    ? recipe.reviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                      ) / totalReviews
                    : 0;
            return averageRating;
        });

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Average Rating",
                    data: data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        });
    };

    const generateDailyReviewData = (recipes) => {
        const dailyData = {};

        recipes.forEach((recipe) => {
            recipe.reviews.forEach((review) => {
                const date = new Date(review.created_at).toLocaleDateString();
                if (!dailyData[date]) {
                    dailyData[date] = 0;
                }
                dailyData[date] += 1;
            });
        });

        const labels = Object.keys(dailyData).sort(
            (a, b) => new Date(a) - new Date(b)
        );
        const data = labels.map((label) => dailyData[label]);

        setDailyReviewData({
            labels: labels,
            datasets: [
                {
                    label: "Daily Reviews",
                    data: data,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    fill: false,
                },
            ],
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredRecipes = userRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    My Recipes
                </h2>
            }
        >
            <Head title="My Recipes" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            {userRecipes.length === 0 ? (
                                <p>No recipes found.</p>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-1 bg-white p-6">
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="Search for recipes..."
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </div>

                                        <ul className="divide-y divide-gray-200">
                                            {filteredRecipes.map((recipe) => (
                                                <li
                                                    key={recipe.id}
                                                    className="py-4 flex"
                                                >
                                                    <div className="ml-2 flex-1">
                                                        <div className="font-semibold">
                                                            <Link
                                                                className="text-blue-500 hover:text-blue-700"
                                                                href={route(
                                                                    "recipes.show",
                                                                    recipe.id
                                                                )}
                                                            >
                                                                {recipe.title}
                                                            </Link>
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {recipe.description}
                                                        </div>
                                                        <div className="mt-2">
                                                            <Link
                                                                className="text-blue-500 hover:text-blue-700"
                                                                href={route(
                                                                    "recipes.edit",
                                                                    recipe.id
                                                                )}
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                className="text-red-500 hover:text-red-700 ml-2"
                                                                onClick={() =>
                                                                    handleDeleteRecipe(
                                                                        recipe.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                        {!recipe.published && (
                                                            <div className="mt-2 text-red-500" >
                                                                This recipe is not yet published
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="mb-6 bg-white p-10">
                                            <h2 className="text-2xl font-bold mb-4">
                                                Average Rating of Recipes
                                            </h2>
                                            <Bar data={chartData} />
                                        </div>
                                        <div className="mb-6 bg-white p-10">
                                            <h2 className="text-2xl font-bold mb-4">
                                                Daily Reviews
                                            </h2>
                                            <Line data={dailyReviewData} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MyRecipes;
