import * as React from "react";
import { cn } from "../cn";

export interface CalendarEventDay {
  day: number;
  type?: "consulta" | "remedio" | "exame";
  label?: string;
}

export interface MiniCalendarProps {
  monthName: string;
  year?: number;
  highlightedDays?: CalendarEventDay[];
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  className?: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  monthName,
  year = 2026,
  highlightedDays = [],
  selectedDay,
  onSelectDay,
  className,
}) => {
  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];
  // Mock de 31 dias para demonstração
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "p-5 rounded-[28px] bg-white border border-[#F1E4D6] shadow-[0_6px_24px_rgba(110,63,140,0.06)]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg text-[#1F2340]">
          {monthName} <span className="text-sm font-normal text-[#5B5F7A]">{year}</span>
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDE6CF] text-[#B04A26]">
          {highlightedDays.length} eventos
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((d, i) => (
          <span key={i} className="text-xs font-bold text-[#5B5F7A]/80 py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {days.map((d) => {
          const event = highlightedDays.find((h) => h.day === d);
          const isSelected = selectedDay === d;

          return (
            <button
              key={d}
              type="button"
              onClick={() => onSelectDay?.(d)}
              className={cn(
                "h-9 w-9 rounded-full flex flex-col items-center justify-center text-xs font-bold transition-all mx-auto cursor-pointer relative",
                isSelected
                  ? "bg-[#6E3F8C] text-white shadow-sm"
                  : event
                  ? "bg-[#FDE6CF] text-[#B04A26] font-extrabold"
                  : "text-[#1F2340] hover:bg-[#F4F3F1]"
              )}
            >
              <span>{d}</span>
              {event && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#F08A5D]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
