"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Badge,
  MedicationCard,
  MiniCalendar,
  BottomNav,
} from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient, mockDailyHabits } from "../../mocks/fixtures";
import { useMedicationTrail } from "../../lib/useMedicationTrail";
import { medicationTrailProps } from "../../lib/caregiver";
import { AppMode, HabitItem } from "../../lib/types";
import { GlassWater, Check } from "lucide-react";

export default function RemediosPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const { meds, activeCaregiver, setActiveCaregiver, toggle, verify } =
    useMedicationTrail();
  const [selectedDay, setSelectedDay] = React.useState(14);
  const [waterCups, setWaterCups] = React.useState(5);
  const totalWaterCups = 8;
  const [habits, setHabits] = React.useState<HabitItem[]>(mockDailyHabits);

  const handleCupClick = (index: number) => {
    const targetCups = index + 1;
    if (waterCups === targetCups) {
      setWaterCups(index);
      return;
    }
    setWaterCups(targetCups);
  };

  const handleDrinkOne = () => {
    if (waterCups >= totalWaterCups) return;
    setWaterCups((c) => c + 1);
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const readOnly = mode === "crianca";

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        onCaregiverChange={setActiveCaregiver}
      />

      <div className="px-4 py-4 pb-28 space-y-5">
        {/* 1. Medicamentos de Hoje (3 essenciais: manhã, tarde e noite) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-extrabold text-[#1F2340]">
              Remédios de Hoje
            </h2>
            <Badge variant="plum">
              {meds.filter((m) => m.taken).length}/{meds.length} doses
            </Badge>
          </div>

          <div className="space-y-3">
            {meds.map((med) => (
              <MedicationCard
                key={med.id}
                id={med.id}
                name={med.name}
                dosage={med.dosage}
                time={med.time}
                instructions={med.instructions}
                taken={med.taken}
                onToggleTaken={toggle}
                onVerify={verify}
                readOnly={readOnly}
                {...medicationTrailProps(med, activeCaregiver)}
              />
            ))}
          </div>
        </section>

        {/* 2. Hábitos Simples do Dia (3 itens + copos de água) */}
        <section>
          <h3 className="text-base font-extrabold text-[#1F2340] mb-2.5">
            Hábitos do Dia
          </h3>

          <Card className="p-4 mb-3 bg-gradient-to-br from-white to-[#F0F8FA] border-[#134E54]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GlassWater className="w-4 h-4 text-[#134E54]" />
                <span className="font-bold text-xs text-[#1F2340]">
                  Água · {waterCups}/{totalWaterCups} copos
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#134E54]">
                {waterCups * 250} ml
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 my-2.5">
              {Array.from({ length: totalWaterCups }).map((_, i) => {
                const isFilled = i < waterCups;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCupClick(i)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
                      isFilled
                        ? "bg-[#134E54] text-white"
                        : "bg-white text-[#8C9BAE] border border-[#D5E4E8]"
                    }`}
                    aria-label={`Copo ${i + 1} de ${totalWaterCups}`}
                  >
                    <GlassWater className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={waterCups >= totalWaterCups}
              onClick={handleDrinkOne}
            >
              {waterCups >= totalWaterCups
                ? "Meta concluída 🎉"
                : "+ Beber 1 copo (250 ml)"}
            </Button>
          </Card>

          <div className="space-y-2">
            {habits.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => toggleHabit(h.id)}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  h.done
                    ? "bg-[#E5F4EC]/50 border-[#2E7D5B]/30"
                    : "bg-white border-[#F1E4D6]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg" aria-hidden="true">
                    {h.emoji}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F2340]">
                      {h.label}
                    </p>
                    <p className="text-[11px] text-[#5B5F7A]">{h.detail}</p>
                  </div>
                </div>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    h.done
                      ? "bg-[#2E7D5B] text-white"
                      : "border border-[#D5CDBC] text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Agenda Semanal Compacta */}
        <section>
          <h3 className="text-base font-extrabold text-[#1F2340] mb-2.5">
            Agenda da Semana
          </h3>
          <MiniCalendar
            monthName="Outubro"
            year={2026}
            highlightedDays={[
              { day: 14, type: "remedio", label: "Hoje" },
              { day: 22, type: "exame", label: "Hemograma" },
              { day: 24, type: "consulta", label: "Dr. Roberto" },
            ]}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </section>
      </div>

      <BottomNav
        currentTab="remedios"
        mode={mode}
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}

