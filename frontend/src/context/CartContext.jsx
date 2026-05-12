import { createContext, useContext, useState, useEffect } from 'react';
import { getCommandes, creerCommande } from '../services/productService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [commandeId, setCommandeId] = useState(null);

  // Au chargement : chercher un panier en_attente existant
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getCommandes().then((res) => {
      const enAttente = res.data.data.find(c => c.statut === 'en_attente');
      if (enAttente) {
        setCommandeId(enAttente.id);
      }
    }).catch(() => {});
  }, []);

  const getPanierID = async () => {
    // Si on a un ID en mémoire, vérifier qu'il est toujours en_attente
    if (commandeId) {
      try {
        const res = await getCommandes();
        const enAttente = res.data.data.find(c => c.statut === 'en_attente');
        if (enAttente && enAttente.id === commandeId) return commandeId;
        // L'ancienne commande n'est plus en_attente, on en crée une nouvelle
        setCommandeId(null);
      } catch (_) {}
    }

    const res = await creerCommande();
    const id = res.data.data.id;
    setCommandeId(id);
    return id;
  };

  return (
    <CartContext.Provider value={{ commandeId, setCommandeId, getPanierID }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);