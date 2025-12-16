import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import axios from 'axios';
import URL_SERVER from '@/appApi';

interface Vente {
  code_vente: string;
  nom_categorie: string;
  quantite: number;
  prix_unitaire: number;
  montant_total: number;
  date_vente: string;
  nom_vendeur: string;
  prenom_vendeur: string;
}

interface SalesTableProps {
  onDelete: () => void; // Callback pour rafraîchir les données
}

const categoryEmoji: Record<string, string> = {
  'Vache': "🐄",
  'Mouton': "🐑",
  'Chèvre': "🐐",
};

export const SalesTable = ({ onDelete }: SalesTableProps) => {
  const [sales, setSales] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const response = await axios.get(`${URL_SERVER}/nouvelles_vente/liste`);
        if (response.data.success) {
          setSales(response.data.animaux);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des ventes:', err);
        setError('Erreur lors du chargement des ventes');
      } finally {
        setLoading(false);
      }
    };

    fetchVentes();
  }, []);

  const handleDelete = async (codeVente: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      return;
    }

    try {
      await axios.delete(`${URL_SERVER}/vente/${codeVente}`);
      // Rafraîchir les données après suppression réussie
      const response = await axios.get(`${URL_SERVER}/nouvelles_vente/liste`);
      if (response.data.success) {
        setSales(response.data.animaux);
      }
      // Appeler la fonction onDelete pour informer le composant parent
      onDelete();
    } catch (err) {
      console.error('Erreur lors de la suppression de la vente:', err);
      alert('Erreur lors de la suppression de la vente');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement des ventes...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">{error}</div>;
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Aucune vente enregistrée</p>
        <p className="text-sm">Les ventes apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Date
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Catégorie
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Quantité
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Vendeur
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Total
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr 
              key={sale.code_vente} 
              className={cn(
                "border-b border-border/50 hover:bg-muted/50 transition-colors",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="py-4 px-4 text-sm text-foreground">
                {format(new Date(sale.date_vente), "dd MMM yyyy", { locale: fr })}
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center gap-2 text-sm">
                  <span>{categoryEmoji[sale.nom_categorie] || '📝'}</span>
                  <span>{sale.nom_categorie}</span>
                </span>
              </td>
              <td className="py-4 px-4 text-sm font-medium text-foreground">
                {sale.quantite}
              </td>
              <td className="py-4 px-4 text-sm text-foreground">
                {sale.prenom_vendeur} {sale.nom_vendeur}
              </td>
              <td className="py-4 px-4 text-sm font-semibold text-right text-primary">
                {sale.montant_total.toLocaleString()} FCFA
              </td>
              <td className="py-4 px-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(sale.code_vente)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};