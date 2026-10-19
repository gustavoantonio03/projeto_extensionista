import * as React from "react";
import { cn } from "../cn";

export type BodyPart = "cabeca" | "garganta" | "barriga" | "bracos" | "pernas";
export type PainIntensity = "pouco" | "medio" | "forte";

export interface PainScaleProps {
  selectedPart?: BodyPart;
  onSelectPart: (part: BodyPart) => void;
  intensity?: PainIntensity;
  onChangeIntensity: (intensity: PainIntensity) => void;
  className?: string;
}

export const PainScale: React.FC<PainScaleProps> = ({
  selectedPart,
  onSelectPart,
  intensity,
  onChangeIntensity,
  className,
}) => {
  const parts: { id: BodyPart; label: string; icon: string }[] = [
    { id: "cabeca", label: "Cabeça", icon: "🧠" },
    { id: "garganta", label: "Garganta", icon: "🧣" },
    { id: "barriga", label: "Barriga / Estômago", icon: "🥣" },
    { id: "bracos", label: "Braços", icon: "💪" },
    { id: "pernas", label: "Pernas e Pés", icon: "👟" },
  ];

  const intensities: { id: PainIntensity; label: string; bars: number; color: string }[] = [
    { id: "pouco", label: "Pouco", bars: 1, color: "text-[#2E7D5B] bg-[#E5F4EC]" },
    { id: "medio", label: "Médio", bars: 2, color: "text-[#9A5B0F] bg-[#FFF1DA]" },
    { id: "forte", label: "Forte", bars: 3, color: "text-[#C0392B] bg-[#FDECEA]" },
  ];

  return (
    <div className={cn("flex flex-col gap-5 w-full", className)}>
      <div>
        <p className="text-sm font-bold text-[#1F2340] mb-3">
          1. Onde está incomodando? (Toque na parte)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {parts.map((p) => {
            const isSelected = selectedPart === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPart(p.id)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all min-h-[50px] text-left cursor-pointer",
                  isSelected
                    ? "bg-[#EDE3F5] border-[#6E3F8C] text-[#6E3F8C] font-bold shadow-xs"
                    : "bg-white border-[#F1E4D6] text-[#1F2340] hover:bg-[#FFF8F0]"
                )}
              >
                <span className="text-xl" aria-hidden="true">{p.icon}</span>
                <span className="text-xs font-semibold">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-[#1F2340] mb-3">
          2. Qual o tamanho do incômodo?
        </p>
        <div className="grid grid-cols-3 gap-3">
          {intensities.map((item) => {
            const isSelected = intensity === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeIntensity(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-h-[56px] cursor-pointer",
                  isSelected
                    ? "bg-white border-[#6E3F8C] shadow-sm font-bold text-[#6E3F8C]"
                    : "bg-white/80 border-[#F1E4D6] text-[#5B5F7A] hover:bg-white"
                )}
              >
                <div className="flex gap-1 mb-1 items-end h-4">
                  {[...Array(item.bars)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-1.5 rounded-full",
                        isSelected ? "bg-[#6E3F8C]" : "bg-[#B79AD6]"
                      )}
                      style={{ height: `${(i + 1) * 5 + 4}px` }}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
