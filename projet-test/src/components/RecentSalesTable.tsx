import { VenteAnimal } from "@/types/farm";

interface RecentSalesTableProps {
  ventes: VenteAnimal[];
}

export const RecentSalesTable = ({ ventes = [] }: RecentSalesTableProps) => {
  if (!ventes || ventes.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-4">
        Aucune vente récente
      </div>
    );
  }

  // Trier par date la plus récente et limiter à 5 entrées
  const recentSales = [...ventes]
    .sort((a, b) => new Date(b.date_enregistrement).getTime() - new Date(a.date_enregistrement).getTime())
    .slice(0, 5);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-4">Code Animal</th>
            <th className="text-left py-2 px-4">Type</th>
            <th className="text-left py-2 px-4">Date de vente</th>
          </tr>
        </thead>
        <tbody>
          {recentSales.map((vente) => {
            // Vérifier que vente et code_animal existent avant d'utiliser split
            const type = vente?.code_animal?.split('-')[0] || 'INCONNU';
            const typeLabel = {
              VCH: 'Vache',
              MOU: 'Mouton',
              CHV: 'Chèvre',
              INCONNU: 'Inconnu'
            }[type] || type;

            return (
              <tr key={vente.id_animal} className="border-b border-border/20 hover:bg-muted/10">
                <td className="py-2 px-4">{vente.code_animal || 'N/A'}</td>
                <td className="py-2 px-4">{typeLabel}</td>
                <td className="py-2 px-4">
                  {vente.date_enregistrement 
                    ? new Date(vente.date_enregistrement).toLocaleDateString('fr-FR') 
                    : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};