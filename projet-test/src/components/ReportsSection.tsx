import { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval,
  format
} from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calendar, TrendingUp, Package, Users } from "lucide-react";
import URL_SERVER from "@/appApi";

interface Sale {
  id: string;
  category: string;
  quantity: number;
  totalPrice: number;
  saleDate: string;
}

type FilterType = "week" | "month" | "all";

interface CategoryStats {
  quantity: number;
  revenue: number;
}

interface VenteData {
  nom_categorie: string;
  total_quantite: number;
  total_montant: number;
  total_ventes: number;
  nombre_vendeurs: number;
}

export const ReportsSection = () => {
  const [filter, setFilter] = useState<FilterType>("month");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    byCategory: Record<string, CategoryStats>;
    totalQuantity: number;
    totalRevenue: number;
    totalVentes: number;
    nombreVendeurs: number;
  }>({
    byCategory: {},
    totalQuantity: 0,
    totalRevenue: 0,
    totalVentes: 0,
    nombreVendeurs: 0,
  });

  const fetchVentes = useCallback(async (periode: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL_SERVER}/ventes/totaux`, {
        params: { 
          periode: periode === 'week' ? 'semaine' : periode === 'month' ? 'mois' : '' 
        }
      });

      if (response.data.success) {
        const data: VenteData[] = response.data.data;
        const byCategory: Record<string, CategoryStats> = {};
        
        let totalQuantity = 0;
        let totalRevenue = 0;
        let totalVentes = 0;
        let nombreVendeurs = 0;

        data.forEach((item) => {
          byCategory[item.nom_categorie.toLowerCase()] = {
            quantity: item.total_quantite || 0,
            revenue: item.total_montant || 0
          };
          totalQuantity += item.total_quantite || 0;
          totalRevenue += item.total_montant || 0;
          totalVentes += item.total_ventes || 0;
          nombreVendeurs = Math.max(nombreVendeurs, item.nombre_vendeurs || 0);
        });

        setStats({
          byCategory,
          totalQuantity,
          totalRevenue,
          totalVentes,
          nombreVendeurs
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVentes(filter);
  }, [filter, fetchVentes]);

  const chartData = useMemo(() => {
    return Object.entries(stats.byCategory).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      quantité: data.quantity,
      revenus: data.revenue / 1000, // en milliers
    }));
  }, [stats.byCategory]);

  const filterLabels: Record<FilterType, string> = {
    week: "Cette semaine",
    month: "Ce mois",
    all: "Tout",
  };

  const categoryLabels: Record<string, string> = {
    vache: "Vaches",
    mouton: "Moutons",
    chevre: "Chèvres",
  };

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex gap-2">
        {(["week", "month", "all"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              filter === f
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="gradient-card rounded-xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total vendu</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {loading ? '...' : stats.totalQuantity} animaux
          </p>
        </div>

        <div className="gradient-card rounded-xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/20">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Revenus totaux</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {loading ? '...' : stats.totalRevenue.toLocaleString()} FCFA
          </p>
        </div>

        <div className="gradient-card rounded-xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/20">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Période</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {filterLabels[filter]}
          </p>
        </div>

        <div className="gradient-card rounded-xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-muted-foreground">Vendeurs actifs</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {loading ? '...' : stats.nombreVendeurs}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">Ventes par catégorie</h3>
        
        {Object.keys(stats.byCategory).length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
                formatter={(value: number, name: string) => [
                  name === "revenus" ? `${(value * 1000).toLocaleString()} FCFA` : value,
                  name === "revenus" ? "Revenus" : "Quantité"
                ]}
              />
              <Legend />
              <Bar 
                dataKey="quantité" 
                name="Quantité" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="revenus" 
                name="Revenus (en milliers)" 
                fill="hsl(var(--secondary))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {loading ? 'Chargement...' : 'Aucune donnée pour cette période'}
          </div>
        )}
      </div>

      {/* Detailed breakdown table */}
      <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">Détails par catégorie</h3>
        <div className="space-y-3">
          {Object.entries(stats.byCategory).map(([category, data]) => (
            <div 
              key={category}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {category === "vache" ? "🐄" : category === "mouton" ? "🐑" : "🐐"}
                </span>
                <span className="font-medium">{categoryLabels[category] || category}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{data.quantity} vendus</p>
                <p className="text-sm text-muted-foreground">
                  {data.revenue.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}
          
          {Object.keys(stats.byCategory).length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              {loading ? 'Chargement...' : 'Aucune vente pour cette période'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};