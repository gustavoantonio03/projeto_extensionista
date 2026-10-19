import * as React from "react";
import { cn } from "../cn";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Field: React.FC<FieldProps> = ({
  className,
  label,
  htmlFor,
  helperText,
  error,
  required,
  children,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-bold text-[#1F2340] flex items-center gap-1 select-none"
      >
        <span>{label}</span>
        {required && <span className="text-[#C0392B] font-bold" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-semibold text-[#C0392B] flex items-center gap-1" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#5B5F7A] font-medium leading-relaxed">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-[52px] px-4 rounded-xl text-base bg-white border border-[#DCD7CD] text-[#1F2340] placeholder:text-[#5B5F7A]/60 transition-colors duration-150 focus:outline-none focus:border-[#6E3F8C] focus:ring-2 focus:ring-[#EDE3F5] disabled:bg-[#F4F3F1] disabled:text-[#70797A]",
          hasError && "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#FDECEA]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[96px] p-4 rounded-xl text-base bg-white border border-[#DCD7CD] text-[#1F2340] placeholder:text-[#5B5F7A]/60 transition-colors duration-150 focus:outline-none focus:border-[#6E3F8C] focus:ring-2 focus:ring-[#EDE3F5] disabled:bg-[#F4F3F1] disabled:text-[#70797A] resize-y",
          hasError && "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#FDECEA]",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
