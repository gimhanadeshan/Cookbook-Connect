import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import Sidebar from "@/Components/Sidebar";
import moment from "moment"; // Import Moment.js
import RecentRecipesSidebar from "@/Components/RecentRecipesSidebar";
import CategoriesSidebar from "@/Components/CategoriesSidebar";
import HeroSection from "@/Components/HeroSection";

const Home = ({ recipes, categories, auth, reviews }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(6);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [radioFilter, setRadioFilter] = useState("all");
    const [singleCategoryFilter, setSingleCategoryFilter] = useState("");

    useEffect(() => {
        setSelectedCategories(categories.map((category) => category.id));
    }, [categories]);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1);
        e.target;
    };

    const toggleCategory = (categoryId, e) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
        setCurrentPage(1);
        e.target;
    };

    const handleRadioChange = (filterValue, e) => {
        setRadioFilter(filterValue);
        setCurrentPage(1);
        e.target;
    };

    const handleSingleCategoryChange = (categoryId, e) => {
        setSingleCategoryFilter(categoryId);
        setCurrentPage(1);
        e.target;
    };

    const filteredRecipes = recipes.filter((recipe) => {
        const categoryCondition =
            selectedCategories.length === 0 ||
            selectedCategories.includes(recipe.category_id);

        const searchCondition =
            searchTerm === "" ||
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase());

        let radioFilterCondition = true;
        if (radioFilter === "published") {
            radioFilterCondition = recipe.published;
        } else if (radioFilter === "unpublished") {
            radioFilterCondition = !recipe.published;
        }

        const singleCategoryFilterCondition =
            singleCategoryFilter === "" ||
            recipe.category_id.toString() === singleCategoryFilter;

        return (
            categoryCondition &&
            searchCondition &&
            radioFilterCondition &&
            singleCategoryFilterCondition
        );
    });

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(
        indexOfFirstRecipe,
        indexOfLastRecipe
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to calculate average reviews rating for a recipe
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;

        const totalRating = reviews.reduce(
            (acc, review) => acc + review.rating,
            0
        );
        return totalRating / reviews.length;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Recipes
                </h2>
            }
        >
            <Head title="Recipes" />
            <div className="py-12 bg-[#FDEFF4]">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Sidebar for filters */}
                        <div className="col-span-1 md:col-span-1">
                            <Sidebar
                                categories={categories}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                singleCategoryFilter={singleCategoryFilter}
                                handleSingleCategoryChange={
                                    handleSingleCategoryChange
                                }
                                radioFilter={radioFilter}
                                handleRadioChange={handleRadioChange}
                                auth={auth}
                                handleSearchChange={handleSearchChange}
                            />
                            <br />
                            <RecentRecipesSidebar recipes={recipes} />
                        </div>

                        {/* Recipes display */}
                        <div className="col-span-3">
                            {currentRecipes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                                    {currentRecipes.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className="bg-white border border-gray-200 rounded-lg shadow transform hover:scale-105 transition duration-300 ease-in-out "
                                        >
                                            <Link
                                                href={route(
                                                    "recipes.show",
                                                    recipe.id
                                                )}
                                            >
                                                <img
                                                    className="rounded-t-lg "
                                                    src={`/storage/${recipe.image}`}
                                                    alt={recipe.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "200px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Link>
                                            <div className="p-4">
                                                <Link
                                                    href={route(
                                                        "recipes.show",
                                                        recipe.id
                                                    )}
                                                >
                                                    <h5 className="text-xl font-semibold mb-2 text-[#524A4E]">
                                                        {recipe.title}
                                                    </h5>
                                                </Link>

                                                {!recipe.published && (
                                                    <p className="text-sm text-[#FF5C8D] mb-3">
                                                        Unpublished
                                                    </p>
                                                )}
                                                {/* Display average reviews rating */}
                                                {reviews && (
                                                    <p className="text-sm text-gray-700 mb-1">
                                                        Average Rating:{" "}
                                                        {calculateAverageRating(
                                                            recipe.reviews
                                                        ).toFixed(1)}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-700 mb-1">
                                                    Added{" "}
                                                    {moment(
                                                        recipe.created_at
                                                    ).fromNow()}{" "}
                                                    {"  "}{" "}
                                                </p>
                                                <p className="text-sm text-gray-700 mb-3">
                                                    {recipe.description}
                                                </p>
                                                <Link
                                                    href={route(
                                                        "recipes.show",
                                                        recipe.id
                                                    )}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-[#FF5C8D] rounded-lg hover:bg-[#FFC0D3] focus:ring-4 focus:outline-none focus:ring-[#FFC0D3]"
                                                >
                                                    View Recipe
                                                    <svg
                                                        className="w-3.5 h-3.5 ms-2"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 10"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                                        />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-xl font-semibold text-gray-800">
                                        No recipes found.
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {currentRecipes.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        recipesPerPage={recipesPerPage}
                                        totalRecipes={filteredRecipes.length}
                                        paginate={paginate}
                                    />
                                </div>
                            )}
                            <br />
                            <CategoriesSidebar categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Home;
