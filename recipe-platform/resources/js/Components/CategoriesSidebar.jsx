import React, { useRef } from "react";
import { Link } from "@inertiajs/react";

const CategoriesSidebar = ({ categories }) => {
    const scrollRef = useRef(null);

    const handleMouseMove = (e) => {
        const scrollContainer = scrollRef.current;
        const containerWidth = scrollContainer.clientWidth;
        const scrollWidth = scrollContainer.scrollWidth;
        const scrollPercentage = (e.clientX - scrollContainer.getBoundingClientRect().left) / containerWidth;
        const scrollTo = (scrollWidth - containerWidth) * scrollPercentage;
        scrollContainer.scrollTo({ left: scrollTo, behavior: 'smooth' });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
            {categories.length > 0 ? (
                <div className="flex items-center">
                    <ul
                        ref={scrollRef}
                        onMouseMove={handleMouseMove}
                        className="flex space-x-8 overflow-x-auto scrollbar-hide px-2"
                    >
                        {categories.map((category) => (
                            <li key={category.id} className="flex-none mb-4">
                                <Link href={route("recipes.byCategory", category.id)}>
                                    <div className="flex flex-col items-center">
                                        {category.image && (
                                            <img
                                                src={`/storage/${category.image}`}
                                                alt={category.name}
                                                className="w-16 h-16 rounded-full object-cover mb-2 transform hover:scale-105 transition duration-300 ease-in-out"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-md font-medium text-gray-800 text-center">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-sm text-gray-600">No categories available.</p>
            )}
        </div>
    );
};

export default CategoriesSidebar;
