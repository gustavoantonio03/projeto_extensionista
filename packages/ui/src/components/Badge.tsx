import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full select-none",
  {
    variants: {
      variant: {
        success: "bg-[#E5F4EC] text-[#2E7D5B] border border-[#2E7D5B]/20",
        warning: "bg-[#FFF1DA] text-[#9A5B0F] border border-[#9A5B0F]/20",
        danger: "bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/20",
        plum: "bg-[#EDE3F5] text-[#6E3F8C] border border-[#6E3F8C]/20",
        clinical: "bg-[#E6EFF0] text-[#134E54] border border-[#134E54]/20",
        neutral: "bg-[#F4F3F1] text-[#404849] border border-[#E3E2E0]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  dot = false,
  children,
  ...props
}) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-[#2E7D5B]": variant === "success",
            "bg-[#9A5B0F]": variant === "warning",
            "bg-[#C0392B]": variant === "danger",
            "bg-[#6E3F8C]": variant === "plum",
            "bg-[#134E54]": variant === "clinical",
            "bg-[#404849]": variant === "neutral" || !variant,
          })}
        />
      )}
      {children}
    </span>
  );
};
