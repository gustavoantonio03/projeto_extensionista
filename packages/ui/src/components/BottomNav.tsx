import * as React from "react";
import { cn } from "../cn";
import { Sun, Pill, Apple, Users, FileText } from "lucide-react";

export interface NavTabItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const defaultNavTabs: NavTabItem[] = [
  { id: "inicio", label: "Meu Dia", href: "/", icon: Sun },
  { id: "remedios", label: "Remédios", href: "/remedios", icon: Pill },
  { id: "nutricao", label: "Nutrição", href: "/nutricao", icon: Apple },
  { id: "familia", label: "Família", href: "/familia", icon: Users },
  { id: "clinico", label: "Clínico", href: "/clinico", icon: FileText },
];

export interface BottomNavProps {
  currentTab: string;
  onSelectTab?: (id: string, href: string) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  className,
}) => {
  return (
    <nav
      aria-label="Navegação Principal"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F1E4D6] shadow-[0_-4px_20px_rgba(31,35,64,0.06)] px-2 py-2 max-w-lg mx-auto sm:rounded-t-[28px]",
        className
      )}
    >
      <div className="flex items-center justify-around">
        {defaultNavTabs.map((tab) => {
          const isActive = currentTab === tab.id || currentTab === tab.href;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab?.(tab.id, tab.href)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[52px] rounded-2xl px-2 py-1 transition-all duration-150 cursor-pointer select-none",
                isActive
                  ? "text-[#6E3F8C] font-extrabold scale-105"
                  : "text-[#5B5F7A] hover:text-[#1F2340]"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  isActive ? "bg-[#EDE3F5]" : "bg-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-[2]")} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
