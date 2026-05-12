<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;

class AdminProduitController extends Controller
{
    public function index()
    {
        return response()->json(Produit::with('categorie')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_prduit'         => 'required|string',
            'description_prduit' => 'required|string',
            'prix'               => 'required|numeric|min:0',
            'stock_produit'      => 'required|integer|min:0',
            'categorie_id'       => 'required|exists:categories,id',
            'image'              => 'nullable|string',
        ]);

        $produit = Produit::create($request->all());
        return response()->json($produit, 201);
    }

    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);

        $request->validate([
            'nom_prduit'         => 'sometimes|string',
            'description_prduit' => 'sometimes|string',
            'prix'               => 'sometimes|numeric|min:0',
            'stock_produit'      => 'sometimes|integer|min:0',
            'categorie_id'       => 'sometimes|exists:categories,id',
        ]);

        $produit->update($request->all());
        return response()->json($produit);
    }

    public function destroy($id)
    {
        Produit::findOrFail($id)->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }
}