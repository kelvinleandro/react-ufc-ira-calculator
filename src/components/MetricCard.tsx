import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "amber";
}

const colorClasses = {
  blue: "bg-metric-blue/10 text-metric-blue",
  green: "bg-metric-green/10 text-metric-green",
  purple: "bg-metric-purple/10 text-metric-purple",
  amber: "bg-metric-amber/10 text-metric-amber",
};

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: MetricCardProps) => {
  return (
    <Card className="border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2 text-left">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-3", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
