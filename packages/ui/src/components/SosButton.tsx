import * as React from "react";
import { cn } from "../cn";
import { PhoneCall, AlertTriangle } from "lucide-react";
import { Sheet } from "./Sheet";
import { Button } from "./Button";

export interface SosButtonProps {
  onCallNurse?: () => void;
  onCallHospital?: () => void;
  nursePhone?: string;
  hospitalPhone?: string;
  className?: string;
}

export const SosButton: React.FC<SosButtonProps> = ({
  onCallNurse,
  onCallHospital,
  nursePhone = "(11) 98765-4321",
  hospitalPhone = "(11) 3456-7890",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-xs bg-[#C0392B] hover:bg-[#A93226] text-white shadow-[0_2px_10px_rgba(192,57,43,0.35)] active:scale-95 cursor-pointer transition-all min-h-[38px]",
          className
        )}
        aria-label="Abrir contatos de emergência SOS"
      >
        <span className="text-sm font-mono font-bold leading-none">✱</span>
        <span>SOS</span>
      </button>

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Plantão de Apoio Imediato"
        description="Fale diretamente com nossa enfermagem ou acione o pronto-atendimento oncológico."
        position="bottom"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#C0392B]/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1F2340] leading-relaxed">
              <strong>Sinais de alerta:</strong> Febre acima de 37.8°C, vômito que não cessa, sangramentos ou dor intensa súbita exigem contato imediato.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="danger"
              size="lg"
              fullWidth
              leftIcon={<PhoneCall className="w-5 h-5" />}
              onClick={() => {
                onCallNurse?.();
                window.location.href = `tel:${nursePhone.replace(/\D/g, "")}`;
              }}
            >
              Ligar para Enfermagem 24h ({nursePhone})
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                onCallHospital?.();
                window.location.href = `tel:${hospitalPhone.replace(/\D/g, "")}`;
              }}
            >
              Hospital Oncológico Central ({hospitalPhone})
            </Button>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              Voltar ao aplicativo
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
};
