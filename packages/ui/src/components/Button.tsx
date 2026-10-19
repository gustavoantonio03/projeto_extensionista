import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#6E3F8C] hover:bg-[#5A3175] active:bg-[#45245B] text-white shadow-[0_4px_16px_rgba(110,63,140,0.25)] focus-visible:ring-[#6E3F8C]",
        secondary:
          "bg-[#FDE6CF] hover:bg-[#F9C98F] active:bg-[#F6AE5C] text-[#1F2340] border border-[#F1E4D6] focus-visible:ring-[#F9C98F]",
        soft:
          "bg-[#F6F0FA] hover:bg-[#EDE3F5] text-[#6E3F8C] border border-[#EDE3F5] focus-visible:ring-[#6E3F8C]",
        outline:
          "bg-transparent hover:bg-[#F6F0FA] text-[#6E3F8C] border-2 border-[#6E3F8C] focus-visible:ring-[#6E3F8C]",
        ghost:
          "bg-transparent hover:bg-[#EDE3F5] text-[#6E3F8C] focus-visible:ring-[#6E3F8C]",
        danger:
          "bg-[#C0392B] hover:bg-[#A93226] active:bg-[#922B21] text-white shadow-[0_4px_16px_rgba(192,57,43,0.25)] focus-visible:ring-[#C0392B]",
        clinical:
          "bg-[#134E54] hover:bg-[#0C363A] text-white shadow-[0_4px_16px_rgba(19,78,84,0.2)] focus-visible:ring-[#134E54]",
      },
      size: {
        sm: "h-10 px-4 text-sm rounded-xl min-h-[40px]",
        md: "h-12 px-6 text-base rounded-2xl min-h-[48px]", // mínimo touch target 48px
        lg: "h-14 px-8 text-lg rounded-2xl min-h-[56px]", // alvo primário 56px
        icon: "h-12 w-12 rounded-2xl min-h-[48px] min-w-[48px] p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex items-center">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon ? (
          <span className="ml-2 inline-flex items-center">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
