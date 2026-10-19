import * as React from "react";
import { cn } from "../cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  imageSrc = "/illustrations/mascote-lumi-descansando.jpg",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-8 rounded-[28px] bg-white border border-[#F1E4D6] shadow-sm max-w-md mx-auto my-6",
        className
      )}
    >
      <div className="w-36 h-36 rounded-full overflow-hidden bg-[#FAEBD6] mb-4 flex items-center justify-center p-2 shadow-inner">
        <img
          src={imageSrc}
          alt="Lumi descansando"
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-xl font-bold text-[#1F2340] font-display mb-2">{title}</h3>
      <p className="text-sm text-[#5B5F7A] leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
