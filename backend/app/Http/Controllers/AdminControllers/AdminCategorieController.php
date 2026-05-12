<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;

class AdminCategorieController extends Controller
{
    public function index()
    {
        return response()->json(Categorie::all());
    }

    public function store(Request $request)
    {
        $request->validate(['categorie' => 'required|string|max:255']);
        $categorie = Categorie::create($request->all());
        return response()->json($categorie, 201);
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);
        $request->validate(['categorie' => 'sometimes|string|max:255']);
        $categorie->update($request->all());
        return response()->json($categorie);
    }

    public function destroy($id)
    {
        Categorie::findOrFail($id)->delete();
        return response()->json(['message' => 'Catégorie supprimée']);
    }
}