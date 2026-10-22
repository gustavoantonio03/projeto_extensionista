"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, BottomNav } from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient, mockSuggestedMeals } from "../../mocks/fixtures";
import { AppMode, AuditEntry, NutritionRecommendation } from "../../lib/types";
import { getNutritionRecommendations, registerMeal } from "../../lib/data";
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
    text: "Use talheres de plástico ou bambu e chupe um picolé de limão antes de comer.",
  },
  {
    id: "sem-gosto",
    title: "Sem gosto",
    icon: "🍋",
    text: "Tempere com ervas (manjericão, hortelã) e umas gotinhas de limão.",
  },
  {
    id: "cheiro-forte",
    title: "Cheiro forte",
    icon: "💨",
    text: "Sirva a comida em temperatura ambiente ou fria: cheira menos e enjoa menos.",
  },
];

export default function NutricaoPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [mealStatus, setMealStatus] = React.useState<MealStatus | undefined>();
  const [mealEntry, setMealEntry] = React.useState<AuditEntry | null>(null);
  const [selectedTip, setSelectedTip] = React.useState<string>("metalico");
  const [recommendations, setRecommendations] = React.useState<
    NutritionRecommendation[]
  >([]);

  React.useEffect(() => {
    getNutritionRecommendations().then(setRecommendations);
  }, []);

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
        title="Nutrição"
        subtitle="Cada colherada é uma vitória"
      />

      <div className="px-4 py-5 pb-28 space-y-6">
        {/* Registro da refeição, sem culpa */}
        <section>
          <h2 className="text-base font-bold text-[#1F2340] mb-0.5">
            Como foi a refeição da {mockPatient.preferredName}?
          </h2>
          <p className="text-xs text-[#5B5F7A] mb-3">Toque em uma opção. Sem pressão.</p>

          <div className="grid grid-cols-1 gap-2.5">
            {MEAL_OPTIONS.map((opt) => {
              const isActive = mealStatus === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectMealStatus(opt.id)}
                  aria-pressed={isActive}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? `${opt.active} font-bold shadow-sm`
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
              className="mt-3 text-xs font-bold text-[#1F2340] bg-[#E5F4EC] border border-[#2E7D5B]/25 rounded-xl px-3 py-2 leading-snug"
            >
              ✅ {caregiverTag(mealEntry.performedBy)} registrou a refeição às{" "}
              {mealEntry.performedAt}
            </p>
          )}
        </section>

        {/* Orientação da equipe de nutrição (vem de /medico/prescricao) */}
        {recommendations.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1F2340]">
                Orientação da nutrição
              </h3>
              <Badge variant="clinical">{recommendations.length} ativas</Badge>
            </div>
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="p-4 bg-[#E6EFF0]/60 border-[#134E54]/20 shadow-xs"
              >
                <h4 className="text-sm font-bold text-[#134E54]">🥗 {rec.title}</h4>
                <p className="text-xs text-[#1F2340] mt-1 leading-relaxed">
                  {rec.text}
                </p>
              </Card>
            ))}
          </section>
        )}

        {/* Cardápio suave */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-[#1F2340]">Cardápio suave</h3>
            <Badge variant="clinical">Fácil digestão</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {mockSuggestedMeals.map((meal) => (
              <Card key={meal.id} className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="plum">{meal.tag}</Badge>
                  <span className="text-xs font-bold text-[#5B5F7A]">
                    {meal.calories} kcal
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#1F2340]">{meal.title}</h4>
                <p className="text-xs text-[#5B5F7A] mt-1 leading-relaxed">
                  {meal.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas rápidas de paladar */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-2">
            Sentindo a boca diferente?
          </h3>
          <div
            className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
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
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTip === t.id
                    ? "bg-[#6E3F8C] text-white shadow-sm"
                    : "bg-white text-[#5B5F7A] border border-[#F1E4D6] hover:bg-[#FFF8F0]"
                }`}
              >
                <span aria-hidden="true">{t.icon}</span>
                <span>{t.title}</span>
              </button>
            ))}
          </div>
          {tip && (
            <Card className="p-4 bg-[#EDE3F5]/60 border-[#6E3F8C]/30">
              <p className="text-xs text-[#1F2340] leading-relaxed">
                💡 {tip.text}
              </p>
            </Card>
          )}
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
