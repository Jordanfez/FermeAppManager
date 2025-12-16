import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AnimalCategory, Sale } from "@/types/farm";
import { cn } from "@/lib/utils";
import { CalendarDays, User, Hash, DollarSign, Plus } from "lucide-react";
import axios from 'axios';
import URL_SERVER from '@/appApi';

interface Vendeur {
  id_vendeur: number;
  nom: string;
  prenom: string;
  telephone: string;
}

interface SaleFormProps {
  onAddSale: () => void; // Modifié car on gère l'envoi dans le composant
}

const categories = [
  { value: "vache", label: "Vache", emoji: "🐄", id: 1 },
  { value: "mouton", label: "Mouton", emoji: "🐑", id: 2 },
  { value: "chevre", label: "Chèvre", emoji: "🐐", id: 3 },
] as const;

export const SaleForm = ({ onAddSale }: SaleFormProps) => {
  const [category, setCategory] = useState<AnimalCategory>("vache");
  const [quantity, setQuantity] = useState("");
  const [vendeurId, setVendeurId] = useState<string>("");
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([]);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchVendeurs = async () => {
      try {
        const response = await axios.get(`${URL_SERVER}/vendeur`);
        if (response.data.success) {
          setVendeurs(response.data.animaux);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des vendeurs:', error);
        setMessage({ type: 'error', text: 'Erreur lors du chargement des vendeurs' });
      }
    };
    fetchVendeurs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !vendeurId || !pricePerUnit) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      const selectedCategory = categories.find(cat => cat.value === category);
      
      const venteData = {
        id_categorie: selectedCategory?.id,
        quantite: parseInt(quantity),
        prix_unitaire: parseFloat(pricePerUnit),
        date_vente: saleDate,
        id_vendeur: parseInt(vendeurId)
      };

      const response = await axios.post(`${URL_SERVER}/insert/vente`, venteData);
      
      if (response.data) {
        setMessage({ type: 'success', text: 'Vente enregistrée avec succès !' });
        // Réinitialiser le formulaire
        setQuantity("");
        setPricePerUnit("");
        setVendeurId("");
        // Appeler la fonction parent pour rafraîchir les données
        onAddSale();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vente:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement de la vente' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div 
          className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Catégorie d'animal
        </label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                category === cat.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-card"
              )}
            >
              <span className="text-2xl block mb-1">{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Hash className="w-4 h-4" /> Quantité
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Nombre d'animaux"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Prix unitaire (FCFA)
          </label>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            placeholder="Prix par animal"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="w-4 h-4" /> Vendeur
          </label>
          <select
            value={vendeurId}
            onChange={(e) => setVendeurId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="">Sélectionner un vendeur</option>
            {vendeurs.map((vendeur) => (
              <option key={vendeur.id_vendeur} value={vendeur.id_vendeur}>
                {vendeur.prenom} {vendeur.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Date de vente
          </label>
          <input
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? (
          "Enregistrement en cours..."
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Enregistrer la vente
          </>
        )}
      </Button>
    </form>
  );
};