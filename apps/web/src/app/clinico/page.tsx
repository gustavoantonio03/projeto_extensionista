"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Badge,
  TimelineItem,
  StatCard,
  BottomNav,
} from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient } from "../../mocks/fixtures";
import { getClinicalTimeline } from "../../lib/data";
import { ClinicalEvent, AppMode } from "../../lib/types";
import {
  Activity,
  FileDown,
  CalendarDays,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export default function ClinicoPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [timeline, setTimeline] = React.useState<ClinicalEvent[]>([]);

  React.useEffect(() => {
    getClinicalTimeline().then(setTimeline);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        title="Painel Clínico"
        subtitle="Acompanhamento conjunto equipe e família"
      />

      <div className="px-4 py-5 space-y-5">
        {/* Card de Identificação Clínica */}
        <Card className="p-5 border-[#134E54]/20 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#FAEBD6]">
              <img
                src={mockPatient.avatarUrl}
                alt={mockPatient.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#1F2340]">
                  {mockPatient.name}
                </h3>
                <Badge variant="clinical">Estável</Badge>
              </div>
              <p className="text-xs text-[#5B5F7A] mt-0.5">
                {mockPatient.age} • {mockPatient.treatmentCycle}
              </p>
              <p className="text-[11px] font-semibold text-[#134E54] mt-1 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" />
                {mockPatient.hospital}
              </p>
            </div>
          </div>
        </Card>

        {/* Estatísticas de Crescimento e Peso (da referência visual) */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-[#1F2340]">
              Evolução Física
            </h3>
            <span className="text-xs font-semibold text-[#5B5F7A]">
              Atualizado há 2 dias
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Peso Corporal"
              value="21.4"
              unit="kg"
              trend="up"
              trendLabel="+300g neste ciclo"
            />
            <StatCard
              label="Estatura / Altura"
              value="118"
              unit="cm"
              trend="up"
              trendLabel="Curva de crescimento OK"
            />
          </div>
        </section>

        {/* Gatilhos e Alertas Vivos */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2340] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#6E3F8C]" />
              Gatilhos e Alertas Vivos
            </h3>
            <Badge variant="plum">2 Recentes</Badge>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-[#EDE3F5]/60 border-[#6E3F8C]/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-[#6E3F8C]">
                      Acolhimento Familiar
                    </h5>
                    <span className="text-[10px] text-[#5B5F7A]">Hoje às 12:42</span>
                  </div>
                  <p className="text-xs text-[#1F2340] mt-1 leading-relaxed">
                    Check-in matinal registrou leve cansaço pós-almoço. 2 mensagens de carinho foram enviadas pela família.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-[#E5F4EC]/60 border-[#2E7D5B]/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌡️</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-[#2E7D5B]">
                      Monitoramento Térmico Normal
                    </h5>
                    <span className="text-[10px] text-[#5B5F7A]">Hoje às 08:00</span>
                  </div>
                  <p className="text-xs text-[#1F2340] mt-1 leading-relaxed">
                    Temperatura axilar em 36.5°C. Ausência de febre neutropênica no pico do 12º dia pós-infusão.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Linha do Tempo Clínica */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2340]">
              Linha do Tempo de Cuidados
            </h3>
            <span className="text-xs font-semibold text-[#6E3F8C]">Hoje</span>
          </div>

          <Card className="p-5">
            {timeline.map((evt, idx) => (
              <TimelineItem
                key={evt.id}
                time={evt.time}
                title={evt.title}
                description={evt.description}
                tag={evt.tag}
                status={evt.status}
                isLast={idx === timeline.length - 1}
              />
            ))}
          </Card>
        </section>

        {/* Ações Rápidas Clínicas */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            leftIcon={<CalendarDays className="w-4 h-4" />}
            onClick={() => router.push("/remedios")}
          >
            Ajustar Prescrição & Consultas
          </Button>

          <Button
            variant="soft"
            size="md"
            fullWidth
            leftIcon={<FileDown className="w-4 h-4" />}
            onClick={() => alert("Relatório clínico exportado para impressão!")}
          >
            Exportar Linha do Tempo em PDF
          </Button>
        </div>

        {/* Conformidade e LGPD (dados de saúde de menores protegidos) */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E4D6] flex items-center gap-2 text-xs text-[#5B5F7A]">
          <ShieldCheck className="w-4 h-4 text-[#2E7D5B] shrink-0" />
          <span>
            Dados sob sigilo médico e conformidade LGPD (Art. 11 e Art. 14).
          </span>
        </div>
      </div>

      <BottomNav
        currentTab="clinico"
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}
