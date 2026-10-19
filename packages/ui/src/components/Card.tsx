import * as React from "react";
import { cn } from "../cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "tinted" | "outline";
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[28px] p-5 sm:p-6 transition-all duration-200",
          {
            "bg-white shadow-[0_4px_24px_-4px_rgba(110,63,140,0.08)] border border-[#F1E4D6]/70":
              variant === "default",
            "bg-white shadow-[0_12px_36px_-6px_rgba(110,63,140,0.14)]":
              variant === "elevated",
            "bg-[#FDE6CF]/40 border border-[#F1E4D6]":
              variant === "tinted",
            "bg-white border-2 border-[#F1E4D6]":
              variant === "outline",
            "cursor-pointer hover:shadow-[0_8px_28px_-4px_rgba(110,63,140,0.12)] active:scale-[0.99]":
              interactive,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
