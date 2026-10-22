import * as React from "react";
import { cn } from "../cn";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export interface CalendarEventDay {
  day: number;
  type?: "consulta" | "remedio" | "exame";
  label?: string;
}

export interface MiniCalendarProps {
  monthName?: string;
  year?: number;
  highlightedDays?: CalendarEventDay[];
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  className?: string;
}

interface WeekDayItem {
  day: number;
  weekday: string;
  isToday?: boolean;
}

const WEEKDAY_NAMES = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  monthName = "Outubro",
  year = 2026,
  highlightedDays = [],
  selectedDay = 14,
  onSelectDay,
  className,
}) => {
  // Gera uma faixa de 7 dias baseada no dia selecionado ou offset
  const [weekOffset, setWeekOffset] = React.useState(0);

  // Calcula os 7 dias da faixa atual (offset desloca em blocos de 7 dias)
  const currentWeekDays: WeekDayItem[] = React.useMemo(() => {
    // Tomamos o dia 14 como referência central ("Hoje" na narrativa)
    const baseDay = 14 + weekOffset * 7;
    // Cria 7 dias centralizados (de baseDay - 3 até baseDay + 3)
    return Array.from({ length: 7 }, (_, i) => {
      const dayNum = baseDay - 3 + i;
      // Garante intervalo válido de dias no mês (1 a 31)
      const clampedDay = Math.max(1, Math.min(31, dayNum));
      // Mapeamento de dia da semana simulado
      const weekdayIndex = (clampedDay + 2) % 7;
      return {
        day: clampedDay,
        weekday: WEEKDAY_NAMES[weekdayIndex] ?? "SEG",
        isToday: clampedDay === 14,
      };
    });
  }, [weekOffset]);

  const activeDayEvents = highlightedDays.filter(
    (h) => h.day === selectedDay
  );

  return (
    <div
      className={cn(
        "p-4 rounded-[28px] bg-white border border-[#F1E4D6] shadow-[0_6px_20px_rgba(110,63,140,0.05)]",
        className
      )}
    >
      {/* Cabeçalho da Faixa Semanal */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#EDE3F5] text-[#6E3F8C] flex items-center justify-center">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1F2340] leading-none">
              {monthName} <span className="font-normal text-xs text-[#5B5F7A]">{year}</span>
            </h4>
            <p className="text-[10px] text-[#5B5F7A] mt-0.5 font-medium">
              Faixa Semanal Dinâmica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="w-7 h-7 rounded-xl bg-[#F4F3F1] text-[#1F2340] hover:bg-[#EDE3F5] hover:text-[#6E3F8C] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="w-7 h-7 rounded-xl bg-[#F4F3F1] text-[#1F2340] hover:bg-[#EDE3F5] hover:text-[#6E3F8C] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Próxima semana"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Faixa Horizontal de Dias (Week Strip) */}
      <div className="grid grid-cols-7 gap-1.5" role="listbox" aria-label="Dias da semana">
        {currentWeekDays.map((item) => {
          const isSelected = selectedDay === item.day;
          const eventsOnDay = highlightedDays.filter((h) => h.day === item.day);
          const hasEvents = eventsOnDay.length > 0;

          return (
            <button
              key={`${item.weekday}-${item.day}`}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelectDay?.(item.day)}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all cursor-pointer relative select-none",
                isSelected
                  ? "bg-[#6E3F8C] text-white shadow-md scale-105"
                  : "bg-[#FFF8F0]/70 hover:bg-[#EDE3F5]/40 text-[#1F2340] border border-[#F1E4D6]/50"
              )}
            >
              {/* Dia da semana */}
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider mb-1",
                  isSelected ? "text-white/80" : "text-[#5B5F7A]"
                )}
              >
                {item.weekday}
              </span>

              {/* Número do dia */}
              <span
                className={cn(
                  "text-sm font-extrabold leading-none",
                  isSelected ? "text-white" : "text-[#1F2340]"
                )}
              >
                {item.day}
              </span>

              {/* Indicadores de Eventos / Medicações */}
              <div className="flex gap-0.5 mt-1.5 h-1.5 items-center justify-center">
                {hasEvents ? (
                  eventsOnDay.slice(0, 2).map((ev, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected
                          ? "bg-[#F9C98F]"
                          : ev.type === "exame"
                          ? "bg-[#F08A5D]"
                          : ev.type === "consulta"
                          ? "bg-[#134E54]"
                          : "bg-[#6E3F8C]"
                      )}
                    />
                  ))
                ) : (
                  <span className="w-1.5 h-1.5 opacity-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Resumo do dia selecionado */}
      <div className="mt-3 pt-2.5 border-t border-[#F1E4D6]/70 flex items-center justify-between text-xs">
        <span className="text-[#5B5F7A] font-medium">
          Dia {selectedDay} de {monthName}
        </span>
        {activeDayEvents.length > 0 ? (
          <span className="font-bold text-[#6E3F8C] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#6E3F8C]" />
            {activeDayEvents.map((e) => e.label || "Evento").join(" • ")}
          </span>
        ) : (
          <span className="text-[#5B5F7A]/80 italic text-[11px]">
            Sem procedimentos agendados
          </span>
        )}
      </div>
    </div>
  );
};
