<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Categorie;
use App\Models\LigneCommande;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Produit extends Model
{
     use HasFactory;
    protected $fillable=["nom_prduit","description_prduit","prix","stock_produit","image","categorie_id"];

    public function categorie() {
    return $this->belongsTo(Categorie::class);
}

    public function ligne_commande(){
        return $this->hasMany(LigneCommande::class);
    }
    public function wishlists() {
    return $this->hasMany(Wishlist::class);
}

   

}
