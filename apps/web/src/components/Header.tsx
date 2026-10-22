"use client";

import * as React from "react";
import { SosButton, Avatar, Button } from "@siglo/ui";
import {
  Volume2,
  Sparkles,
  Lock,
  Unlock,
  ChevronDown,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import { AppMode, PatientProfile, CaregiverProfile } from "../lib/types";
import {
  getCaregivers,
  getActiveCaregiver,
  setActiveCaregiver,
  verifyParentPin,
  lockParentMode,
} from "../lib/data";
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
  const [caregivers, setCaregivers] = React.useState<CaregiverProfile[]>([]);
  const [activeCaregiver, setActiveCaregiverState] =
    React.useState<CaregiverProfile | null>(null);

  // Controle da Trava Parental (Modal de PIN)
  const [isPinModalOpen, setIsPinModalOpen] = React.useState(false);
  const [pinValue, setPinValue] = React.useState("");
  const [selectedCaregiverId, setSelectedCaregiverId] =
    React.useState<string>("");
  const [pinError, setPinError] = React.useState<string | null>(null);

  // Controle de troca rápida de cuidador ativo
  const [isCaregiverDropdownOpen, setIsCaregiverDropdownOpen] =
    React.useState(false);

  React.useEffect(() => {
    getCaregivers().then((list) => {
      setCaregivers(list);
      if (list.length > 0 && !selectedCaregiverId) {
        setSelectedCaregiverId(list[0]?.id ?? "");
      }
    });
    getActiveCaregiver().then((active) => {
      setActiveCaregiverState(active);
      setSelectedCaregiverId(active.id);
    });
  }, []);

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = `${title || "OncoVida"}. ${
          subtitle || "Olá, " + patient.preferredName
        }. Você está no modo ${mode === "crianca" ? "criança" : "cuidador"}.`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "pt-BR";
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSelectChildMode = async () => {
    await lockParentMode();
    onToggleMode("crianca");
    setIsCaregiverDropdownOpen(false);
  };

  const handleRequestCaregiverMode = () => {
    if (mode === "cuidador") return;
    // Abre modal de trava parental para desbloqueio com PIN
    setPinValue("");
    setPinError(null);
    setIsPinModalOpen(true);
  };

  const handleConfirmPinUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinValue.trim();
    if (!pin) {
      setPinError("Por favor, digite o PIN.");
      return;
    }

    const isValid = await verifyParentPin(pin);
    if (!isValid) {
      setPinError("PIN incorreto. Dica: use o código padrão 1234.");
      return;
    }

    if (selectedCaregiverId) {
      const updatedCaregiver = await setActiveCaregiver(selectedCaregiverId);
      setActiveCaregiverState(updatedCaregiver);
    }

    setIsPinModalOpen(false);
    onToggleMode("cuidador");
  };

  const handleSwitchActiveCaregiver = async (caregiverId: string) => {
    const updated = await setActiveCaregiver(caregiverId);
    setActiveCaregiverState(updated);
    setIsCaregiverDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md px-4 py-3 border-b border-[#F1E4D6]/70 shadow-xs">
        {/* Topo: Logo, Acessibilidade e SOS */}
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

        {/* Barra de alternância Criança vs. Cuidador com Trava Parental */}
        <div className="mt-2.5 flex items-center justify-between bg-white/80 p-1 rounded-2xl border border-[#F1E4D6]">
          <div className="flex items-center gap-1.5 pl-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F08A5D]" />
            <span className="text-xs font-bold text-[#1F2340]">
              {mode === "crianca"
                ? `Espaço da ${patient.preferredName}`
                : "Painel do Cuidador"}
            </span>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleSelectChildMode}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                mode === "crianca"
                  ? "bg-[#6E3F8C] text-white shadow-xs"
                  : "text-[#5B5F7A] hover:text-[#1F2340]"
              }`}
            >
              <span>🧒</span>
              <span>Criança</span>
            </button>

            <button
              type="button"
              onClick={handleRequestCaregiverMode}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "cuidador"
                  ? "bg-[#6E3F8C] text-white shadow-xs"
                  : "text-[#5B5F7A] hover:text-[#1F2340]"
              }`}
            >
              <span>🧑</span>
              <span>Cuidador</span>
              {mode === "crianca" && (
                <Lock className="w-3 h-3 text-[#B04A26] stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Quando no Modo Cuidador: Exibe o cuidador ativo e seletor rápido */}
        {mode === "cuidador" && activeCaregiver && (
          <div className="mt-2 relative">
            <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-gradient-to-r from-[#EDE3F5]/80 to-white border border-[#6E3F8C]/20 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#6E3F8C]/30 bg-white shrink-0">
                  <img
                    src={activeCaregiver.avatarUrl}
                    alt={activeCaregiver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="text-[#5B5F7A] font-medium">
                    Cuidador ativo:{" "}
                  </span>
                  <strong className="text-[#6E3F8C] font-bold">
                    {activeCaregiver.relationLabel} ({activeCaregiver.shortName})
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCaregiverDropdownOpen(!isCaregiverDropdownOpen)
                }
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#6E3F8C] bg-white border border-[#6E3F8C]/30 hover:bg-[#EDE3F5] transition-colors cursor-pointer"
                aria-expanded={isCaregiverDropdownOpen}
              >
                <span>Trocar</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Menu Dropdown de Seleção de Cuidador */}
            {isCaregiverDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-2xl border border-[#F1E4D6] shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B5F7A] px-2 py-1">
                  Alternar Cuidador Ativo
                </p>
                <div className="space-y-1">
                  {caregivers.map((cg) => {
                    const isSelected = activeCaregiver.id === cg.id;
                    return (
                      <button
                        key={cg.id}
                        type="button"
                        onClick={() => handleSwitchActiveCaregiver(cg.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#EDE3F5] text-[#6E3F8C] font-bold"
                            : "hover:bg-[#FFF8F0] text-[#1F2340]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={cg.avatarUrl}
                            alt={cg.name}
                            className="w-6 h-6 rounded-full object-cover border border-white"
                          />
                          <div>
                            <p className="text-xs font-bold leading-tight">
                              {cg.name}
                            </p>
                            <p className="text-[10px] text-[#5B5F7A]">
                              {cg.relationLabel}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#6E3F8C]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <PortalSwitcher current="paciente" className="mt-2" />
      </header>

      {/* Modal / Sheet da Trava Parental (PIN Criança -> Cuidador) */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[32px] bg-[#FFF8F0] border border-[#F1E4D6] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            {/* Cabeçalho do Modal */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FDE6CF] text-[#B04A26] flex items-center justify-center">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1F2340]">
                    Trava de Segurança Parental
                  </h3>
                  <p className="text-[11px] text-[#5B5F7A]">
                    Área restrita aos adultos responsáveis
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#5B5F7A] hover:text-[#1F2340] flex items-center justify-center cursor-pointer shadow-2xs"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5B5F7A] mb-4 leading-relaxed">
              Para proteger o espaço da criança e evitar alterações acidentais de
              remédios, digite o PIN e indique quem está assumindo o painel:
            </p>

            <form onSubmit={handleConfirmPinUnlock} className="space-y-4">
              {/* Seleção de Cuidador */}
              <div>
                <label className="block text-xs font-bold text-[#1F2340] mb-2">
                  Quem é o cuidador que está acessando agora?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {caregivers.map((cg) => {
                    const isSelected = selectedCaregiverId === cg.id;
                    return (
                      <button
                        key={cg.id}
                        type="button"
                        onClick={() => setSelectedCaregiverId(cg.id)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white border-[#6E3F8C] shadow-xs ring-2 ring-[#6E3F8C]/20"
                            : "bg-white/60 border-[#F1E4D6] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={cg.avatarUrl}
                            alt={cg.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#F1E4D6]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#1F2340]">
                              {cg.name}
                            </p>
                            <p className="text-[10px] text-[#5B5F7A]">
                              {cg.relationLabel}
                            </p>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#6E3F8C] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#D5CDBC]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campo de PIN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="parent-pin-input"
                    className="text-xs font-bold text-[#1F2340]"
                  >
                    PIN de 4 dígitos
                  </label>
                  <button
                    type="button"
                    onClick={() => setPinValue("1234")}
                    className="text-[11px] font-bold text-[#6E3F8C] hover:underline cursor-pointer"
                  >
                    Usar PIN padrão (1234)
                  </button>
                </div>

                <input
                  id="parent-pin-input"
                  type="password"
                  maxLength={4}
                  value={pinValue}
                  onChange={(e) => {
                    setPinValue(e.target.value);
                    setPinError(null);
                  }}
                  placeholder="••••"
                  className="w-full tracking-widest text-center text-xl font-mono py-2.5 px-4 rounded-2xl bg-white border border-[#D5CDBC] focus:outline-hidden focus:ring-2 focus:ring-[#6E3F8C] shadow-inner"
                  autoFocus
                />

                {pinError && (
                  <p className="text-xs text-[#C0392B] font-bold mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {pinError}
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  leftIcon={<Unlock className="w-4 h-4" />}
                >
                  Desbloquear
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
