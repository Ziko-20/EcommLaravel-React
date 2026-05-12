<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LigneCommandeController extends Controller
{
    /**
     * Ajouter un article au panier.
     * Le trigger BEFORE INSERT vérifie le stock.
     * Le trigger AFTER INSERT décrémente le stock.
     */
    public function store(Request $request, $id)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite'   => 'required|integer|min:1',
        ]);

        $commande = Commande::findOrFail($id);
        $produit  = Produit::findOrFail($request->produit_id);

        // Vérification applicative (double sécurité avant le trigger DB)
        if ($produit->stock_produit < $request->quantite) {
            return response()->json(['message' => 'Stock insuffisant'], 422);
        }

        try {
            LigneCommande::create([
                'commandes_id' => $commande->id,
                'produit_id'   => $produit->id,
                'quantite'     => $request->quantite,
                'sous_total'   => $request->quantite * $produit->prix,
            ]);
            // Le trigger AFTER INSERT décrémente automatiquement le stock en DB
        } catch (\Exception $e) {
            // Le trigger BEFORE INSERT peut lever une erreur SQL 45000
            return response()->json(['message' => 'Stock insuffisant (trigger DB)'], 422);
        }

        $commande->update(['total' => $commande->ligne_commande()->sum('sous_total')]);

        return response()->json(['message' => 'Ligne ajoutée', 'commande' => $commande->fresh()], 201);
    }

    /**
     * Modifier la quantité d'un article.
     * Le trigger BEFORE UPDATE vérifie le stock disponible.
     * Le trigger AFTER UPDATE ajuste le delta automatiquement.
     */
    public function update(Request $request, $id, $ligne)
    {
        $request->validate([
            'quantite' => 'required|integer|min:1',
        ]);

        $commande      = Commande::findOrFail($id);
        $ligneCommande = LigneCommande::findOrFail($ligne);
        $produit       = Produit::findOrFail($ligneCommande->produit_id);

        // Vérification applicative : stock actuel + ancienne quantité réservée
        $stockDisponible = $produit->stock_produit + $ligneCommande->quantite;
        if ($stockDisponible < $request->quantite) {
            return response()->json(['message' => 'Stock insuffisant'], 422);
        }

        try {
            $ligneCommande->update([
                'quantite'   => $request->quantite,
                'sous_total' => $request->quantite * $produit->prix,
            ]);
            // Le trigger AFTER UPDATE ajuste automatiquement le stock en DB
        } catch (\Exception $e) {
            return response()->json(['message' => 'Stock insuffisant (trigger DB)'], 422);
        }

        $commande->update(['total' => $commande->ligne_commande()->sum('sous_total')]);

        return response()->json(['message' => 'Ligne mise à jour', 'commande' => $commande->fresh()]);
    }

    /**
     * Supprimer un article du panier.
     * Le trigger AFTER DELETE réincrémente le stock automatiquement.
     */
    public function destroy($id, $ligne)
    {
        $commande      = Commande::findOrFail($id);
        $ligneCommande = LigneCommande::findOrFail($ligne);

        $ligneCommande->delete();
        // Le trigger AFTER DELETE réincrémente automatiquement le stock en DB

        $commande->update(['total' => $commande->ligne_commande()->sum('sous_total')]);

        return response()->json(['message' => 'Ligne supprimée']);
    }
}
