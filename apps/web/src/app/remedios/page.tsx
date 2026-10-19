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
import { getMedications, toggleMedicationTaken } from "../../lib/data";
import { Medication, AppMode } from "../../lib/types";
import { Droplet, Calendar, Plus, Moon, Footprints } from "lucide-react";

export default function RemediosPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [meds, setMeds] = React.useState<Medication[]>([]);
  const [waterCups, setWaterCups] = React.useState(5);
  const totalWaterCups = 8;

  React.useEffect(() => {
    getMedications().then(setMeds);
  }, []);

  const handleToggle = async (id: string, taken: boolean) => {
    const updated = await toggleMedicationTaken(id, taken);
    if (updated) {
      setMeds((prev) => prev.map((m) => (m.id === id ? updated : m)));
    }
  };

  const nextMed = meds.find((m) => !m.taken);
  const otherMeds = meds.filter((m) => m.id !== nextMed?.id);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        title="Remédios & Rotina"
        subtitle="Alarmes pontuais e seguros"
      />

      <div className="px-4 py-5 space-y-5">
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

        {/* Dose Próxima em Destaque */}
        {nextMed ? (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] animate-ping" />
              <h3 className="text-sm font-bold text-[#C0392B] uppercase tracking-wider">
                Dose Próxima • {nextMed.time}
              </h3>
            </div>
            <MedicationCard
              id={nextMed.id}
              name={nextMed.name}
              dosage={nextMed.dosage}
              time={nextMed.time}
              instructions={nextMed.instructions}
              taken={nextMed.taken}
              onToggleTaken={handleToggle}
              category="Prevenir enjoo"
              onAudioPlay={() => {
                const u = new SpeechSynthesisUtterance(nextMed.instructions);
                u.lang = "pt-BR";
                window.speechSynthesis.speak(u);
              }}
            />
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
            <div className="space-y-3">
              {otherMeds.map((med) => (
                <MedicationCard
                  key={med.id}
                  id={med.id}
                  name={med.name}
                  dosage={med.dosage}
                  time={med.time}
                  instructions={med.instructions}
                  taken={med.taken}
                  onToggleTaken={handleToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Calendário Mensal e Próxima Consulta */}
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
            selectedDay={14}
          />
        </section>

        {/* Hábitos e Conforto Diário (Hidratação, Caminhada, Sono) */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-3">
            Hábitos e Conforto Diário
          </h3>
          <div className="space-y-3">
            {/* Hidratação */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#EDE6F6] text-[#6E3F8C]">
                    <Droplet className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1F2340]">
                      Hidratação Cuidadosa
                    </h5>
                    <p className="text-[11px] text-[#5B5F7A]">
                      {waterCups} de {totalWaterCups} copos tomados (
                      {(waterCups * 250).toLocaleString()} ml)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#6E3F8C]">
                  {Math.round((waterCups / totalWaterCups) * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 my-3">
                {Array.from({ length: totalWaterCups }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setWaterCups(i + 1)}
                    className={`flex-1 h-9 rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer ${
                      i < waterCups
                        ? "bg-[#6E3F8C] text-white shadow-xs"
                        : "bg-[#F4F3F1] text-[#5B5F7A]"
                    }`}
                    aria-label={`Copinho ${i + 1}`}
                  >
                    💧
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() =>
                  setWaterCups((w) => Math.min(totalWaterCups, w + 1))
                }
              >
                + Beber 1 copinho agora (250 ml)
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
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}
