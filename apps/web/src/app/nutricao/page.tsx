"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, BottomNav } from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient, mockSuggestedMeals } from "../../mocks/fixtures";
import { AppMode, AuditEntry } from "../../lib/types";
import { registerMeal } from "../../lib/data";
import { caregiverTag } from "../../lib/caregiver";

type MealStatus = "tudo" | "metade" | "enjoo";

const MEAL_OPTIONS: {
  id: MealStatus;
  emoji: string;
  title: string;
  hint: string;
  active: string;
}[] = [
  {
    id: "tudo",
    emoji: "😋",
    title: "Desceu muito bem!",
    hint: "Comeu quase tudo",
    active: "bg-[#E5F4EC] border-[#2E7D5B] text-[#2E7D5B]",
  },
  {
    id: "metade",
    emoji: "🙂",
    title: "Comi a metade",
    hint: "Sem enjoo",
    active: "bg-[#EDE3F5] border-[#6E3F8C] text-[#6E3F8C]",
  },
  {
    id: "enjoo",
    emoji: "🤢",
    title: "Fiquei enjoada",
    hint: "Rejeitou o prato",
    active: "bg-[#FDECEA] border-[#C0392B] text-[#C0392B]",
  },
];

const TIPS = [
  {
    id: "metalico",
    title: "Gosto metálico",
    icon: "🥄",
    text: "Use talheres de plástico ou bambu e picolé de limão antes de comer.",
  },
  {
    id: "sem-gosto",
    title: "Sem gosto",
    icon: "🍋",
    text: "Tempere com ervas frescas (manjericão, hortelã) e gotinhas de limão.",
  },
  {
    id: "cheiro-forte",
    title: "Cheiro forte",
    icon: "💨",
    text: "Sirva em temperatura ambiente ou fria: cheira menos e enjoa menos.",
  },
];

export default function NutricaoPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [mealStatus, setMealStatus] = React.useState<MealStatus | undefined>();
  const [mealEntry, setMealEntry] = React.useState<AuditEntry | null>(null);
  const [selectedTip, setSelectedTip] = React.useState<string>("metalico");

  const handleSelectMealStatus = async (status: MealStatus) => {
    setMealStatus(status);
    setMealEntry(await registerMeal(status));
  };

  const tip = TIPS.find((t) => t.id === selectedTip);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
      />

      <div className="px-4 py-4 pb-28 space-y-5">
        {/* 1. Seletor rápido da refeição */}
        <section>
          <h2 className="text-base font-extrabold text-[#1F2340] mb-2">
            Como foi a refeição da {mockPatient.preferredName}?
          </h2>

          <div className="grid grid-cols-1 gap-2">
            {MEAL_OPTIONS.map((opt) => {
              const isActive = mealStatus === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectMealStatus(opt.id)}
                  aria-pressed={isActive}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? `${opt.active} font-bold shadow-xs`
                      : "bg-white border-[#F1E4D6] hover:bg-[#FFF8F0]"
                  }`}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {opt.emoji}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#1F2340]">
                      {opt.title}
                    </span>
                    <span className="block text-xs text-[#5B5F7A]">{opt.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {mealEntry && (
            <p
              role="status"
              className="mt-2.5 text-xs font-bold text-[#1F2340] bg-[#E5F4EC] border border-[#2E7D5B]/25 rounded-xl px-3 py-1.5 leading-snug"
            >
              ✅ {mealEntry.performedAt} por {caregiverTag(mealEntry.performedBy)}
            </p>
          )}
        </section>

        {/* 2. 3 dicas curtas em pílulas */}
        <section>
          <h3 className="text-base font-extrabold text-[#1F2340] mb-2">
            Dicas rápidas de paladar
          </h3>
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label="Dicas de paladar"
          >
            {TIPS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={selectedTip === t.id}
                onClick={() => setSelectedTip(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTip === t.id
                    ? "bg-[#6E3F8C] text-white"
                    : "bg-white text-[#5B5F7A] border border-[#F1E4D6]"
                }`}
              >
                <span aria-hidden="true">{t.icon}</span>
                <span>{t.title}</span>
              </button>
            ))}
          </div>
          {tip && (
            <Card className="p-3.5 bg-[#EDE3F5]/55 border-[#6E3F8C]/25">
              <p className="text-xs text-[#1F2340] leading-relaxed">
                💡 {tip.text}
              </p>
            </Card>
          )}
        </section>

        {/* 3. Cardápio sugerido do dia */}
        <section>
          <h3 className="text-base font-extrabold text-[#1F2340] mb-2">
            Cardápio Suave do Dia
          </h3>
          <div className="space-y-2.5">
            {mockSuggestedMeals.map((meal) => (
              <Card key={meal.id} className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-[#1F2340]">
                    {meal.title}
                  </h4>
                  <Badge variant="plum">{meal.tag}</Badge>
                </div>
                <p className="text-xs text-[#5B5F7A] leading-relaxed">
                  {meal.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <BottomNav
        currentTab="nutricao"
        mode={mode}
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}

