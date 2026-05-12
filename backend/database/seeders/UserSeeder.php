<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin fixe 
        User::firstOrCreate(
            ['email' => 'admin@boutique.ma'],
            [
                'name'      => 'Admin Alaoui',
                'telephone' => '0661000000',
                'adresse'   => '1 Avenue Mohammed V, Rabat',
                'password'  => Hash::make('admin123'),
                'role'      => 'admin',
            ]
        );

        
        User::factory()->count(30)->create();
    }
}