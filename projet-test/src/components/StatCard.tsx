import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  className?: string;
  iconClassName?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  iconClassName 
}: StatCardProps) => {
  return (
    <div className={cn(
      "gradient-card rounded-xl p-6 shadow-card border border-border/50 animate-slide-up",
      "hover:shadow-soft transition-all duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold text-foreground">{value}</p>
          {trend !== undefined && (
            <p className={cn(
              "text-sm font-medium",
              trend >= 0 ? "text-primary" : "text-destructive"
            )}>
              {trend >= 0 ? "+" : ""}{trend}% ce mois
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconClassName || "bg-primary/10"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            iconClassName ? "text-current" : "text-primary"
          )} />
        </div>
      </div>
    </div>
  );
};
