import * as React from "react";
import { cn } from "../cn";
import { Check, Clock, Volume2 } from "lucide-react";

export interface MedicationCardProps {
  id: string;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  taken: boolean;
  onToggleTaken: (id: string, taken: boolean) => void;
  category?: string;
  onAudioPlay?: (id: string) => void;
  className?: string;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  id,
  name,
  dosage,
  time,
  instructions,
  taken,
  onToggleTaken,
  category,
  onAudioPlay,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-5 rounded-[26px] border-2 transition-all duration-200 select-none",
        taken
          ? "bg-[#E5F4EC]/40 border-[#2E7D5B]/30"
          : "bg-white border-[#F1E4D6] shadow-[0_4px_20px_rgba(110,63,140,0.06)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE3F5] text-[#6E3F8C]">
            <Clock className="w-3 h-3" />
            {time}
          </span>
          {category && (
            <span className="text-xs font-semibold text-[#5B5F7A]">
              • {category}
            </span>
          )}
        </div>
        {taken ? (
          <span className="text-xs font-bold text-[#2E7D5B] bg-[#E5F4EC] px-2.5 py-0.5 rounded-full border border-[#2E7D5B]/30">
            Tomado
          </span>
        ) : (
          <span className="text-xs font-bold text-[#9A5B0F] bg-[#FFF1DA] px-2.5 py-0.5 rounded-full">
            Pendente
          </span>
        )}
      </div>

      <div className="mb-3">
        <h4 className="text-lg font-bold text-[#1F2340] leading-snug">{name}</h4>
        <p className="text-xs font-bold text-[#6E3F8C] mt-0.5">{dosage}</p>
      </div>

      <div className="p-3 rounded-xl bg-[#FFF8F0] border border-[#F1E4D6] mb-4 flex items-start justify-between gap-2">
        <p className="text-xs text-[#5B5F7A] leading-relaxed">
          <strong className="text-[#1F2340]">Como tomar:</strong> {instructions}
        </p>
        {onAudioPlay && (
          <button
            type="button"
            onClick={() => onAudioPlay(id)}
            aria-label="Ouvir instrução"
            className="p-1.5 rounded-lg text-[#6E3F8C] hover:bg-[#EDE3F5] transition-colors shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onToggleTaken(id, !taken)}
        className={cn(
          "w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]",
          taken
            ? "bg-[#E5F4EC] text-[#2E7D5B] border border-[#2E7D5B]/40 hover:bg-[#D5EEDB]"
            : "bg-[#6E3F8C] text-white hover:bg-[#5A3175] shadow-[0_4px_16px_rgba(110,63,140,0.2)]"
        )}
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>{taken ? "Medicamento Confirmado" : "Já tomei este remédio"}</span>
      </button>
    </div>
  );
};
