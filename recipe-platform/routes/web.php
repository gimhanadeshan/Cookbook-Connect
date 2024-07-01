<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ReviewController;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
      
    ]);
});

Route::resource('recipes', RecipeController::class);
Route::get('/guest', [RecipeController::class, 'index'])->name('recipes.guest');
Route::get('/recipes/category/{category}', [RecipeController::class, 'recipesByCategory'])->name('recipes.byCategory');
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [RecipeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/admin/recipes', [RecipeController::class, 'manage'])->name('recipes.manage');
   
    Route::post('/recipes/{recipe}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/recipes/{recipe}/reviews/create', [ReviewController::class, 'create']);
    Route::get('reviews/{review}/edit', [ReviewController::class, 'edit']);
    Route::put('reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.delete');
    Route::get('recipes/{recipe}/download-pdf', [RecipeController::class, 'downloadPdf'])->name('recipes.downloadpdf');
    
    Route::resource('users',UserController::class);
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::put('/users/{user}/make-admin', [UserController::class, 'makeAdmin'])->name('users.makeAdmin');
    Route::put('/users/{user}/remove-admin', [UserController::class, 'removeAdmin'])->name('users.removeAdmin');
    Route::resource('categories', CategoryController::class);

    Route::put('/recipes/{recipe}/publish', [RecipeController::class, 'isPublish']);

    Route::get('/recipes/create', [RecipeController::class,'create'])->name('recipes.create');
    Route::get('/recipes/{recipe}/edit', [RecipeController::class,'edit'])->name('recipes.edit');
    Route::put('/recipes/{recipe}/update', [RecipeController::class, 'update'])->name('recipes.update');
   
    Route::get('/recipes', [RecipeController::class, 'getMyRecipe'])->name('recipes.getMyRecipe');

   
   
});













require __DIR__.'/auth.php';


