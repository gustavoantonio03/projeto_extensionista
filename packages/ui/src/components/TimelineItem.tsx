import * as React from "react";
import { cn } from "../cn";

export interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  tag?: string;
  icon?: React.ReactNode;
  isLast?: boolean;
  status?: "done" | "warning" | "info";
  className?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  time,
  title,
  description,
  tag,
  icon,
  isLast = false,
  status = "info",
  className,
}) => {
  return (
    <div className={cn("flex gap-3 sm:gap-4 relative select-none", className)}>
      {!isLast && (
        <span
          className="absolute left-4 top-8 bottom-0 w-0.5 bg-[#F1E4D6] -translate-x-1/2"
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-xs shadow-xs border-2 border-white",
          {
            "bg-[#E5F4EC] text-[#2E7D5B]": status === "done",
            "bg-[#FFF1DA] text-[#9A5B0F]": status === "warning",
            "bg-[#EDE3F5] text-[#6E3F8C]": status === "info",
          }
        )}
      >
        {icon || "•"}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-[#6E3F8C]">{time}</span>
          {tag && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F4F3F1] text-[#5B5F7A]">
              {tag}
            </span>
          )}
        </div>
        <h5 className="font-bold text-sm text-[#1F2340]">{title}</h5>
        <p className="text-xs text-[#5B5F7A] mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
