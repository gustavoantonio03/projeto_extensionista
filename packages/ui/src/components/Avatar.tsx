import * as React from "react";
import { cn } from "../cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "away" | "offline";
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  status,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-2xl",
  }[size];

  const statusSize = {
    sm: "h-2.5 w-2.5",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
    xl: "h-5 w-5",
  }[size];

  return (
    <div className={cn("relative inline-block select-none", className)} {...props}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold overflow-hidden bg-[#FDE6CF] text-[#6E3F8C] border-2 border-white shadow-sm",
          sizeClasses
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            statusSize,
            {
              "bg-[#2E7D5B]": status === "online",
              "bg-[#9A5B0F]": status === "away",
              "bg-[#5B5F7A]": status === "offline",
            }
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};
