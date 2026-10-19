"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  LineChart,
  ProgressBar,
  SeverityBadge,
  Tabs,
  TimelineItem,
} from "@siglo/ui";
import { ArrowLeft, Pill, MessagesSquare, Thermometer, ShieldAlert, Phone } from "lucide-react";
import { MedicoShell } from "../../../../components/medico/MedicoShell";
import { AsyncView } from "../../../../components/medico/AsyncView";
import { getMonitoredPatient, getPatient360 } from "../../../../lib/medico-data";
import { useAsync } from "../../../../lib/use-async";
import type { SymptomRecord } from "../../../../lib/types";

const moodLabel: Record<SymptomRecord["mood"], { emoji: string; text: string; variant: "success" | "plum" | "danger" }> = {
  bem: { emoji: "😊", text: "Estou bem", variant: "success" },
  "mais-ou-menos": { emoji: "😐", text: "Mais ou menos", variant: "plum" },
  apoio: { emoji: "😞", text: "Preciso de apoio", variant: "danger" },
};
const partLabel = { cabeca: "Cabeça", garganta: "Garganta", barriga: "Barriga/estômago", bracos: "Braços", pernas: "Pernas e pés" } as const;
const intensityLabel = { pouco: "pouca", medio: "média", forte: "forte" } as const;

const tabs = [
  { id: "resumo", label: "Resumo" },
  { id: "sintomas", label: "Sintomas" },
  { id: "adesao", label: "Adesão" },
  { id: "intercorrencias", label: "Intercorrências" },
];

export default function Paciente360Page() {
  const { id } = useParams<{ id: string }>();
  const state = useAsync(async () => {
    const [patient, detail] = await Promise.all([getMonitoredPatient(id), getPatient360(id)]);
    return { patient, detail };
  }, [id]);
  const [tab, setTab] = React.useState("resumo");

  return (
    <MedicoShell
      title="Visão 360 do paciente"
      subtitle="Prontuário visual com os relatos da família e a evolução do tratamento."
      actions={
        <Link
          href="/medico"
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl text-sm font-bold text-[#6E3F8C] hover:bg-[#EDE3F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar à triagem
        </Link>
      }
    >
      <AsyncView state={state} rows={4}>
        {({ patient, detail }) => {
          if (!patient) {
            return (
              <EmptyState
                title="Paciente não encontrado"
                description="Este paciente não está na sua lista de monitorados."
              />
            );
          }
          const weight = detail.growth.map((g) => ({ label: g.label, value: g.weightKg }));
          const height = detail.growth.map((g) => ({ label: g.label, value: g.heightCm }));
          const febrile = patient.lastTemperature >= 37.8;

          return (
            <div className="space-y-5">
              <Card className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar fallback={patient.preferredName.slice(0, 2).toUpperCase()} src={patient.avatarUrl} alt={patient.name} size="lg" />
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-[#1F2340]">{patient.name}</h2>
                      <SeverityBadge level={patient.severity} />
                    </div>
                    <p className="text-sm text-[#5B5F7A] mt-1">
                      {patient.age} · Leito {patient.bed} · {patient.cycle}
                    </p>
                    <p className="text-sm text-[#1F2340] mt-1 font-semibold">{detail.diagnosis}</p>
                    <p className="text-xs text-[#5B5F7A] mt-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#9A5B0F]" aria-hidden="true" />
                      Alergias: {detail.allergies.join("; ")}
                    </p>
                    <p className="text-xs text-[#5B5F7A] mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      Responsável: {patient.caregiver} · {patient.caregiverPhone}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Link href={`/medico/prescricao?paciente=${patient.id}`}>
                      <Button variant="primary" size="md" fullWidth leftIcon={<Pill className="w-4 h-4" />}>
                        Prescrever / ajustar
                      </Button>
                    </Link>
                    <Link href={`/medico/comunicacao?paciente=${patient.id}`}>
                      <Button variant="soft" size="md" fullWidth leftIcon={<MessagesSquare className="w-4 h-4" />}>
                        Falar com o cuidador
                      </Button>
                    </Link>
                  </div>
                </div>

                {patient.alerts.length > 0 && (
                  <div role="region" aria-label="Alertas ativos" className="mt-4 p-3 rounded-2xl bg-[#FFF1DA] border border-[#9A5B0F]/30">
                    <p className="text-xs font-extrabold text-[#8A520D] mb-1">Alertas ativos</p>
                    <ul className="text-xs text-[#1F2340] space-y-0.5 list-disc pl-4">
                      {patient.alerts.map((a) => (
                        <li key={a.id}>
                          {a.text} ({a.at})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              <Tabs ariaLabel="Seções do prontuário" tabs={tabs} value={tab} onChange={setTab} />

              {tab === "resumo" && (
                <div role="tabpanel" id="panel-resumo" aria-labelledby="tab-resumo" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <h3 className="font-bold text-[#1F2340] mb-2">Peso (kg)</h3>
                    <LineChart title="Peso" unit="kg" points={weight} color="#6E3F8C" />
                  </Card>
                  <Card>
                    <h3 className="font-bold text-[#1F2340] mb-2">Altura (cm)</h3>
                    <LineChart title="Altura" unit="cm" points={height} color="#B04A26" />
                  </Card>
                  <Card className="lg:col-span-2">
                    <h3 className="font-bold text-[#1F2340] mb-3">Hoje</h3>
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-[#5B5F7A]">Temperatura</dt>
                        <dd className={`font-extrabold flex items-center gap-1 ${febrile ? "text-[#9B2C20]" : "text-[#1F2340]"}`}>
                          <Thermometer className="w-4 h-4" aria-hidden="true" />
                          {patient.lastTemperature.toFixed(1)} °C{febrile && " (febre)"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5B5F7A]">Último check-in</dt>
                        <dd className="font-extrabold text-[#1F2340]">{patient.lastCheckIn === "—" ? "Pendente" : patient.lastCheckIn}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5B5F7A]">Adesão (7 dias)</dt>
                        <dd className="font-extrabold text-[#1F2340]">{patient.adherencePct}%</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5B5F7A]">Tratamento</dt>
                        <dd className="font-extrabold text-[#1F2340]">{patient.treatment}</dd>
                      </div>
                    </dl>
                  </Card>
                </div>
              )}

              {tab === "sintomas" && (
                <div role="tabpanel" id="panel-sintomas" aria-labelledby="tab-sintomas">
                  <Card>
                    <h3 className="font-bold text-[#1F2340] mb-1">Relatos da família (MoodPicker e PainScale)</h3>
                    <p className="text-xs text-[#5B5F7A] mb-4">Check-ins diários registrados no Portal do Paciente.</p>
                    {detail.symptoms.length === 0 ? (
                      <p className="text-sm text-[#5B5F7A]">Nenhum check-in registrado.</p>
                    ) : (
                      <ul className="divide-y divide-[#F1E4D6]">
                        {detail.symptoms.map((s) => {
                          const m = moodLabel[s.mood];
                          return (
                            <li key={s.id} className="py-3 flex flex-wrap items-start gap-x-4 gap-y-1">
                              <span className="w-12 text-xs font-extrabold text-[#6E3F8C]">{s.date}</span>
                              <Badge variant={m.variant}>
                                <span aria-hidden="true">{m.emoji}</span> {m.text}
                              </Badge>
                              <span className="text-xs text-[#1F2340]">
                                {s.painPart ? `Dor ${intensityLabel[s.painIntensity ?? "pouco"]} em ${partLabel[s.painPart]}` : "Sem dor"}
                              </span>
                              <span className={`text-xs font-bold ${s.temperature >= 37.8 ? "text-[#9B2C20]" : "text-[#5B5F7A]"}`}>
                                {s.temperature.toFixed(1)} °C
                              </span>
                              {s.note && <p className="basis-full pl-16 text-xs text-[#5B5F7A] italic">“{s.note}”</p>}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Card>
                </div>
              )}

              {tab === "adesao" && (
                <div role="tabpanel" id="panel-adesao" aria-labelledby="tab-adesao">
                  <Card>
                    <h3 className="font-bold text-[#1F2340] mb-1">Adesão aos medicamentos — últimos 7 dias</h3>
                    <p className="text-xs text-[#5B5F7A] mb-4">Doses confirmadas pelo cuidador × doses previstas.</p>
                    <ul className="space-y-3">
                      {detail.adherence.map((d) => (
                        <li key={d.label} className="flex items-center gap-3">
                          <span className="w-9 text-xs font-bold text-[#5B5F7A]">{d.label}</span>
                          <ProgressBar
                            className="flex-1"
                            label={`${d.label}: ${d.taken} de ${d.expected} doses`}
                            value={d.taken}
                            max={d.expected}
                            color={d.taken === d.expected ? "success" : "orange"}
                          />
                          <span className="w-12 text-right text-xs font-extrabold text-[#1F2340]">
                            {d.taken}/{d.expected}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}

              {tab === "intercorrencias" ? (
                <div role="tabpanel" id="panel-intercorrencias" aria-labelledby="tab-intercorrencias">
                  <Card>
                    <h3 className="font-bold text-[#1F2340] mb-4">Linha do tempo de intercorrências</h3>
                    {detail.intercurrences.length === 0 ? (
                      <p className="text-sm text-[#5B5F7A]">Sem intercorrências registradas neste ciclo.</p>
                    ) : (
                      detail.intercurrences.map((i, idx) => (
                        <TimelineItem
                          key={i.id}
                          time={i.date}
                          title={i.title}
                          description={i.description}
                          tag={i.severity === "critico" ? "Crítico" : i.severity === "atencao" ? "Atenção" : "Estável"}
                          status={i.severity === "estavel" ? "done" : "warning"}
                          isLast={idx === detail.intercurrences.length - 1}
                        />
                      ))
                    )}
                  </Card>
                </div>
              ) : null}
            </div>
          );
        }}
      </AsyncView>
    </MedicoShell>
  );
}
