// resources/js/Components/Welcome.jsx

import React from 'react';
import { Link, Head } from '@inertiajs/react';

const Welcome = ({ auth }) => {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-white">
                <div className="relative min-h-screen flex flex-col items-center justify-center">
                    <div className="max-w-2xl px-6 lg:max-w-7xl">
                        {/* Header */}
                        <header className="py-6 lg:py-10 lg:flex lg:justify-between lg:items-center">
                            <div className="flex justify-center lg:col-start-2">
                                <img
                                    src="/storage/logo.png" // Update with your logo path
                                    alt="CookBook Connect Logo"
                                    className="w-20 h-auto"
                                />
                            </div>
                            <nav className="space-x-4 mt-4 lg:mt-0">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-black hover:text-gray-700 transition duration-300 ease-in-out"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-black hover:text-gray-700 transition duration-300 ease-in-out"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="text-black hover:text-gray-700 transition duration-300 ease-in-out"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Hero Section */}
                        <main className="mt-6 lg:mt-12">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <div className="text-center lg:text-left">
                                    <h1 className="text-4xl lg:text-5xl font-bold text-black mb-4">
                                        Welcome to CookBook Connect
                                    </h1>
                                    <p className="text-lg text-gray-700 mb-6">
                                        Discover, share, and organize your favorite recipes.
                                    </p>
                                    <div className="flex justify-center lg:justify-start">
                                        <Link
                                            href={route('recipes.index')}
                                            className="bg-pink-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-pink-600 transition duration-300 ease-in-out"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden lg:block relative overflow-hidden">
                                    <img
                                        src="/storage/hero-image.jpg" // Update with your hero image path
                                        alt="Hero Image"
                                        className="rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="py-8 text-center text-sm text-gray-600">
                            &copy; {new Date().getFullYear()} CookBook Connect. All rights reserved.
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Welcome;
