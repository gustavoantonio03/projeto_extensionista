import * as React from "react";
import { cn } from "../cn";
import { Check } from "lucide-react";

export type MoodValue = "bem" | "mais-ou-menos" | "apoio";

export interface MoodOptionData {
  value: MoodValue;
  emoji: string;
  title: string;
  subtitle: string;
  color: "success" | "plum" | "danger";
}

export const defaultMoodOptions: MoodOptionData[] = [
  {
    value: "bem",
    emoji: "😊",
    title: "Estou Bem",
    subtitle: "Com apetite e disposição",
    color: "success",
  },
  {
    value: "mais-ou-menos",
    emoji: "😐",
    title: "Mais ou Menos",
    subtitle: "Um pouco de sono ou moleza",
    color: "plum",
  },
  {
    value: "apoio",
    emoji: "😞",
    title: "Preciso de Apoio",
    subtitle: "Sinto dor, incômodo ou tristeza",
    color: "danger",
  },
];

export interface MoodPickerProps {
  value?: MoodValue;
  onChange: (value: MoodValue) => void;
  options?: MoodOptionData[];
  className?: string;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({
  value,
  onChange,
  options = defaultMoodOptions,
  className,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Como você está agora?"
      className={cn("flex flex-col gap-3 w-full", className)}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-between p-4 rounded-[24px] border-2 transition-all duration-200 cursor-pointer min-h-[64px] text-left select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C]",
              isSelected
                ? "bg-white border-[#6E3F8C] shadow-[0_6px_20px_rgba(110,63,140,0.12)] scale-[1.01]"
                : "bg-white/80 border-[#F1E4D6] hover:bg-white hover:border-[#6E3F8C]/40"
            )}
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shadow-xs",
                  {
                    "bg-[#E5F4EC]": opt.color === "success",
                    "bg-[#EDE3F5]": opt.color === "plum",
                    "bg-[#FDECEA]": opt.color === "danger",
                  }
                )}
                aria-hidden="true"
              >
                {opt.emoji}
              </span>
              <div>
                <p className="font-bold text-[#1F2340] text-base">{opt.title}</p>
                <p className="text-xs text-[#5B5F7A] font-medium">{opt.subtitle}</p>
              </div>
            </div>
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-colors border",
                isSelected
                  ? "bg-[#6E3F8C] border-[#6E3F8C] text-white"
                  : "bg-[#F4F3F1] border-[#E3E2E0] text-transparent"
              )}
            >
              <Check className="w-4 h-4" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
