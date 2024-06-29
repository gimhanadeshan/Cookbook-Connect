import React, { useState, useEffect } from "react";
import Checkbox from "@/Components/Checkbox";

const Sidebar = ({
    categories,
    selectedCategories,
    toggleCategory,
    singleCategoryFilter,
    handleSingleCategoryChange,
    resetSingleCategoryFilter,
    radioFilter,
    handleRadioChange,
    resetRadioFilter,
    auth,
    searchTerm,
    handleSearchChange,
    resetSearchTerm,
}) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Check screen width on component mount
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setExpanded(true);
            } else {
                setExpanded(false);
            }
        };

        handleResize(); // Set initial state based on current screen width

        // Add event listener to handle screen resize
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleResetFilters = () => {
        resetSingleCategoryFilter(); // Reset single category filter
        resetRadioFilter(); // Reset radio filter
        toggleCategory("all"); // Reset multiple category filter
        resetSearchTerm(); // Reset search term
    };

    return (
        <div>
            <button
                onClick={handleToggleExpand}
                className="md:hidden text-[#FFC0D3] focus:outline-none mb-4"
            >
                {expanded ? "Hide Filters" : "Show Filters"}
            </button>
            <div
                className={`bg-[#524A4E] p-4 rounded-lg shadow ${
                    expanded ? "block" : "hidden"
                } md:block`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#FDEFF4]">
                        Filters
                    </h3>
                    <button
                        onClick={handleToggleExpand}
                        className="text-[#FFC0D3] focus:outline-none md:hidden"
                    >
                        {expanded ? "Hide Filters" : "Expand Filters"}
                    </button>
                </div>
                {expanded && (
                    <>
                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search recipes"
                                className="w-full px-3 py-2 rounded-lg bg-[#6C6369] text-[#FDEFF4] focus:outline-none focus:ring-2 focus:ring-[#FFC0D3]"
                            />
                        </div>
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2 text-[#FFC0D3]">
                                Single Category Filter
                            </h4>
                            {/* Radio buttons for single category filter */}
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="single-category-all"
                                        name="single-category"
                                        value=""
                                        checked={singleCategoryFilter === ""}
                                        onChange={() =>
                                            handleSingleCategoryChange("")
                                        }
                                        className="text-[#FF5C8D] focus:ring-[#FFC0D3]"
                                    />
                                    <label
                                        htmlFor="single-category-all"
                                        className="text-sm text-[#FDEFF4]"
                                    >
                                        All
                                    </label>
                                </div>
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="radio"
                                            id={`single-category-${category.id}`}
                                            name="single-category"
                                            value={category.id}
                                            checked={
                                                singleCategoryFilter ===
                                                category.id.toString()
                                            }
                                            onChange={() =>
                                                handleSingleCategoryChange(
                                                    category.id.toString()
                                                )
                                            }
                                            className="text-[#FF5C8D] focus:ring-[#FFC0D3]"
                                        />
                                        <label
                                            htmlFor={`single-category-${category.id}`}
                                            className="text-sm text-[#FDEFF4]"
                                        >
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2 text-[#FFC0D3]">
                                Multiple Category Filter
                            </h4>
                            <div className="space-y-2">
                                {/* Checkbox filters for categories */}
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            value={category.id}
                                            checked={selectedCategories.includes(
                                                category.id
                                            )}
                                            onChange={() =>
                                                toggleCategory(category.id)
                                            }
                                        />
                                        <label
                                            htmlFor={`category-${category.id}`}
                                            className="text-sm text-[#FDEFF4]"
                                        >
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {auth.user && (
                            <div>
                                <h4 className="text-sm font-medium mb-2 text-[#FFC0D3]">
                                    Publish Status
                                </h4>
                                {/* Radio filters for publish status */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="radio-all"
                                            name="publish-status"
                                            value="all"
                                            checked={radioFilter === "all"}
                                            onChange={() =>
                                                handleRadioChange("all")
                                            }
                                            className="text-[#FF5C8D] focus:ring-[#FFC0D3]"
                                        />
                                        <label
                                            htmlFor="radio-all"
                                            className="text-sm text-[#FDEFF4]"
                                        >
                                            All
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="radio-published"
                                            name="publish-status"
                                            value="published"
                                            checked={radioFilter === "published"}
                                            onChange={() =>
                                                handleRadioChange("published")
                                            }
                                            className="text-[#FF5C8D] focus:ring-[#FFC0D3]"
                                        />
                                        <label
                                            htmlFor="radio-published"
                                            className="text-sm text-[#FDEFF4]"
                                        >
                                            Published
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="radio-unpublished"
                                            name="publish-status"
                                            value="unpublished"
                                            checked={radioFilter === "unpublished"}
                                            onChange={() =>
                                                handleRadioChange("unpublished")
                                            }
                                            className="text-[#FF5C8D] focus:ring-[#FFC0D3]"
                                        />
                                        <label
                                            htmlFor="radio-unpublished"
                                            className="text-sm text-[#FDEFF4]"
                                        >
                                            Unpublished
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mt-4">
                            <button
                                onClick={handleResetFilters}
                                className="bg-[#FF5C8D] text-sm text-[#FDEFF4] px-4 py-2 rounded-md hover:bg-[#FDEFF4] hover:text-[#FF5C8D] focus:outline-none"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
