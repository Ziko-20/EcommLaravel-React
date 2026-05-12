import axios from "axios";

const API_URL="http://localhost:8000/api";


//recup des produits
export const getProduits=async()=>{
    const response=await axios.get('http://localhost:8000/api/produits');
    return response;

};

//recup des produits par ID
export const getProduitById=async(id)=>{
    const response = await axios.get(`http://localhost:8000/api/produits/${id}`);
    return response;

};


//reuperation par cetegorie

export const getCategories=async()=>{                                                                                                                               

    const response = await axios.get('http://localhost:8000/api/categories');
    return response;

};
/* filtration et recherche */

export const getProduitsFilter = async (nom, prix, categorie,page = 1) => {
  const response = await axios.get('http://localhost:8000/api/produits', {
    params: {
      nom_produit: nom,
      prix: prix,
      categorie: categorie,
      page:page
    }
  });
  return response;
};

const token = () => localStorage.getItem('token');
const headers = () => ({ Authorization: 'Bearer ' + token() });

//cration commande
export const creerCommande = async () => {
  const response = await axios.post(`${API_URL}/commandes`, {
    date_commande: new Date().toISOString().split('T')[0],
    total: 0,
    statut: 'en_attente'
  }, { headers: headers() });
  return response;
};

// Récupérer les commandes de l'utilisateur
export const getCommandes = async () => {
  const response = await axios.get(`${API_URL}/commandes`, { headers: headers() });
  return response;
};

// Ajouter une ligne au panier
export const ajouterLigne = async (commandeId, produitId, quantite) => {
  const response = await axios.post(
    `${API_URL}/commandes/${commandeId}/lignes`,
    { produit_id: produitId, quantite },
    { headers: headers() }
  );
  return response;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//ajouter unn produit
export const adminCreateProduit=async(produitData)=>{
    const token=localStorage.getItem('token');
    const response=await axios.post("http://localhost:8000/api/admin/produits", //ou enviyerrr
        produitData,// quoi envoyer
        {headers:{Authorization:'Bearer ' + token  }});//car la route est proteger on doit savoir qui veut faire l action

    return response;
    
}

// ─── Admin Produits ───────────────────────────────────────────────────────────
export const adminGetProduits = async () => {
  const response = await axios.get(`${API_URL}/admin/produits`, { headers: headers() });
  return response;
};

export const adminUpdateProduit = async (id, data) => {
  const response = await axios.put(`${API_URL}/admin/produits/${id}`, data, { headers: headers() });
  return response;
};

export const adminDeleteProduit = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/produits/${id}`, { headers: headers() });
  return response;
};

// ─── Admin Catégories ─────────────────────────────────────────────────────────
export const adminGetCategories = async () => {
  const response = await axios.get(`${API_URL}/admin/categories`, { headers: headers() });
  return response;
};

export const adminCreateCategorie = async (data) => {
  const response = await axios.post(`${API_URL}/admin/categories`, data, { headers: headers() });
  return response;
};

export const adminUpdateCategorie = async (id, data) => {
  const response = await axios.put(`${API_URL}/admin/categories/${id}`, data, { headers: headers() });
  return response;
};

export const adminDeleteCategorie = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/categories/${id}`, { headers: headers() });
  return response;
};

// ─── Admin Clients ────────────────────────────────────────────────────────────
export const adminGetClients = async () => {
  const response = await axios.get(`${API_URL}/admin/clients`, { headers: headers() });
  return response;
};

export const adminDeleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/clients/${id}`, { headers: headers() });
  return response;
};

// ─── Admin Commandes ──────────────────────────────────────────────────────────
export const adminGetCommandes = async () => {
  const response = await axios.get(`${API_URL}/admin/commandes`, { headers: headers() });
  return response;
};

export const adminUpdateStatutCommande = async (id, statut) => {
  const response = await axios.put(`${API_URL}/admin/commandes/${id}`, { statut }, { headers: headers() });
  return response;
};

// ─── Admin Stats ──────────────────────────────────────────────────────────────
export const adminGetStats = async () => {
  const response = await axios.get(`${API_URL}/admin/stats`, { headers: headers() });
  return response;
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const getWishlist = async () => {
  const response = await axios.get(`${API_URL}/wishlist`, { headers: headers() });
  return response;
};

export const ajouterWishlist = async (produitId) => {
  const response = await axios.post(`${API_URL}/wishlist`, { produit_id: produitId }, { headers: headers() });
  return response;
};

export const supprimerWishlist = async (id) => {
  const response = await axios.delete(`${API_URL}/wishlist/${id}`, { headers: headers() });
  return response;
};

// ─── Commandes client ─────────────────────────────────────────────────────────
export const getCommandeById = async (id) => {
  const response = await axios.get(`${API_URL}/commandes/${id}`, { headers: headers() });
  return response;
};

export const supprimerLigne = async (commandeId, ligneId) => {
  const response = await axios.delete(`${API_URL}/commandes/${commandeId}/lignes/${ligneId}`, { headers: headers() });
  return response;
};

export const modifierLigne = async (commandeId, ligneId, quantite) => {
  const response = await axios.put(
    `${API_URL}/commandes/${commandeId}/lignes/${ligneId}`,
    { quantite },
    { headers: headers() }
  );
  return response;
};
