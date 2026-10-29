"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@siglo/ui";
import { LogOut } from "lucide-react";
import { logoutSession } from "../lib/data";

export interface PortalSwitcherProps {
  current?: "paciente" | "medico";
  className?: string;
}

/** Botão de encerramento de sessão que leva para a tela unificada de Login (/login). */
export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({ className }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutSession();
    router.push("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold text-[#6E3F8C] bg-[#EDE3F5] hover:bg-[#E2D3EE] transition-colors cursor-pointer",
        className
      )}
    >
      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
      <span>Sair / Trocar conta</span>
    </button>
  );
};

