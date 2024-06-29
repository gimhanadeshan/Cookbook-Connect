<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {    

        $user = Auth::user();

       
        if (!$user->is_admin) {
            abort(403, 'Unauthorized action.');
        }
        // Fetch all users
        $users = User::all();
    
        return Inertia::render('Admin/UserManagement', [
            'users' => $users
        ]);
    }

    public function destroy(User $user)
    {
        // Delete user
        $user->delete();

        return redirect()->back();
    }

    public function makeAdmin(User $user)
    {
        // Make user an admin
        $user->is_admin = true;
        $user->save();

        return redirect()->back();
    }

    public function removeAdmin(User $user)
    {
        // Remove admin status
        $user->is_admin = false;
        $user->save();

        return redirect()->route('recipes.index');
    }
}
