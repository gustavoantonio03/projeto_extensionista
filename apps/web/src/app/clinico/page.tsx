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
import {
  getClinicalTimeline,
  getAuditTrail,
  getMedicationLogs,
  getActiveCaregiver,
  verifyAuditEntry,
} from "../../lib/data";
import { caregiverTag } from "../../lib/caregiver";
import {
  ClinicalEvent,
  AppMode,
  AuditEntry,
  MedicationLog,
  CaregiverProfile,
} from "../../lib/types";
import {
  Activity,
  CheckCheck,
  Clock,
  Hourglass,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  GlassWater,
  FileDown,
  CalendarDays,
} from "lucide-react";

export default function ClinicoPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [activeCaregiver, setActiveCaregiver] =
    React.useState<CaregiverProfile | null>(null);
  const [timeline, setTimeline] = React.useState<ClinicalEvent[]>([]);
  const [auditTrail, setAuditTrail] = React.useState<AuditEntry[]>([]);
  const [medLogs, setMedLogs] = React.useState<MedicationLog[]>([]);
  const [justVerifiedId, setJustVerifiedId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    const [t, a, m, c] = await Promise.all([
      getClinicalTimeline(),
      getAuditTrail(),
      getMedicationLogs(),
      getActiveCaregiver(),
    ]);
    setTimeline(t);
    setAuditTrail(a);
    setMedLogs(m);
    setActiveCaregiver(c);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVerifyEntry = async (entryId: string) => {
    if (!activeCaregiver) return;
    const result = await verifyAuditEntry(entryId, activeCaregiver.id);
    if (result) {
      setJustVerifiedId(entryId);
      setTimeout(() => setJustVerifiedId(null), 3000);
      await loadData();
    }
  };

  // Separa as ações pendentes de conferência cruzada
  const pendingEntries = auditTrail.filter(
    (e) => e.verificationStatus === "pendente"
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        onCaregiverChange={(cg) => {
          setActiveCaregiver(cg);
          loadData();
        }}
        title="Dashboard do Cuidador"
        subtitle="Acompanhamento conjunto equipe e família"
      />

      {mode === "crianca" ? (
        <div className="px-4 py-12 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#EDE3F5] text-3xl flex items-center justify-center mx-auto shadow-xs">
            🔒
          </div>
          <h2 className="text-base font-bold text-[#1F2340]">
            Área Exclusiva dos Adultos
          </h2>
          <p className="text-xs text-[#5B5F7A] max-w-xs mx-auto leading-relaxed">
            Aqui ficam guardados os relatórios médicos, conferência de remédios e
            dados dos cuidadores. Que tal voltar para o Meu Dia para registrar como
            você está?
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/")}
            className="mt-2"
          >
            Voltar para Meu Dia 🌱
          </Button>
        </div>
      ) : (
        <div className="px-4 py-5 pb-28 space-y-5">
          {/* Alerta de Pendências de Conferência (Dupla Checagem) */}
          <section aria-label="Pendências de Dupla Checagem">
            {pendingEntries.length > 0 ? (
              <div className="rounded-3xl bg-gradient-to-br from-[#FFF1DA] to-[#FDE6CF] p-4 border border-[#9A5B0F]/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9A5B0F] animate-ping" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A5B0F] flex items-center gap-1.5">
                      <Hourglass className="w-3.5 h-3.5" />
                      Pendência de Conferência Cruzada ({pendingEntries.length})
                    </h3>
                  </div>
                  <Badge variant="warning">Dupla Checagem</Badge>
                </div>

                <p className="text-xs text-[#1F2340] leading-snug">
                  Outro cuidador registrou uma ação crítica. Valide abaixo para
                  garantir a segurança no tratamento da {mockPatient.preferredName}:
                </p>

                <div className="space-y-2">
                  {pendingEntries.map((entry) => {
                    const isAuthor =
                      activeCaregiver && entry.performedBy.id === activeCaregiver.id;
                    return (
                      <div
                        key={entry.id}
                        className="p-3 rounded-2xl bg-white border border-[#F1E4D6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#1F2340] leading-snug">
                            {entry.description}
                          </p>
                          <p className="text-[10px] text-[#5B5F7A] mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Registrado às{" "}
                            {entry.performedAt} por {caregiverTag(entry.performedBy)}
                          </p>
                        </div>

                        {isAuthor ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9A5B0F] bg-[#FFF1DA] px-2.5 py-1 rounded-xl self-start sm:self-auto">
                            <Hourglass className="w-3 h-3" /> Aguardando outro
                            cuidador
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleVerifyEntry(entry.id)}
                            leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
                            className="shrink-0 font-bold text-xs"
                          >
                            Conferir agora (1 toque)
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#E5F4EC] border border-[#2E7D5B]/30 flex items-center gap-2.5 text-xs text-[#2E7D5B] font-bold">
                <CheckCheck className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>
                  Todas as ações recentes foram conferidas e validadas pelos
                  cuidadores!
                </span>
              </div>
            )}
          </section>

          {justVerifiedId && (
            <div
              role="status"
              className="p-3 rounded-2xl bg-[#E5F4EC] border border-[#2E7D5B]/30 text-xs font-bold text-[#2E7D5B] animate-in fade-in zoom-in-95"
            >
              🎉 Registro conferido com sucesso por{" "}
              {activeCaregiver ? caregiverTag(activeCaregiver) : "você"}!
            </div>
          )}

          {/* Card de Identificação Clínica */}
          <Card className="p-5 border-[#134E54]/20 bg-white shadow-xs">
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

          {/* Indicadores Clínicos Essenciais (Visão Limpa) */}
          <section aria-label="Indicadores Clínicos">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-base font-bold text-[#1F2340]">
                Indicadores de Saúde de Hoje
              </h3>
              <span className="text-xs font-bold text-[#6E3F8C] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Tempo Real
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Temperatura"
                value="36.5"
                unit="°C"
                trend="stable"
                trendLabel="Sem febre • Estável"
                icon={<Thermometer className="w-4 h-4 text-[#2E7D5B]" />}
              />
              <StatCard
                label="Hidratação"
                value="1.250"
                unit="ml"
                trend="up"
                trendLabel="5 de 8 copos (62%)"
                icon={<GlassWater className="w-4 h-4 text-[#134E54]" />}
              />
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

          {/* Resumo de Auditoria Familiar (Ações em Tempo Real) */}
          <section aria-label="Resumo de Auditoria Familiar">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-[#1F2340]">
                  Trilha de Auditoria Familiar
                </h3>
                <p className="text-[11px] text-[#5B5F7A]">
                  Rastreabilidade com autor, horário e dupla checagem
                </p>
              </div>
              <Badge variant="plum">
                {auditTrail.length} ações • {medLogs.length} doses no log
              </Badge>
            </div>

            <div className="space-y-2.5">
              {auditTrail.slice(0, 6).map((entry) => {
                const isConferido = entry.verificationStatus === "conferido";
                const isPendente = entry.verificationStatus === "pendente";

                return (
                  <Card key={entry.id} className="p-3.5 bg-white border-[#F1E4D6]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg leading-none mt-0.5" aria-hidden="true">
                          {entry.action === "administrou_medicamento"
                            ? "💊"
                            : entry.action === "registrou_sintoma"
                            ? "🌡️"
                            : entry.action === "registrou_refeicao"
                            ? "🍽️"
                            : "✓"}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#1F2340] leading-snug">
                            {entry.description}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#5B5F7A]">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {entry.performedAt}
                            </span>
                            <span>•</span>
                            <span>Por {caregiverTag(entry.performedBy)}</span>
                          </div>
                        </div>
                      </div>

                      {isConferido ? (
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F4EC] text-[#2E7D5B] flex items-center gap-1 border border-[#2E7D5B]/20">
                          <CheckCheck className="w-3 h-3" /> Conferido
                        </span>
                      ) : isPendente ? (
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1DA] text-[#9A5B0F] flex items-center gap-1 border border-[#9A5B0F]/20">
                          <Hourglass className="w-3 h-3" /> Pendente
                        </span>
                      ) : null}
                    </div>

                    {isConferido && entry.verifiedBy && (
                      <p className="mt-2 pt-2 border-t border-[#F1E4D6]/70 text-[10px] font-medium text-[#134E54] flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-[#2E7D5B]" />
                        Conferido por {caregiverTag(entry.verifiedBy)}
                        {entry.verifiedAt ? ` às ${entry.verifiedAt}` : ""}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Linha do Tempo Clínica (Eventos Hospitalares / Equipe) */}
          <section aria-label="Linha do Tempo Clínica">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#1F2340]">
                Linha do Tempo de Cuidados
              </h3>
              <span className="text-xs font-semibold text-[#6E3F8C]">Hoje</span>
            </div>

            <Card className="p-5">
              {timeline.slice(0, 5).map((evt, idx) => (
                <TimelineItem
                  key={evt.id}
                  time={evt.time}
                  title={evt.title}
                  description={evt.description}
                  tag={evt.tag}
                  status={evt.status}
                  isLast={idx === Math.min(timeline.length - 1, 4)}
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
      )}

      <BottomNav
        currentTab="clinico"
        mode={mode}
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}
