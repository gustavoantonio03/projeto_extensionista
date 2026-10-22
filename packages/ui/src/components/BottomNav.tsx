import * as React from "react";
import {
  Home,
  Pill,
  Apple,
  Users,
  Activity,
  Lock,
  type LucideIcon,
} from "lucide-react";

export interface NavTabItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Os rótulos NÃO são renderizados como texto; servem apenas de aria-label/title (acessibilidade). */
export const defaultNavTabs: NavTabItem[] = [
  { id: "inicio", label: "Meu Dia", href: "/", icon: Home },
  { id: "remedios", label: "Remédios", href: "/remedios", icon: Pill },
  { id: "nutricao", label: "Nutrição", href: "/nutricao", icon: Apple },
  { id: "familia", label: "Família", href: "/familia", icon: Users },
  { id: "clinico", label: "Clínico", href: "/clinico", icon: Activity },
];

export interface BottomNavProps {
  currentTab: string;
  onSelectTab?: (id: string, href: string) => void;
  mode?: "crianca" | "cuidador";
  /** Ids de abas com ponto de notificação discreto. */
  badgeTabs?: string[];
  className?: string;
}

/**
 * Layout garantido por inline styles + classes `.acolher-bottomnav*` (theme.css),
 * sem depender do scan do Tailwind em packages/ui.
 */
const navStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  height: 64,
  width: "100%",
  maxWidth: 430,
  boxSizing: "border-box",
  marginLeft: "auto",
  marginRight: "auto",
};

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  mode = "cuidador",
  badgeTabs = ["remedios"],
  className,
}) => {
  return (
    <nav
      aria-label="Navegação Principal do Aplicativo"
      style={navStyle}
      className={["acolher-bottomnav", className].filter(Boolean).join(" ")}
    >
      {defaultNavTabs.map((tab) => {
        const isActive = currentTab === tab.id || currentTab === tab.href;
        const Icon = tab.icon;
        const isLockedForChild = mode === "crianca" && tab.id === "clinico";
        const hasBadge = badgeTabs.includes(tab.id) && !isActive;

        return (
          <button
            key={tab.id}
            type="button"
            title={tab.label}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelectTab?.(tab.id, tab.href)}
            className="acolher-bottomnav-btn"
          >
            <span className="acolher-bottomnav-pill">
              <Icon
                aria-hidden="true"
                width={24}
                height={24}
                strokeWidth={isActive ? 2.4 : 1.7}
                fill={isActive ? "rgba(110,63,140,0.3)" : "none"}
              />
              {hasBadge && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    background: "#E5484D",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                />
              )}
              {isLockedForChild && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 4,
                    width: 14,
                    height: 14,
                    borderRadius: 9999,
                    background: "#FDE6CF",
                    color: "#B04A26",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #fff",
                  }}
                >
                  <Lock width={8} height={8} strokeWidth={3} />
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
