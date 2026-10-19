import * as React from "react";
import { cn } from "../cn";
import { X } from "lucide-react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: "bottom" | "center";
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = "bottom",
}) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "p-0 backdrop:bg-[#1F2340]/40 backdrop:backdrop-blur-xs bg-transparent border-0 max-h-[92vh] max-w-lg w-full m-auto open:animate-in open:fade-in open:zoom-in-95",
        position === "bottom" && "mb-0 sm:mb-auto rounded-b-none sm:rounded-[32px]"
      )}
    >
      <div
        className={cn(
          "bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(31,35,64,0.3)] border border-[#F1E4D6] flex flex-col max-h-[88vh] overflow-y-auto",
          position === "bottom" && "rounded-b-none sm:rounded-[32px]"
        )}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F1E4D6]/70">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-[#1F2340] font-display">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[#5B5F7A] mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-2 text-[#5B5F7A] hover:bg-[#F4F3F1] hover:text-[#1F2340] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </dialog>
  );
};
