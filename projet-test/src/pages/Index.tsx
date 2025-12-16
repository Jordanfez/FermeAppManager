import { StatCard } from "@/components/StatCard";
import { AnimalCard } from "@/components/AnimalCard";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface CheptelResume {
  categorie: string;
  total: number;
  disponible: number;
  vendu: number;
}
import { SalesChart } from "@/components/SalesChart";
import { SaleForm } from "@/components/SaleForm";
import { SalesTable } from "@/components/SalesTable";
import { RecentSalesTable } from "@/components/RecentSalesTable";
import { ReportsSection } from "@/components/ReportsSection";
import axios from 'axios';
import URL_SERVER from '@/appApi';
import React, { useState, useEffect } from "react";
import { AnimalCategory, Sale, VenteAnimal } from "@/types/farm";

import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  FileText,
  Beef,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "dashboard" | "récensement" | "ventes" | "rapports";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  
  // Animal counts
  const [animalCounts, setAnimalCounts] = useState<Record<AnimalCategory, number>>({
    vache: 45,
    mouton: 120,
    chevre: 78,
  });

  // Sales data
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      category: "vache",
      quantity: 5,
      sellerName: "Amadou Diallo",
      saleDate: new Date("2024-12-10"),
      pricePerUnit: 350000,
      totalPrice: 1750000,
    },
    {
      id: "2",
      category: "mouton",
      quantity: 15,
      sellerName: "Fatou Sow",
      saleDate: new Date("2024-12-12"),
      pricePerUnit: 85000,
      totalPrice: 1275000,
    },
    {
      id: "3",
      category: "chevre",
      quantity: 8,
      sellerName: "Ibrahima Ba",
      saleDate: new Date("2024-12-14"),
      pricePerUnit: 65000,
      totalPrice: 520000,
    },
  ]);

  const handleUpdateCount = (category: AnimalCategory, newCount: number) => {
    setAnimalCounts(prev => ({ ...prev, [category]: newCount }));
  };

// la fonction handleAddSale pour les nouvelle vente :
  const handleAddSale = async () => {
    try {
      // Recharge des données des ventes
      const response = await axios.get(`${URL_SERVER}/animaux/vendu/pourcentage`);
      if (response.data.success) {
        setVentes(response.data.animaux);
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des ventes:', error);
    }
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  //const total Animal disponible
  const [totalAnimals, setTotalAnimals] = React.useState(0);
  
  useEffect(() => {
  const fetchTotalAnimals = async () => {
    try {
      console.log('URL appelée :', `${URL_SERVER}/animaux/disponibles`);
      const response = await axios.get(`${URL_SERVER}/animaux/disponibles`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Réponse API :', response.data);
      setTotalAnimals(response.data.nombre_animaux_disponibles);
    } catch (error) {
      console.error('Erreur lors de la récupération des animaux :', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };
  
  fetchTotalAnimals();
}, []);


  //const total Animal disponible
  const [totalAnimalsvendu, setTotalAnimalsvendu] = React.useState(0);
  
  useEffect(() => {
  const fetchTotalAnimalsvendu = async () => {
    try {
      console.log('URL appelée :', `${URL_SERVER}/animaux/vendu`);
const response = await axios.get(`${URL_SERVER}/animaux/vendu`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Réponse API :', response.data);
      setTotalAnimalsvendu(response.data.nombre_animaux_disponibles);
    } catch (error) {
      console.error('Erreur lors de la récupération des animaux vendus:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };
  
  fetchTotalAnimalsvendu();
}, []);


  // État pour le nombre total de vendeurs
  const [totalvendeur, setTotalVendeur] = React.useState(0);
  
  useEffect(() => {
    const fetchTotalVendeurs = async () => {
      try {
        console.log('URL appelée :', `${URL_SERVER}/Vendeurs/disponibles`);
        const response = await axios.get(`${URL_SERVER}/Vendeurs/disponibles`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('Réponse API Vendeurs :', response.data);
        if (response.data.success) {
          setTotalVendeur(response.data.total_vendeurs || 0);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des vendeurs :', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    };
    
    fetchTotalVendeurs();
  }, []);

  // État pour le total des ventes (peut être un nombre ou une chaîne formatée)
  const [totalventetotal, setTotalVentetotal] = React.useState<number | string>(0);
  
  useEffect(() => {
    const fetchTotalVente = async () => {
      try {
        console.log('URL appelée :', `${URL_SERVER}/vente/total`);
        const response = await axios.get(`${URL_SERVER}/vente/total`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Réponse API Ventes :', response.data);
        
        if (response.data.success) {
          // Formater le montant avec 2 décimales et le convertir en nombre
          const montant = parseFloat(response.data.total_ventes);
          setTotalVentetotal(Number(montant.toFixed(2)));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du total des ventes:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    };
    
    fetchTotalVente();
  }, []);


  // liste des animaux
  const [animaux, setAnimaux] = useState<Array<{
    id: number;
    code_animal: string;
    quantite: number;
    // autres champs selon votre API
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Effet pour charger les données
  useEffect(() => {
    const fetchAnimaux = async () => {
      try {
        const response = await axios.get(`${URL_SERVER}/animaux`);
        if (response.data.success) {
          setAnimaux(response.data.animaux);
        } else {
          setError("Erreur lors du chargement des animaux");
        }
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Impossible de charger les données des animaux");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimaux();
  }, []);
    // Calculer le total des animaux
  // Grouper les animaux par préfixe de code_animal
  const animauxParType = animaux.reduce<Record<string, number>>((acc, animal) => {
    // Extraire le préfixe (VCH, MOU, CHV)
    const prefix = animal.code_animal.split('-')[0];
    const quantite = animal.quantite || 1;
    acc[prefix] = (acc[prefix] || 0) + quantite;
    return acc;
  }, {});

// Calculer le total des animaux
const totalAnimaux = Object.values(animauxParType).reduce((sum, count) => sum + count, 0);

// Configuration des types d'animaux
const typeConfig = {
  'VCH': { emoji: '🐄', label: 'Vaches', color: 'bg-cow' },
  'MOU': { emoji: '🐑', label: 'Moutons', color: 'bg-sheep' },
  'CHV': { emoji: '🐐', label: 'Chèvres', color: 'bg-goat' }
} as const;
  const totalSales = sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);



// graphique des ventes
const [ventes, setVentes] = useState<VenteAnimal[]>([]);
useEffect(() => {
  const fetchVentes = async () => {
    try {
      const response = await axios.get(`${URL_SERVER}/animaux/vendu/pourcentage`);
      if (response.data.success) {
        setVentes(response.data.animaux);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
    }
  };
  fetchVentes();
}, []);

  const handleRefreshVentes = async () => {
    try {
      const response = await axios.get(`${URL_SERVER}/nouvelles_vente/liste`);
      if (response.data.success) {
        setVentes(response.data.animaux);
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des ventes:', error);
    }
  };

//const [activeTab, setActiveTab] = useState('enregistrement');
  const [resumeCheptel, setResumeCheptel] = useState<CheptelResume[]>([]);
  //const [loading, setLoading] = useState(true);
  const fetchResumeCheptel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL_SERVER}/api/cheptel/resume`);
      if (response.data.success) {
        setResumeCheptel(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du résumé:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === 'resume') {
      fetchResumeCheptel();
    }
  }, [activeTab]);

  const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "recensement", label: "Recensement", icon: ClipboardList },
    { id: "ventes", label: "Ventes", icon: BarChart3 },
    { id: "rapports", label: "Rapports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground py-6 px-6 shadow-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-xl">
              <Beef className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">FermeManager</h1>
              <p className="text-primary-foreground/80 text-sm">
                Gestion du cheptel et des ventes
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-10 shadow-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Animaux"
                value={totalAnimals}
                icon={Beef}
              />
              <StatCard
                title="Animaux Vendus"
                value={totalAnimalsvendu}
                icon={TrendingUp}
                iconClassName="bg-secondary/20 text-secondary"
              />
              <StatCard
                title="Vendeurs Actifs"
                value={totalvendeur}
                icon={Users}
                iconClassName="bg-accent/20 text-accent"
              />
              <StatCard
                title="Revenus Totaux"
                value={`${totalventetotal} FCFA`}
                icon={DollarSign}
                iconClassName="bg-cow/20 text-cow"
              />
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
                <h2 className="font-display font-semibold text-lg mb-4">
                  Répartition des ventes
                </h2>
                <SalesChart sales={sales} />
                {/* Par type d'animal */ }
                <SalesChart ventes={ventes} />
              </div>

              <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
                <h2 className="font-display font-semibold text-lg mb-4">
                  Animaux actuels
                </h2>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">Chargement des animaux...</div>
                  ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                  ) : Object.keys(animauxParType).length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Aucun animal disponible pour le moment
                    </p>
                  ) : (
                    Object.entries(animauxParType).map(([code, count]) => {
                      // Extraire le préfixe (VCH, MOU, CHV) du code complet
                      const prefix = code.split('-')[0];
                      const config = typeConfig[prefix as keyof typeof typeConfig] || { 
                        emoji: '❓', 
                        label: code, 
                        color: 'bg-gray-400' 
                      };
                      const percentage = totalAnimaux > 0 ? (count / totalAnimaux) * 100 : 0;
                      
                      return (
                        <div key={code} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <span>{config.emoji}</span>
                              <span className="font-medium">{config.label}</span>
                              <span className="text-sm text-muted-foreground">({code})</span>
                            </span>
                            <span className="font-semibold">{count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                config.color
                              )}
                              style={{ width: `${Math.round(percentage)}%` }}
                            />
                          </div>
                          <div className="text-xs text-right text-muted-foreground">
                            {Math.round(percentage)}% du cheptel
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Recent sales */}
            <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
              <h2 className="font-display font-semibold text-lg mb-4">
                Dernières ventes
              </h2>
               <RecentSalesTable ventes={ventes} />
            </div>
          </div>
        )}

        {/* Recensement Tab */}
        <div className="container mx-auto py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="enregistrement">Enregistrement</TabsTrigger>
              <TabsTrigger value="resume">Résumé du cheptel</TabsTrigger>
            </TabsList>
            <TabsContent value="enregistrement">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimalCard onSuccess={() => {}} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Utilisez ce formulaire pour enregistrer un nouvel animal dans le cheptel.
                      Assurez-vous de saisir un code unique(VACH-001) pour chaque animal. 
                      VACH : pour vache
                      CHV : pour Chèvre
                      MOU: pour Mouton.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé du cheptel</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Chargement...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Disponibles</TableHead>
                          <TableHead className="text-right">Vendus</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resumeCheptel.length > 0 ? (
                          resumeCheptel.map((item) => (
                            <TableRow key={item.categorie}>
                              <TableCell className="font-medium">{item.categorie}</TableCell>
                              <TableCell className="text-right">{item.total}</TableCell>
                              <TableCell className="text-right text-green-600">{item.disponible}</TableCell>
                              <TableCell className="text-right text-amber-600">{item.vendu}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              Aucune donnée disponible
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Ventes Tab Enregistrez et suivez les ventes d'animaux */}
        {activeTab === "ventes" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  Gestion des ventes
                </h2>
                <p className="text-muted-foreground">
                  Enregistrez et suivez les ventes d'animaux
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display font-semibold text-lg mb-4">
                  Nouvelle vente
                </h3>
                <SaleForm onAddSale={handleAddSale} />
              </div>

             
            </div>

            <div className="gradient-card rounded-xl p-6 border border-border/50 shadow-card">
              <h3 className="font-display font-semibold text-lg mb-4">
                Historique des ventes
              </h3>
              <SalesTable onDelete={handleRefreshVentes} />
            </div>
          </div>
        )}

        {/* Rapports Tab */}
        {activeTab === "rapports" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  Rapports de ventes
                </h2>
                <p className="text-muted-foreground">
                  Analysez les ventes par période et catégorie
                </p>
              </div>
            </div>

            <ReportsSection sales={sales} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>FermeManager - Système de gestion d'élevage © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
