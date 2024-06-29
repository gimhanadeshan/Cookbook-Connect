<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function create(Recipe $recipe)
    {
        // Ensure the user is logged in
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        return Inertia::render('Reviews/Create', ['recipe' => $recipe]);
    }

    public function store(Request $request, Recipe $recipe)
    {
        // Ensure the user is logged in
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = new Review;
        $review->user_id = auth()->id();
        $review->recipe_id = $recipe->id;
        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->save();

        return redirect()->route('recipes.show', $recipe->id);
    }

    public function edit(Review $review)
    {
        // Ensure the user is logged in
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Check if user is authorized to edit the review
        if (auth()->id() !== $review->user_id && !auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Reviews/Edit', ['review' => $review]);
    }

    public function update(Request $request, Review $review)
    {
        // Ensure the user is logged in
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Check if user is authorized to update the review
        if (auth()->id() !== $review->user_id && !auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->save();

        return redirect()->route('recipes.show', $review->recipe_id);
    }

    public function destroy(Review $review)
    {
        // Ensure the user is logged in
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        // Check if user is authorized to delete the review
        if (auth()->id() !== $review->user_id && !auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }

        $review->delete();

        return redirect()->route('recipes.show', $review->recipe_id);
    }
}
