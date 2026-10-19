import * as React from "react";
import { cn } from "../cn";

export interface IconBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "peach" | "plum" | "lavender" | "orange" | "success" | "danger" | "clinical";
  size?: "sm" | "md" | "lg";
}

export const IconBubble: React.FC<IconBubbleProps> = ({
  className,
  color = "peach",
  size = "md",
  children,
  ...props
}) => {
  const colorClasses = {
    peach: "bg-[#FDE6CF] text-[#B04A26]",
    plum: "bg-[#EDE3F5] text-[#6E3F8C]",
    lavender: "bg-[#EDE6F6] text-[#6E3F8C]",
    orange: "bg-[#FFF1DA] text-[#F08A5D]",
    success: "bg-[#E5F4EC] text-[#2E7D5B]",
    danger: "bg-[#FDECEA] text-[#C0392B]",
    clinical: "bg-[#E6EFF0] text-[#134E54]",
  }[color];

  const sizeClasses = {
    sm: "h-9 w-9 text-base",
    md: "h-12 w-12 text-xl",
    lg: "h-16 w-16 text-2xl",
  }[size];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 select-none shadow-sm",
        colorClasses,
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
