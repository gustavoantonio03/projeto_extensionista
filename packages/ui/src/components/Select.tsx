import * as React from "react";
import { cn } from "../cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

/** Select nativo estilizado (melhor acessibilidade e teclado). Use dentro de <Field>. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full h-[52px] px-3 rounded-xl text-base bg-white border border-[#DCD7CD] text-[#1F2340] transition-colors focus:outline-none focus:border-[#6E3F8C] focus:ring-2 focus:ring-[#EDE3F5] disabled:bg-[#F4F3F1] cursor-pointer",
        hasError && "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#FDECEA]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
