import * as React from "react";
import { cn } from "../cn";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leftIcon?: React.ReactNode;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected = false, leftIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full min-h-[38px] transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C]",
          selected
            ? "bg-[#EDE3F5] text-[#6E3F8C] border-2 border-[#6E3F8C] shadow-sm font-bold"
            : "bg-white text-[#5B5F7A] border border-[#F1E4D6] hover:bg-[#FFF8F0] hover:text-[#1F2340]",
          className
        )}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Chip.displayName = "Chip";
