import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";

const Create = ({ auth, categories }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState([""]);
    const [image, setImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [published, setPublished] = useState(false);
    const [errors, setErrors] = useState({}); // State for validation errors

    const validateForm = () => {
        const newErrors = {};
        if (!title) newErrors.title = "Title is required";
        if (!description) newErrors.description = "Description is required";
        if (ingredients.some(ingredient => !ingredient)) newErrors.ingredients = "All ingredient fields must be filled";
        if (instructions.some(instruction => !instruction)) newErrors.instructions = "All instruction fields must be filled";
        if (!selectedCategory) newErrors.selectedCategory = "Category is required";
        if (!image) newErrors.image = "image is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        let formData = new FormData(e.target);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("ingredients", ingredients.join("\n"));
        formData.append("instructions", instructions.join("\n"));
        formData.append("published", published ? 1 : 0);
        if (image) {
            formData.append("image", image);
        }
        if (selectedCategory) {
            formData.append("category_id", selectedCategory);
        }

        Inertia.post("/recipes", formData);
        alert("Recipe Created successful!");

        
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        setImage(file);
    };

    const handleFileInputChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleRemoveInstruction = (index) => {
        const newInstructions = instructions.filter((_, i) => i !== index);
        setInstructions(newInstructions);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Recipe
                </h2>
            }
        >
            <Head title="Create Recipe" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 ">
                
                    <div className="container max-w-4xl mx-auto bg-white rounded-lg shadow-md p-10 mb-6">
                        <h1 className="text-3xl font-bold mb-4">Create Recipe</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="block w-full border border-gray-300 p-2 rounded"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.selectedCategory && <p className="text-red-500 text-sm mt-1">{errors.selectedCategory}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddIngredient} className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
                                    Add Ingredient
                                </button>
                                {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                                {instructions.map((instruction, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={instruction}
                                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 p-2 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInstruction(index)}
                                            className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddInstruction} className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
                                    Add Instruction
                                </button>
                                {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
                            </div>
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`border-2 border-dashed p-4 flex-1 ${dragging ? "bg-gray-100" : ""}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <label className="block text-sm font-medium text-gray-700">Drag & Drop Image Here</label>
                                    <input type="file" onChange={handleFileInputChange} className="hidden" />
                                </div>
                                <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded">
                                    Choose File
                                    <input type="file" onChange={handleImageChange} className="hidden" />
                                </label>
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>
                            {image && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">Selected Image:</p>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Selected"
                                        className="mt-2 rounded-lg shadow-md max-h-48"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Publish</label>
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    className="mt-1"
                                />
                            </div>
                            <button type="submit" className="bg-blue-500  text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 transition duration-200 ease-in-out">
                                Create Recipe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
       
    </AuthenticatedLayout>
);
};

export default Create;

