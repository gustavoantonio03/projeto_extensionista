import * as React from "react";
import { cn } from "../cn";

export interface DecorBlobProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: "leaf" | "circle" | "cloud" | "wave";
  color?: "peach" | "lavender" | "plum" | "orange";
}

export const DecorBlob: React.FC<DecorBlobProps> = ({
  className,
  variant = "leaf",
  color = "peach",
  ...props
}) => {
  const fillColor = {
    peach: "#FDE6CF",
    lavender: "#EDE6F6",
    plum: "#F6F0FA",
    orange: "#F9C98F",
  }[color];

  if (variant === "leaf") {
    return (
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={cn("pointer-events-none select-none", className)}
        {...props}
      >
        <path
          d="M10,90 Q15,40 50,15 Q85,40 90,90 Q50,75 10,90 Z"
          fill={fillColor}
        />
      </svg>
    );
  }

  if (variant === "cloud") {
    return (
      <svg
        viewBox="0 0 120 60"
        aria-hidden="true"
        className={cn("pointer-events-none select-none", className)}
        {...props}
      >
        <path
          d="M20,45 A15,15 0 0,1 35,25 A25,25 0 0,1 75,20 A20,20 0 0,1 100,45 Z"
          fill={fillColor}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    >
      <circle cx="50" cy="50" r="45" fill={fillColor} />
    </svg>
  );
};
