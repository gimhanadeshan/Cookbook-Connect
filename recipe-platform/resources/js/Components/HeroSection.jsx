import React from "react";
import { Link } from "@inertiajs/react";

const HeroSection = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                            Welcome to Cookbook Connect
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Discover, share, and connect through delicious
                            recipes. Join our community of food enthusiasts and
                            find your next favorite dish.
                        </p>
                        <div className="mt-8 flex space-x-4">
                            <Link
                                href="/recipes"
                                className="inline-block bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-md text-lg font-medium"
                            >
                                Browse Recipes
                            </Link>
                            <Link
                                href="/register"
                                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-md text-lg font-medium"
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        <img
                            className="mx-auto h-96 w-full object-cover rounded-lg shadow-md"
                            src="/storage/hero-image.jpg"
                            alt="Delicious food"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
