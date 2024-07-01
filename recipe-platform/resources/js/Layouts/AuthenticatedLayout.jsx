import React, { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import Footer from "@/Components/Footer";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Sticky Navbar */}
            <nav className="bg-[#524A4E] text-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/">
                                    <img
                                        src="/storage/logo.png" // Update with your logo path
                                        alt="CookBook Connect Logo"
                                        className="block h-9 w-auto fill-current text-white"
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    className="text-white hover:text-gray-300"
                                >
                                    All Recipes
                                </NavLink>

                                {user && (
                                    <NavLink
                                        href={route("recipes.getMyRecipe")}
                                        active={route().current(
                                            "recipes.getMyRecipe"
                                        )}
                                        className="text-white hover:text-gray-300"
                                    >
                                        My Recipes
                                    </NavLink>
                                )}
                                {user && (
                                    <NavLink
                                        href={route("recipes.create")}
                                        active={route().current(
                                            "recipes.create"
                                        )}
                                        className="text-white hover:text-gray-300"
                                    >
                                        Create Recipe
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {user ? (
                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#524A4E] hover:bg-gray-600 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                                className="text-gray-800 hover:text-gray-900"
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="text-gray-800 hover:text-gray-900"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                            {user.is_admin && (
                                                <>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "users.index"
                                                        )}
                                                        className="text-gray-800 hover:text-gray-900"
                                                    >
                                                        User Management
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "recipes.manage"
                                                        )}
                                                        className="text-gray-800 hover:text-gray-900"
                                                    >
                                                        Recipe Management
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "categories.index"
                                                        )}
                                                        className="text-gray-800 hover:text-gray-900"
                                                    >
                                                        Categories
                                                    </Dropdown.Link>
                                                </>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("login")}
                                        className="text-sm text-white hover:text-gray-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="text-sm text-white hover:text-gray-300"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Dropdown Menu */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden bg-[#524A4E]"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className="text-white hover:text-gray-300 "
                        >
                            All Recipes
                        </ResponsiveNavLink>
                    </div>
                    {user && (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("recipes.getMyRecipe")}
                                active={route().current("recipes.getMyRecipe")}
                                className="text-white hover:text-gray-300 "
                            >
                                My Recipes
                            </ResponsiveNavLink>
                        </div>
                    )}
                    {user && (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("recipes.create")}
                                active={route().current("recipes.create")}
                                className="text-white hover:text-gray-300 "
                            >
                                Create Recipe
                            </ResponsiveNavLink>
                        </div>
                    )}

                    <div className="pt-4 pb-1 border-t border-gray-700">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="font-medium text-base text-white">
                                        {user.name}
                                    </div>
                                    <div className="font-medium text-sm text-gray-300">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink
                                        href={route("profile.edit")}
                                        className="text-white hover:text-gray-300"
                                    >
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                        className="text-white hover:text-gray-300"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                    {user.is_admin && (
                                        <>
                                            <ResponsiveNavLink
                                                href={route("users.index")}
                                                className="text-white hover:text-gray-300"
                                            >
                                                User Management
                                            </ResponsiveNavLink>
                                            <ResponsiveNavLink
                                                href={route("recipes.manage")}
                                                className="text-white hover:text-gray-300"
                                            >
                                                Recipe Management
                                            </ResponsiveNavLink>
                                            <ResponsiveNavLink
                                                href={route("categories.index")}
                                                className="text-white hover:text-gray-300"
                                            >
                                                Categories
                                            </ResponsiveNavLink>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("login")}
                                    className="text-white hover:text-gray-300"
                                >
                                    Login
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("register")}
                                    className="text-white hover:text-gray-300"
                                >
                                    Register
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Page Heading */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
