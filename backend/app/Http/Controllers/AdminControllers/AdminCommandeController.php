<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class AdminCommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::with(['user', 'ligne_commande.produit'])->get();
        return response()->json($commandes);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,expediee,livree',
        ]);

        $commande = Commande::findOrFail($id);
        $commande->update(['statut' => $request->statut]);

        return response()->json(['message' => 'Statut mis à jour', 'commande' => $commande]);
    }
}