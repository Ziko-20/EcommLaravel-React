<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()) {
            return response()->json([
                'succes'  => false,
                'message' => 'Vous devez être connecté',
            ], 401);
        }

        $commandes = Commande::with(['ligne_commande.produit'])
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'succes' => true,
            'data'   => $commandes,
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date_commande' => 'required|date',
            'total'         => 'required|numeric',
            'statut'        => 'required|in:en_attente,expediee,livree',
        ]);

        $commande = Commande::create([
            'user_id'       => $request->user()->id,
            'date_commande' => now(),
            'total'         => $request->total,
            'statut'        => $request->statut,
        ]);

        return response()->json([
            'succes'  => true,
            'message' => 'Commande ajoutée avec succès',
            'data'    => $commande,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $commande = Commande::with(['ligne_commande.produit'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$commande) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $commande,
        ], 200);
    }

    /**
     * Valider une commande (passer de en_attente à expediee).
     * Règle métier : la commande doit contenir au moins un produit.
     */
    public function valider(Request $request, $id)
    {
        $commande = Commande::with('ligne_commande')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$commande) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable',
            ], 404);
        }

        if ($commande->statut !== 'en_attente') {
            return response()->json([
                'success' => false,
                'message' => 'Cette commande ne peut plus être modifiée',
            ], 422);
        }

        // ── Validation : au moins un produit ──────────────────────────────
        if ($commande->ligne_commande->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de valider une commande vide. Ajoutez au moins un produit.',
            ], 422);
        }

        $commande->update(['statut' => 'expediee']);

        return response()->json([
            'success' => true,
            'message' => 'Commande validée avec succès',
            'data'    => $commande->fresh(['ligne_commande.produit']),
        ], 200);
    }
}
