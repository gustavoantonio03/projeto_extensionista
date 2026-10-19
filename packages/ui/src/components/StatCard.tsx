import * as React from "react";
import { cn } from "../cn";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  className,
  label,
  value,
  unit,
  trend,
  trendLabel,
  icon,
  ...props
}) => {
  return (
    <div
      className={cn(
        "p-4 rounded-[24px] bg-white border border-[#F1E4D6] shadow-[0_4px_16px_rgba(110,63,140,0.06)] flex flex-col justify-between min-h-[96px]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between text-xs font-semibold text-[#5B5F7A] mb-1">
        <span>{label}</span>
        {icon && <span className="text-[#6E3F8C]">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-[#1F2340] tracking-tight">{value}</span>
        {unit && <span className="text-xs font-bold text-[#5B5F7A]">{unit}</span>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#2E7D5B] mt-1">
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};
