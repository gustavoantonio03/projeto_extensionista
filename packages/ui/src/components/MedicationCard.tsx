import * as React from "react";
import { cn } from "../cn";
import { Check, CheckCheck, Clock, Hourglass, Volume2 } from "lucide-react";

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
  /** Quem deu a medicação, ex: "Mãe (Ana Paula)". */
  performedByLabel?: string;
  /** Horário do registro, ex: "08:05". */
  performedAt?: string;
  verificationStatus?: "pendente" | "conferido";
  /** Quem conferiu, ex: "Pai (Carlos Eduardo)". */
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
  category,
  onAudioPlay,
  className,
  performedByLabel,
  performedAt,
  verificationStatus,
  verifiedByLabel,
  verifiedAt,
  canVerify = false,
  onVerify,
  canUndo = true,
  readOnly = false,
}) => {
  const hasTrail = taken && !!performedByLabel;
  const isVerified = verificationStatus === "conferido";

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

      {/* Selo de rastreabilidade: quem deu a medicação e quem conferiu */}
      {hasTrail && (
        <div className="mb-3 space-y-2" data-testid="medication-trail">
          <p className="text-xs font-bold text-[#1F2340] bg-[#E5F4EC] border border-[#2E7D5B]/25 rounded-xl px-3 py-2 leading-snug">
            ✅ {performedByLabel} deu a medicação
            {performedAt ? ` às ${performedAt}` : ""}
          </p>

          {isVerified ? (
            <p className="text-xs font-bold text-[#134E54] bg-[#E6EFF0] border border-[#134E54]/20 rounded-xl px-3 py-2 flex items-center gap-1.5 leading-snug">
              <CheckCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                ✓ Conferido por {verifiedByLabel ?? "outro cuidador"}
                {verifiedAt ? ` às ${verifiedAt}` : ""}
              </span>
            </p>
          ) : canVerify && !readOnly ? (
            <button
              type="button"
              onClick={() => onVerify?.(id)}
              className="w-full min-h-11 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-[#134E54] text-[#134E54] bg-white hover:bg-[#E6EFF0] transition-colors cursor-pointer active:scale-[0.98]"
            >
              <CheckCheck className="w-4 h-4" aria-hidden="true" />
              Conferir / Confirmar registro
            </button>
          ) : (
            <p className="text-xs font-semibold text-[#9A5B0F] bg-[#FFF1DA] rounded-xl px-3 py-2 flex items-center gap-1.5 leading-snug">
              <Hourglass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              Aguardando conferência de outro cuidador
            </p>
          )}
        </div>
      )}

      {/* Ação principal */}
      {readOnly ? (
        !taken && (
          <p className="text-xs font-semibold text-[#5B5F7A] text-center py-2">
            🔒 Peça a um adulto para registrar este remédio.
          </p>
        )
      ) : hasTrail ? (
        canUndo &&
        !isVerified && (
          <button
            type="button"
            onClick={() => onToggleTaken(id, false)}
            className="w-full min-h-10 rounded-2xl text-xs font-bold text-[#5B5F7A] hover:text-[#1F2340] hover:bg-[#F4F3F1] transition-colors cursor-pointer"
          >
            Desfazer meu registro
          </button>
        )
      ) : (
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
      )}
    </div>
  );
};
