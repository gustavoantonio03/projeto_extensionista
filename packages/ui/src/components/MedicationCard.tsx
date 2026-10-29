import * as React from "react";
import { cn } from "../cn";
import { Check, CheckCheck, Volume2 } from "lucide-react";

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

  /* ---- Rastreabilidade e dupla checagem (opcionais) ---- */
  /** Quem deu a medicação, ex: "Mãe (Ana)". */
  performedByLabel?: string;
  /** Horário do registro, ex: "08:05". */
  performedAt?: string;
  verificationStatus?: "pendente" | "conferido";
  /** Quem conferiu, ex: "Pai". */
  verifiedByLabel?: string;
  verifiedAt?: string;
  /** Exibe o botão "Conferir / Confirmar registro" (outro cuidador). */
  canVerify?: boolean;
  onVerify?: (id: string) => void;
  /** Permite desfazer o registro (padrão: true). */
  canUndo?: boolean;
  /** Somente leitura (ex.: Modo Criança): oculta ações críticas. */
  readOnly?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  id,
  name,
  dosage,
  time,
  instructions,
  taken,
  onToggleTaken,
  onAudioPlay,
  className,
  performedByLabel,
  performedAt,
  verificationStatus,
  verifiedByLabel,
  canVerify = false,
  onVerify,
  canUndo = true,
  readOnly = false,
}) => {
  const isVerified = verificationStatus === "conferido";
  const takenTime = performedAt ?? time;
  const actorLabel = performedByLabel ?? "Cuidador";

  return (
    <div
      className={cn(
        "p-4 rounded-[24px] border-2 transition-all duration-200 select-none",
        taken
          ? "bg-[#E5F4EC]/35 border-[#2E7D5B]/30"
          : "bg-white border-[#F1E4D6] shadow-[0_4px_16px_rgba(110,63,140,0.05)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <h4 className="text-base font-extrabold text-[#1F2340] leading-snug">
            {name}
          </h4>
          {taken && (
            <p className="text-xs font-semibold text-[#5B5F7A]">{dosage}</p>
          )}
        </div>
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

      {/* Linha única limpa e escaneável de horário / rastreabilidade */}
      <div className="mb-2.5" data-testid="medication-trail">
        {taken ? (
          <p className="text-xs font-bold text-[#1F2340] bg-[#E5F4EC] border border-[#2E7D5B]/25 rounded-xl px-3 py-1.5 leading-snug">
            ✅ {takenTime} por {actorLabel}
            {isVerified ? ` · ✓ ${verifiedByLabel ?? "Conferido"}` : ""}
          </p>
        ) : (
          <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-[#EDE3F5] text-[#6E3F8C]">
            {time} · {dosage}
          </span>
        )}
      </div>

      <p className="text-xs text-[#5B5F7A] mb-3 leading-relaxed">
        {instructions}
      </p>

      {/* Conferência cruzada 1-toque para outro cuidador */}
      {taken && !isVerified && canVerify && !readOnly && (
        <button
          type="button"
          onClick={() => onVerify?.(id)}
          className="w-full min-h-10 mb-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 border-[#134E54] text-[#134E54] bg-white hover:bg-[#E6EFF0] transition-colors cursor-pointer active:scale-[0.98]"
        >
          <CheckCheck className="w-4 h-4" aria-hidden="true" />
          Conferir / Confirmar registro
        </button>
      )}

      {/* Ação principal */}
      {readOnly ? (
        !taken && (
          <p className="text-[11px] font-semibold text-[#5B5F7A] text-center py-1">
            🔒 Registro exclusivo do cuidador
          </p>
        )
      ) : taken ? (
        canUndo &&
        !isVerified && (
          <button
            type="button"
            onClick={() => onToggleTaken(id, false)}
            className="w-full min-h-8 rounded-xl text-[11px] font-bold text-[#5B5F7A] hover:text-[#1F2340] hover:bg-[#F4F3F1] transition-colors cursor-pointer"
          >
            Desfazer registro
          </button>
        )
      ) : (
        <button
          type="button"
          onClick={() => onToggleTaken(id, true)}
          className="w-full h-11 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-[#6E3F8C] text-white hover:bg-[#5A3175] transition-all cursor-pointer shadow-[0_4px_14px_rgba(110,63,140,0.18)] active:scale-[0.98]"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Registrar dose</span>
        </button>
      )}
    </div>
  );
};

