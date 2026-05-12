<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\LigneCommande;

class Commande extends Model
{

use HasFactory;

    protected $fillable=["user_id","date_commande","total","statut"];

    public function user() {
    return $this->belongsTo(User::class);
}

    public function ligne_commande() {
    return $this->hasMany(LigneCommande::class, 'commandes_id');
}
}
