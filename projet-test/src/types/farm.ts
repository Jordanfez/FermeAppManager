export type AnimalCategory = 'vache' | 'mouton' | 'chevre';

export interface Animal {
  id: string;
  category: AnimalCategory;
  count: number;
  lastUpdated: Date;
}

export interface Sale {
  id: string;
  category: AnimalCategory;
  quantity: number;
  sellerName: string;
  saleDate: Date;
  pricePerUnit: number;
  totalPrice: number;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  salesByCategory: Record<AnimalCategory, number>;
  revenueByCategory: Record<AnimalCategory, number>;
}

export interface VenteAnimal {
  id_animal: number;
  code_animal: string;
  id_categorie: number;
  date_enregistrement: Date;
}