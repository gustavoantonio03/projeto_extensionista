import * as React from "react";
import { cn } from "../cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  className?: string;
}

/** Tabs acessíveis (role=tablist, setas ← → navegam). Painéis são responsabilidade do chamador. */
export const Tabs: React.FC<TabsProps> = ({ tabs, value, onChange, ariaLabel, className }) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(index + dir + tabs.length) % tabs.length];
    if (next) {
      onChange(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex gap-1 overflow-x-auto border-b border-[#F1E4D6]", className)}
    >
      {tabs.map((t, i) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "px-4 min-h-[44px] text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C] rounded-t-lg",
              selected
                ? "border-[#6E3F8C] text-[#6E3F8C]"
                : "border-transparent text-[#5B5F7A] hover:text-[#1F2340]"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#EDE3F5] text-[#6E3F8C] text-[11px]">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
