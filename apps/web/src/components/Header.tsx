"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SosButton } from "@siglo/ui";
import { LogOut } from "lucide-react";
import { AppMode, PatientProfile, CaregiverProfile, SessionState } from "../lib/types";
import { getSessionState, logoutSession } from "../lib/data";

export interface HeaderProps {
  patient?: PatientProfile;
  mode?: AppMode;
  onToggleMode?: (mode: AppMode) => void;
  title?: string;
  subtitle?: string;
  onCaregiverChange?: (caregiver: CaregiverProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  onCaregiverChange,
}) => {
  const router = useRouter();
  const [session, setSession] = React.useState<SessionState | null>(null);

  React.useEffect(() => {
    getSessionState().then((s) => {
      setSession(s);
      onToggleMode?.(s.currentMode);
      onCaregiverChange?.(s.activeCaregiver);
    });
  }, [onToggleMode, onCaregiverChange]);

  const handleLogout = async () => {
    await logoutSession();
    router.push("/login");
  };

  const activeMode = session?.currentMode ?? mode ?? "cuidador";
  const userLabel =
    session?.userLabel ??
    (activeMode === "crianca" ? "Criança (Clarinha)" : "Mãe (Ana)");

  return (
    <header className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md px-3.5 py-2.5 border-b border-[#F1E4D6]/80">
      <div className="flex items-center justify-between gap-2">
        {/* Identidade do App */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6E3F8C] to-[#B04A26] flex items-center justify-center text-white text-sm shadow-2xs">
            🌱
          </div>
          <span className="font-extrabold text-sm text-[#1F2340] tracking-tight">
            OncoVida
          </span>
        </div>

        {/* Usuário Logado + Botão Sair + SOS */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#F1E4D6] text-[11px] font-bold text-[#1F2340] truncate"
            title={`Logado como ${userLabel}`}
          >
            <span aria-hidden="true">
              {activeMode === "crianca" ? "🧒" : "🧑"}
            </span>
            <span className="truncate">{userLabel}</span>
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#6E3F8C] bg-[#EDE3F5] hover:bg-[#E2D3EE] transition-colors cursor-pointer shrink-0"
            aria-label="Sair da conta"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sair</span>
          </button>

          <SosButton />
        </div>
      </div>
    </header>
  );
};


