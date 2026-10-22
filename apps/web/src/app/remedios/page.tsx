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
import { mockPatient } from "../../mocks/fixtures";
import { useMedicationTrail } from "../../lib/useMedicationTrail";
import {
  medicationCategoryLabel,
  medicationTrailProps,
} from "../../lib/caregiver";
import { AppMode } from "../../lib/types";
import { GlassWater, Calendar, Moon, Footprints, Sparkles } from "lucide-react";

export default function RemediosPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const { meds, activeCaregiver, setActiveCaregiver, toggle, verify } =
    useMedicationTrail();
  const [selectedDay, setSelectedDay] = React.useState(14);
  const [waterCups, setWaterCups] = React.useState(5);
  const totalWaterCups = 8;
  const [showCelebration, setShowCelebration] = React.useState(false);

  const celebrateIfFull = (cups: number) => {
    if (cups === totalWaterCups) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    }
  };

  const handleCupClick = (index: number) => {
    const targetCups = index + 1;
    // Se clicou no último copo preenchido, desmarca 1
    if (waterCups === targetCups) {
      setWaterCups(index);
      return;
    }
    setWaterCups(targetCups);
    celebrateIfFull(targetCups);
  };

  /** Botão "+ Beber 1 copo": só avança (nunca desmarca) e para na meta. */
  const handleDrinkOne = () => {
    if (waterCups >= totalWaterCups) return;
    const next = waterCups + 1;
    setWaterCups(next);
    celebrateIfFull(next);
  };

  const readOnly = mode === "crianca";
  const nextMed = meds.find((m) => !m.taken);
  const otherMeds = meds.filter((m) => m.id !== nextMed?.id);
  const pendingVerification = meds.filter(
    (m) => m.taken && m.verificationStatus === "pendente"
  ).length;

  const renderCard = (med: (typeof meds)[number]) => (
    <MedicationCard
      key={med.id}
      id={med.id}
      name={med.name}
      dosage={med.dosage}
      time={med.time}
      instructions={med.instructions}
      taken={med.taken}
      category={medicationCategoryLabel(med.category)}
      onToggleTaken={toggle}
      onVerify={verify}
      readOnly={readOnly}
      {...medicationTrailProps(med, activeCaregiver)}
      onAudioPlay={() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        const u = new SpeechSynthesisUtterance(med.instructions);
        u.lang = "pt-BR";
        window.speechSynthesis.speak(u);
      }}
    />
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        onCaregiverChange={setActiveCaregiver}
        title="Remédios & Rotina"
        subtitle="Alarmes pontuais e seguros"
      />

      <div className="px-4 py-5 pb-28 space-y-5">
        {/* Banner de Sincronização */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#E5F4EC] border border-[#2E7D5B]/30">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div>
              <p className="font-bold text-xs text-[#2E7D5B]">Alarmes Ativos</p>
              <p className="text-[11px] text-[#1F2340]">
                Avisos sonoros e confirmação simultânea para a família
              </p>
            </div>
          </div>
          <Badge variant="success">100% Sincronizado</Badge>
        </div>

        {/* Aviso de conferência pendente (dupla checagem entre cuidadores) */}
        {pendingVerification > 0 && !readOnly && (
          <div
            role="status"
            className="p-3 rounded-2xl bg-[#FFF1DA] border border-[#9A5B0F]/25 text-xs font-bold text-[#9A5B0F]"
          >
            ⏳ {pendingVerification}{" "}
            {pendingVerification === 1
              ? "dose aguardando conferência"
              : "doses aguardando conferência"}{" "}
            de outro cuidador.
          </div>
        )}

        {/* Dose Próxima em Destaque */}
        {nextMed ? (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] animate-ping" />
              <h3 className="text-sm font-bold text-[#C0392B] uppercase tracking-wider">
                Dose Próxima • {nextMed.time}
              </h3>
            </div>
            {renderCard(nextMed)}
          </section>
        ) : (
          <Card className="text-center p-6 bg-[#E5F4EC]/60 border-[#2E7D5B]/30">
            <p className="text-3xl mb-2">🎉</p>
            <h4 className="font-bold text-base text-[#2E7D5B]">
              Todos os remédios de hoje foram tomados!
            </h4>
            <p className="text-xs text-[#5B5F7A] mt-1">
              Parabéns pelo cuidado e pontualidade.
            </p>
          </Card>
        )}

        {/* Outros Medicamentos do Dia */}
        {otherMeds.length > 0 && (
          <section>
            <h3 className="text-base font-bold text-[#1F2340] mb-3">
              Outros Medicamentos de Hoje
            </h3>
            <div className="space-y-3">{otherMeds.map((med) => renderCard(med))}</div>
          </section>
        )}

        {/* Calendário Semanal e Próximas Consultas/Exames */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2340]">
              Agenda do Tratamento
            </h3>
            <span className="text-xs font-bold text-[#6E3F8C] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Outubro
            </span>
          </div>

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

        {/* Hábitos e Conforto Diário (Hidratação, Caminhada, Sono) */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-3">
            Hábitos e Conforto Diário
          </h3>
          <div className="space-y-3">
            {/* Hidratação Cuidadosa com Copos de Água Interativos */}
            <Card className="p-4 bg-gradient-to-br from-white to-[#F0F8FA] border-[#134E54]/20 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-2xl bg-[#E6EFF0] text-[#134E54] shadow-2xs">
                    <GlassWater className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1F2340] flex items-center gap-1">
                      <span>Hidratação Cuidadosa</span>
                      {waterCups >= totalWaterCups && (
                        <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" /> Meta batida!
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-[#5B5F7A]">
                      {waterCups} de {totalWaterCups} copos tomados (
                      {(waterCups * 250).toLocaleString()} ml)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#134E54] bg-[#E6EFF0] px-2 py-0.5 rounded-full">
                  {Math.round((waterCups / totalWaterCups) * 100)}%
                </span>
              </div>

              {/* Faixa Interativa de Copos de Água */}
              <div className="grid grid-cols-8 gap-1.5 my-3">
                {Array.from({ length: totalWaterCups }).map((_, i) => {
                  const isFilled = i < waterCups;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCupClick(i)}
                      className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer active:scale-90 ${
                        isFilled
                          ? "bg-gradient-to-t from-[#134E54] to-[#2E8B9A] text-white shadow-xs scale-105"
                          : "bg-white/80 hover:bg-[#E6EFF0] text-[#8C9BAE] border border-[#D5E4E8]"
                      }`}
                      aria-label={`Copo de água ${i + 1} de ${totalWaterCups} ${
                        isFilled ? "tomado" : "pendente"
                      }`}
                    >
                      <GlassWater
                        className={`w-5 h-5 transition-transform ${
                          isFilled ? "stroke-[2.4] fill-white/20" : "stroke-[1.8]"
                        }`}
                      />
                      <span
                        className={`text-[9px] mt-1 font-bold leading-none ${
                          isFilled ? "text-white" : "text-[#5B5F7A]"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {showCelebration && (
                <div className="p-2 mb-2 rounded-xl bg-[#E5F4EC] border border-[#2E7D5B]/30 text-center text-xs font-bold text-[#2E7D5B] animate-in fade-in zoom-in-95">
                  🎉 Parabéns! Meta de 2.000 ml atingida com sucesso!
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                disabled={waterCups >= totalWaterCups}
                leftIcon={<GlassWater className="w-4 h-4 text-[#134E54]" />}
                onClick={handleDrinkOne}
              >
                {waterCups >= totalWaterCups
                  ? "Meta de hoje concluída 🎉"
                  : "+ Beber 1 copo de água agora (250 ml)"}
              </Button>
            </Card>

            {/* Caminhada e Sono */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-[#E5F4EC] text-[#2E7D5B] flex items-center justify-center mx-auto mb-1">
                  <Footprints className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-[#1F2340]">Caminhada Leve</p>
                <p className="text-[10px] text-[#5B5F7A] mt-0.5">15 min no quintal</p>
                <Badge variant="success" className="mt-2 mx-auto">Feito ✓</Badge>
              </Card>

              <Card className="p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-[#EDE3F5] text-[#6E3F8C] flex items-center justify-center mx-auto mb-1">
                  <Moon className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-[#1F2340]">Sono da Noite</p>
                <p className="text-[10px] text-[#5B5F7A] mt-0.5">8 horas tranquilas</p>
                <Badge variant="plum" className="mt-2 mx-auto">Dormiu bem</Badge>
              </Card>
            </div>
          </div>
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
