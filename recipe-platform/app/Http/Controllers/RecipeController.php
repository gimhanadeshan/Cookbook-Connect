<?php
namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Category;;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;


class RecipeController extends Controller
{
    public function index():Response
    {
        if (Auth::check()) {
            // User is authenticated
            $user = Auth::user();
            $recipes = Recipe::where('user_id', $user->id)
                ->orWhere(function ($query) {
                    $query->where('published', true);
                })->orderBy('created_at', 'desc')->with('user','category','reviews')
                ->get();
        } else {
            // User is not authenticated
            $recipes = Recipe::where('published', true)->orderBy('created_at', 'desc')->with('user','category','reviews')
                ->get();
        }

        $categories = Category::all(); // Fetch categories
        
        return Inertia::render('Recipes/Home', [
            'recipes' => $recipes,
            'categories' => $categories,
            'auth' => [
                'user' => Auth::user() // Pass authenticated user data to the frontend
            ]
        ]);
    }

    
    // In RecipeController.php
    public function getMyRecipe()
    {
        $user = Auth::user();
    
        if (Auth::check()) {
            $recipes = Recipe::with('reviews')->where('user_id', $user->id)->get();
        } else {
            $recipes = Recipe::with('reviews')->where('published', true)->get();
        }
    
        $categories = Category::all();
    
        return Inertia::render('Recipes/MyRecipes', [
            'recipes' => $recipes,
            'categories' => $categories,
            'auth' => [
                'user' => $user
            ]
        ]);
    }
    

    public function manage()
    {
        $user = Auth::user();
    
        if (!$user->is_admin) {
            abort(403, 'Unauthorized action.');
        }
    
        // Eager load the user and category relationships for each recipe
        $recipes = Recipe::with('user', 'category')->get();
    
        return Inertia::render('Admin/RecipeManagement', ['recipes' => $recipes]);
    }
    
    public function create()
    {
        
        $categories = Category::all();
        return Inertia::render('Recipes/Create', ['categories' => $categories]);
       
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required|exists:categories,id',
            'published' => 'boolean',
        ]);

        $recipe = new Recipe;
        $recipe->user_id = auth()->id();
        $recipe->title = $request->title;
        $recipe->description = $request->description;
        $recipe->ingredients = $request->ingredients;
        $recipe->instructions = $request->instructions;
        $recipe->category_id = $request->category_id;
        $recipe->published = $request->has('published') ? $request->published : false;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/recipes', $imageName);
            $recipe->image = 'recipes/' . $imageName;
        }

        $recipe->save();

        return redirect()->route('recipes.show', $recipe);
        // return redirect()->back();
    }
    public function show(Recipe $recipe)
{
    // Check if the recipe is unpublished and the user is not the owner
    if (!$recipe->published) {
        $user = Auth::user();

        // Check if there is an authenticated user and if they are not the owner
        if (!$user || $user->id !== $recipe->user_id) {
            abort(403, 'Unauthorized action.');
        }
    }
    
    // Eager load the user and category relationships for the recipe
    $recipe->load('user', 'category');

    // Get the latest 5 recipes with the user relationship
    $recipes = Recipe::orderBy('created_at', 'desc')->take(5)->with('user')->get();

    // Get the reviews for the recipe with the user relationship
    $reviews = $recipe->reviews()->with('user')->get();

    return Inertia::render('Recipes/Show', [
        'recipe' => $recipe,
        'reviews' => $reviews,
        'recipes' => $recipes,
    ]);
}

    public function edit(Recipe $recipe)
    {
        $user = Auth::user();

        // Check if the authenticated user is an admin or is the recipe owner
        if (!$user->is_admin && $user->id !== $recipe->user_id) {
            abort(403, 'Unauthorized action.');
        }
       
        $categories = Category::all();
        return Inertia::render('Recipes/Edit', ['recipe' => $recipe, 'categories' => $categories]);
     
    }

    public function update(Request $request, Recipe $recipe)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required|exists:categories,id',
            'published' => 'boolean',
        ]);
    
        $recipe->title = $request->title;
        $recipe->description = $request->description;
        $recipe->ingredients = $request->ingredients;
        $recipe->instructions = $request->instructions;
        $recipe->category_id = $request->category_id;
        $recipe->published = $request->has('published') ? $request->published : false;
    
        if ($request->hasFile('image')) {
            if ($recipe->image) {
                Storage::delete('public/' . $recipe->image);
            }
    
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/recipes', $imageName);
            $recipe->image = 'recipes/' . $imageName;
        }
    
        $recipe->save();
    
        return redirect()->route('recipes.show', $recipe);
    }
    

    public function destroy(Recipe $recipe)
    {
        if ($recipe->image) {
            Storage::delete('public/' . $recipe->image);
        }

        $recipe->delete();
        return redirect()->route('recipes.index');
    }

    public function downloadPdf(Recipe $recipe)
    {
        $logoPath = public_path('storage/logo.png');
        $logoData = base64_encode(file_get_contents($logoPath));
        $logoBase64 = 'data:image/png;base64,' . $logoData;
    
        $imagePath = public_path('storage/' . $recipe->image);
        $imageData = base64_encode(file_get_contents($imagePath));
        $imageBase64 = 'data:image/png;base64,' . $imageData;
    
        $currentDateTime = date('Y-m-d H:i:s');
    
        $html = '<html><head><style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .container { width: 100%; padding: 20px; box-sizing: border-box; }
            .header, .footer { text-align: center; padding: 10px 0; }
            .header { border-bottom: 2px solid #eee; margin-bottom: 20px; }
            .footer { border-top: 2px solid #eee; margin-top: 20px; font-size: 12px; color: #777; }
            .header img { width: 100px; height: auto; }
            h1 { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 10px; }
            h2 { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
            p { margin-bottom: 10px; }
            ul, ol { margin-bottom: 15px; margin-left: 20px; }
            img.recipe-img { width: 100%; height: auto; max-width: 400px; }
            .center-image { text-align: center; margin: 20px 0; }
            .content { margin-bottom: 20px; }
            .ingredients, .instructions { margin-bottom: 20px; }
            .ingredients ul, .instructions ol { list-style-position: inside; }
            .ingredients li, .instructions li { margin-bottom: 5px; }
            .page-break { page-break-after: always; }
            </style></head><body>';
    
        // Header
        $html .= '<div class="header">';
        $html .= '<img src="' . $logoBase64 . '" alt="CookBook Connect Logo" />';
        $html .= '<h1>CookBook Connect</h1>';
        $html .= '</div>';
    
        // Content
        $html .= '<div class="container">';
        $html .= '<h1>' . $recipe->title . '</h1>';
    
        if ($recipe->image) {
            $html .= '<div class="center-image">';
            $html .= '<img src="' . $imageBase64 . '" alt="' . $recipe->title . '" class="recipe-img" />';
            $html .= '</div>';
        }
    
        $html .= '<div class="content">';
        $html .= '<p><strong>Description:</strong> ' . $recipe->description . '</p>';
        $html .= '<p><strong>Category:</strong> ' . $recipe->category->name . '</p>';
        $html .= '<p><strong>Created By:</strong> ' . $recipe->user->name . '</p>';
        $html .= '</div>';
    
        $html .= '<div class="ingredients">';
        $html .= '<h2>Ingredients</h2><ul>';
        foreach (explode("\n", $recipe->ingredients) as $ingredient) {
            $html .= '<li>' . $ingredient . '</li>';
        }
        $html .= '</ul></div>';
    
        $html .= '<div class="instructions">';
        $html .= '<h2>Instructions</h2><ol>';
        foreach (explode("\n", $recipe->instructions) as $instruction) {
            $html .= '<li>' . $instruction . '</li>';
        }
        $html .= '</ol></div>';
        $html .= '</div>'; // End container
    
        // Footer
        $html .= '<div class="footer">';
        $html .= '<p>&copy; ' . date('Y') . ' CookBook Connect. All rights reserved.</p>';
        $html .= '<p>Printed on: ' . $currentDateTime . '</p>';
        $html .= '</div>';
    
        $html .= '</body></html>';
    
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
    
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
    
        return $dompdf->stream($recipe->title . '.pdf');
    }
    


    public function isPublish(Recipe $recipe)
    {
     
        $recipe->published = true;
        $recipe->save();

        return redirect()->back();
    }


    public function recipesByCategory(Category $category)
    {
        $recipes = Recipe::where('category_id', $category->id)
            ->where(function ($query) {
                $query->where('published', true)
                      ->orWhere('user_id', Auth::id());
            })
            ->orderBy('created_at', 'desc')->with('user')
            ->get();

        return Inertia::render('Recipes/RecipesByCategory', [
            'recipes' => $recipes,
            'category' => $category,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    
}
