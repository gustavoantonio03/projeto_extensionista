import * as React from "react";
import { cn } from "../cn";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Algo não saiu como esperado",
  message,
  onRetry,
  retryLabel = "Tentar novamente",
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center text-center p-6 sm:p-8 rounded-[28px] bg-[#FDECEA] border border-[#C0392B]/30 max-w-md mx-auto my-6",
        className
      )}
    >
      <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-[#C0392B] mb-4 shadow-sm">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-[#C0392B] font-display mb-1">{title}</h3>
      <p className="text-sm text-[#1F2340] leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <Button variant="danger" size="md" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
