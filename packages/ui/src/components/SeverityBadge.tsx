import * as React from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "../cn";

export type Severity = "critico" | "atencao" | "estavel";

const config: Record<
  Severity,
  { label: string; classes: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  critico: {
    label: "Crítico",
    classes: "bg-[#FDECEA] text-[#9B2C20] border-[#C0392B]/40",
    Icon: AlertOctagon,
  },
  atencao: {
    label: "Atenção",
    classes: "bg-[#FFF1DA] text-[#8A520D] border-[#9A5B0F]/40",
    Icon: AlertTriangle,
  },
  estavel: {
    label: "Estável",
    classes: "bg-[#E5F4EC] text-[#256648] border-[#2E7D5B]/40",
    Icon: CheckCircle2,
  },
};

export interface SeverityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: Severity;
}

/** Criticidade clínica: sempre ícone + texto, nunca apenas cor (WCAG 1.4.1). */
export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ level, className, ...props }) => {
  const { label, classes, Icon } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-extrabold select-none",
        classes,
        className
      )}
      {...props}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </span>
  );
};

export const severityOrder: Record<Severity, number> = { critico: 0, atencao: 1, estavel: 2 };
