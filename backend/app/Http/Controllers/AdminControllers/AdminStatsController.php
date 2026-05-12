<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index()
    {
        $chiffreAffaires = Commande::sum('total');

        $topProduits = LigneCommande::selectRaw('produit_id, SUM(quantite) as total_vendu')
            ->groupBy('produit_id')
            ->orderByDesc('total_vendu')
            ->with('produit')
            ->limit(5)
            ->get();

        $stocks = Produit::select('id', 'nom_prduit', 'stock_produit')
            ->orderBy('stock_produit')
            ->get();

        // Revenus par mois sur les 12 derniers mois
        $revenuesMensuels = Commande::selectRaw(
                'DATE_FORMAT(date_commande, "%Y-%m") as mois, SUM(total) as total'
            )
            ->where('date_commande', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('mois')
            ->orderBy('mois')
            ->get()
            ->map(function ($row) {
                $moisLabels = [
                    '01' => 'Jan', '02' => 'Fév', '03' => 'Mar',
                    '04' => 'Avr', '05' => 'Mai', '06' => 'Jun',
                    '07' => 'Jul', '08' => 'Aoû', '09' => 'Sep',
                    '10' => 'Oct', '11' => 'Nov', '12' => 'Déc',
                ];
                $parts = explode('-', $row->mois);
                $label = ($moisLabels[$parts[1]] ?? $parts[1]) . ' ' . $parts[0];
                return [
                    'mois'  => $label,
                    'total' => (float) $row->total,
                ];
            });

        // Totaux rapides
        $totalCommandes = Commande::count();
        $totalClients   = User::where('role', 'client')->count();
        $totalProduits  = Produit::count();

        return response()->json([
            'chiffre_affaires'   => $chiffreAffaires,
            'top_produits'       => $topProduits,
            'stocks'             => $stocks,
            'revenues_mensuels'  => $revenuesMensuels,
            'total_commandes'    => $totalCommandes,
            'total_clients'      => $totalClients,
            'total_produits'     => $totalProduits,
        ]);
    }
}
