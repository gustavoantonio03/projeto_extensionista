import * as React from "react";
import { cn } from "../cn";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "plum" | "peach" | "success" | "orange";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  value,
  max = 100,
  label,
  showValue = false,
  color = "plum",
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    plum: "bg-[#6E3F8C]",
    peach: "bg-[#F9C98F]",
    success: "bg-[#2E7D5B]",
    orange: "bg-[#F08A5D]",
  }[color];

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-bold text-[#1F2340]">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Progresso"}
        className="w-full h-3 rounded-full bg-[#EDE6F6] overflow-hidden p-0.5"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", colorClasses)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
