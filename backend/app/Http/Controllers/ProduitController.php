<?php

namespace App\Http\Controllers;
 

use Illuminate\Http\Request;

use App\Models\Produit;
use App\Models\Categorie;
class ProduitController extends Controller
{
    public function index(Request $request){
        /* $produits=Produit::all();
        return view(index,compact("data")); */
        $query=Produit::query();
        /* filotration */


/* recherche de produit par nom */
        if($request->filled('nom_produit')){
            $query->where('nom_prduit', 'like', '%'.$request->nom_produit.'%');
        }


/* filtretion par prix inferieur ou egal au prix donnee par l utilisateur */
        if($request->filled('prix')){
            $query->where('prix', '<=', $request->prix);
        }

/* Filtration par categorie */        

        if($request->filled('categorie')){
            $query->where('categorie_id', '=', $request->categorie);    
        }

        /* Filtre disponibilité : en_stock = uniquement les produits avec stock > 0 */
        if($request->filled('disponibilite') && $request->disponibilite === 'en_stock'){
            $query->where('stock_produit', '>', 0);
        }

        $produits=$query->paginate(12);
        return response()->json([
            "success"=>true,
            "data"=>$produits
        ],200);

    }

    public function show($id){

       $produit=Produit::findOrFail($id);
        return response()->json([
            "success"=>true,
            "data"=>$produit
        ],200);
    }

}
