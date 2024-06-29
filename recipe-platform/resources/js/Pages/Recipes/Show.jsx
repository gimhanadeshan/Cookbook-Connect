import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-react";
import { Link } from "@inertiajs/react";
import ModalNew from "@/Components/ModalNew";
import EditReview from "@/Pages/Reviews/Edit";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateReview from "@/Pages/Reviews/Create";
import StarRating from "@/Components/StarRating";
import moment from "moment";
import RecentRecipesSidebar from "@/Components/RecentRecipesSidebar";

const Show = ({ recipe, auth, reviews, recipes }) => {
    const { delete: destroy, put } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [showReviews, setShowReviews] = useState(true);



    const handleDelete = (reviewId, e) => {
        if (confirm("Are you sure you want to delete this review?")) {
            Inertia.delete(route('reviews.delete',reviewId));
            e.target;
        }
    };


    const handleDeleteRecipe = (recipeId) => {
        if (confirm("Are you sure you want to delete this recipe?")) {
            Inertia.delete(`/recipes/${recipeId}`);
        }
    };

    const handlePublish = () => {
        if (confirm("Are you sure you want to publish this recipe?")) {
            Inertia.put(`/recipes/${recipe.id}/publish`);
        }
    };

    const handleDownloadPdf = () => {
        window.location.href =route('recipes.downloadpdf',recipe.id);
    };

    const ingredientsList = recipe.ingredients.split("\n");
    const instructionsList = recipe.instructions.split("\n");

    const handleEditReview = (review) => {
        setCurrentReview(review);
        setIsModalOpen(true);
    };

    const handleToggleReviews = () => {
        setShowReviews(!showReviews);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Recipe
                </h2>
            }
        >
            <Head title="Recipe Details" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="container max-w-4xl mx-auto p-10 bg-white rounded-lg shadow-lg">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    {recipe.title} | {recipe.category.name}
                                </h1>

                                {recipe.image && (
                                    <div className="mb-6">
                                        <img
                                            src={`/storage/${recipe.image}`}
                                            alt={recipe.title}
                                            className="rounded-lg shadow-md w-full h-96 object-cover"
                                        />
                                    </div>
                                )}

                                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                                    <strong>Description:</strong>{" "}
                                    {recipe.description}
                                </p>

                                <div className="mb-6">
                                    <strong className="block text-xl text-gray-900 mb-2">
                                        Ingredients:
                                    </strong>
                                    <ul className="list-disc list-inside text-lg text-gray-700 space-y-1">
                                        {ingredientsList.map(
                                            (ingredient, index) => (
                                                <li key={index}>
                                                    {ingredient}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <strong className="block text-xl text-gray-900 mb-2">
                                        Instructions:
                                    </strong>
                                    <ol className="list-decimal list-inside text-lg text-gray-700 space-y-1">
                                        {instructionsList.map(
                                            (instruction, index) => (
                                                <li key={index}>
                                                    {instruction}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </div>

                                <p className="mb-4 text-sm text-gray-500">
                                    Added {moment(recipe.created_at).fromNow()} by {recipe.user.name} 
                                </p>

                                {auth.user &&
                                    auth.user.id === recipe.user_id && (
                                        <div className="mb-6 flex space-x-4">
                                            <Link
                                                href={`/recipes/${recipe.id}/edit`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                                            >
                                                Edit Recipe
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDeleteRecipe(
                                                        recipe.id
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                            >
                                                Delete Recipe
                                            </button>
                                            {!recipe.published && (
                                                <Link
                                                    onClick={handlePublish}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                                >
                                                    Publish Recipe
                                                </Link>
                                            )}
                                        </div>
                                    )}

                                {!recipe.published && (
                                    <p className="text-[#FF5C8D] font-bold mb-6">
                                        This recipe is unpublished
                                    </p>
                                )}

                                {recipe.published ? (
                                    <>
                                        <div className="mt-8">
                                            {auth.user ? (
                                                <CreateReview recipe={recipe} />
                                            ) : (
                                                <p className="text-center mt-4 text-lg text-gray-700">
                                                    Please{" "}
                                                    <Link
                                                        href="/login"
                                                        className="text-blue-500"
                                                    >
                                                        login
                                                    </Link>{" "}
                                                    to add a review.
                                                </p>
                                            )}
                                        </div>

                                        {/* Print and Download Buttons */}
                                        <div className="mt-8 flex justify-center">
                                            <button
                                                onClick={handleDownloadPdf}
                                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                                            >
                                                Download Recipe
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center mt-4">
                                        <p className="text-lg text-gray-700 italic">
                                            This recipe is not yet published and
                                            cannot be reviewed or downloaded.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <RecentRecipesSidebar recipes={recipes} />
                            {recipe.published ? (
                                <div className="mt-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                        Reviews
                                        <button
                                            onClick={handleToggleReviews}
                                            className="ml-2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showReviews ? "Hide" : "Show"}{" "}
                                            Reviews
                                        </button>
                                    </h2>
                                    {showReviews && reviews.length ? (
                                        reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="mb-6 border p-4 rounded-lg shadow-md"
                                            >
                                                <div className="flex justify-between mb-4">
                                                    <StarRating
                                                        rating={review.rating}
                                                    />
                                                    <div className="text-gray-600">
                                                        By {review.user.name}
                                                    </div>
                                                </div>
                                                <p className="text-lg text-gray-700 mb-4">
                                                    {review.comment}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Reviewed{" "}
                                                    {moment(
                                                        review.created_at
                                                    ).fromNow()}
                                                </p>
                                                {auth.user &&
                                                    (auth.user.id ===
                                                        review.user_id ||
                                                        auth.user.is_admin) && (
                                                        <div className="mt-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditReview(
                                                                        review
                                                                    )
                                                                }
                                                                className="text-blue-500 hover:underline mr-2"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        review.id
                                                                    )
                                                                }
                                                                className="text-red-500 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-lg text-gray-700">
                                            {reviews.length > 0
                                                ? `${reviews.length} review${
                                                      reviews.length !== 1
                                                          ? "s"
                                                          : ""
                                                  }`
                                                : "No reviews yet."}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ModalNew
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {currentReview && (
                    <EditReview
                        review={currentReview}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </ModalNew>
        </AuthenticatedLayout>
    );
};

export default Show;
