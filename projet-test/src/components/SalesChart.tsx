import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { VenteAnimal } from "@/types/farm";
import { useMemo } from "react";

interface SalesChartProps {
  ventes?: VenteAnimal[];
}

const COLORS = {
  VCH: "hsl(25, 70%, 45%)",  // Vaches
  MOU: "hsl(45, 60%, 50%)",  // Moutons
  CHV: "hsl(15, 55%, 40%)",  // Chèvres
};

const LABELS: Record<string, string> = {
  VCH: "Vaches",
  MOU: "Moutons",
  CHV: "Chèvres",
};

export const SalesChart = ({ ventes = [] }: SalesChartProps) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(ventes) || ventes.length === 0) {
      return [];
    }

    const byCategory = ventes.reduce((acc, vente) => {
      if (vente?.code_animal) {
        const prefix = vente.code_animal.split('-')[0];
        if (prefix) {
          acc[prefix] = (acc[prefix] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byCategory).map(([category, count]) => ({
      name: LABELS[category] || category,
      value: count,
      category,
    }));
  }, [ventes]);

  // Ne rien afficher s'il n'y a pas de données
  if (!ventes || ventes.length === 0 || chartData.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.category as keyof typeof COLORS] || "#8884d8"}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              boxShadow: "var(--shadow-soft)",
            }}
            formatter={(value: number) => [`${value} ventes`, "Total"]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};