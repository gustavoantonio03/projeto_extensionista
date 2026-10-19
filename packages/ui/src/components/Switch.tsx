import * as React from "react";
import { cn } from "../cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  id,
}) => {
  const switchId = id || React.useId();

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {(label || description) && (
        <label htmlFor={switchId} className="flex flex-col cursor-pointer select-none">
          {label && <span className="font-bold text-sm text-[#1F2340]">{label}</span>}
          {description && (
            <span className="text-xs text-[#5B5F7A] leading-relaxed">{description}</span>
          )}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C] disabled:opacity-50",
          checked ? "bg-[#6E3F8C]" : "bg-[#DADAD8]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
};
