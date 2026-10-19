"use client";

import * as React from "react";
import { SosButton, Avatar } from "@siglo/ui";
import { Volume2, Sparkles } from "lucide-react";
import { AppMode, PatientProfile } from "../lib/types";
import { PortalSwitcher } from "./PortalSwitcher";

export interface HeaderProps {
  patient: PatientProfile;
  mode: AppMode;
  onToggleMode: (mode: AppMode) => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  mode,
  onToggleMode,
  title,
  subtitle,
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = `${title || "OncoVida"}. ${subtitle || "Olá, " + patient.preferredName}. Você está no modo ${
          mode === "crianca" ? "criança" : "cuidador"
        }.`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "pt-BR";
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF8F0]/90 backdrop-blur-md px-4 py-3 border-b border-[#F1E4D6]/60">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6E3F8C] to-[#B04A26] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🌱
          </div>
          <div>
            <h1 className="font-bold text-base text-[#1F2340] leading-none">
              OncoVida
            </h1>
            <p className="text-[11px] font-semibold text-[#5B5F7A] mt-0.5">
              {subtitle || "Cuidado com afeto"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpeak}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-[#6E3F8C] bg-[#EDE3F5] hover:bg-[#E5D7F0] transition-colors cursor-pointer"
            aria-label="Ouvir conteúdo desta tela"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSpeaking ? "Parar" : "Ouvir"}
            </span>
          </button>

          <SosButton />

          <Avatar
            fallback={patient.preferredName.slice(0, 2).toUpperCase()}
            src={patient.avatarUrl}
            size="sm"
            alt={patient.preferredName}
          />
        </div>
      </div>

      {/* Barra de alternância Criança / Cuidador */}
      <div className="mt-2.5 flex items-center justify-between bg-white/70 p-1 rounded-2xl border border-[#F1E4D6]">
        <div className="flex items-center gap-1.5 pl-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F08A5D]" />
          <span className="text-xs font-bold text-[#1F2340]">
            {mode === "crianca" ? `Espaço da ${patient.preferredName}` : "Visão do Cuidador"}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onToggleMode("crianca")}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "crianca"
                ? "bg-[#6E3F8C] text-white shadow-xs"
                : "text-[#5B5F7A] hover:text-[#1F2340]"
            }`}
          >
            🧒 Criança
          </button>
          <button
            type="button"
            onClick={() => onToggleMode("cuidador")}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "cuidador"
                ? "bg-[#6E3F8C] text-white shadow-xs"
                : "text-[#5B5F7A] hover:text-[#1F2340]"
            }`}
          >
            🧑 Cuidador
          </button>
        </div>
      </div>
      <PortalSwitcher current="paciente" className="mt-2" />
    </header>
  );
};
