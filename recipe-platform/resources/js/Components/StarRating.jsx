import React from "react";

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={i <= rating ? "text-yellow-500" : "text-gray-300"}
            >
                &#9733; {/* Unicode star character */}
            </span>
        );
    }
    return <>{stars}</>;
};

export default StarRating;
