import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { Link } from "@inertiajs/react";


const CreateReview = ({ recipe }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleStarClick = (star) => {
        setRating(star);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     Inertia.post(route('reviews.store', recipe.id), {
    //         rating,
    //         comment,
    //     });
    // };
    function handleSubmit(e) {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        formData.append("rating", rating);
        formData.append("comment", comment);
   
        Inertia.post(route('reviews.store', recipe.id), formData, {
           
        });
    }


    return (
        <div className="container max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Add Review</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-8 w-8 cursor-pointer ${
                                    star <= rating ? "text-yellow-500" : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                onClick={() => handleStarClick(star)}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 1l2.42 5.856h6.053l-4.911 3.993L15.263 19 10 15.748 4.737 19l1.751-7.151L1.525 6.856h6.053L10 1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Comment
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default CreateReview;
