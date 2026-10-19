"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@siglo/ui";
import { HeartHandshake, Stethoscope } from "lucide-react";

export interface PortalSwitcherProps {
  current: "paciente" | "medico";
  className?: string;
}

/** Alterna entre os dois portais (demonstração do SIGLO; na Fase 2 vem do papel do usuário). */
export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({ current, className }) => {
  const items = [
    { id: "paciente", href: "/", label: "Portal do Paciente", Icon: HeartHandshake },
    { id: "medico", href: "/medico", label: "Portal do Médico", Icon: Stethoscope },
  ] as const;

  return (
    <nav
      aria-label="Alternar portal (demonstração)"
      className={cn("flex p-1 gap-1 rounded-2xl bg-[#F4F3F1] border border-[#F1E4D6]", className)}
    >
      {items.map(({ id, href, label, Icon }) => {
        const active = current === id;
        return (
          <Link
            key={id}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 rounded-xl text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C]",
              active ? "bg-white text-[#6E3F8C] shadow-sm" : "text-[#5B5F7A] hover:text-[#1F2340]"
            )}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
