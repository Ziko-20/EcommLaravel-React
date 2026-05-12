<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminClientController extends Controller
{
    public function index()
    {
        $clients = User::where('role', 'client')->get();
        return response()->json($clients);
    }

    public function show($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);
        return response()->json($client);
    }

    public function update(Request $request, $id)
    {
        $client = User::where('role', 'client')->findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:users,email,' . $id,
            'telephone' => 'sometimes|string|unique:users,telephone,' . $id,
            'adresse'   => 'sometimes|string',
        ]);

        $client->update($request->only('name', 'email', 'telephone', 'adresse'));

        return response()->json([
            'message' => 'Client mis à jour',
            'client'  => $client->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);
        $client->delete();
        return response()->json(['message' => 'Client supprimé']);
    }
}
