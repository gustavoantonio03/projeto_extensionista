"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  Chip,
  Field,
  Input,
  Select,
  SeverityBadge,
  EmptyState,
  severityOrder,
  type Severity,
} from "@siglo/ui";
import { Search, Thermometer, ChevronRight, Siren, ClipboardX } from "lucide-react";
import { MedicoShell } from "../../components/medico/MedicoShell";
import { AsyncView } from "../../components/medico/AsyncView";
import { getMonitoredPatients } from "../../lib/medico-data";
import { useAsync } from "../../lib/use-async";
import type { MonitoredPatient } from "../../lib/types";

type SeverityFilter = Severity | "todos";

function Kpi({ label, value, hint, tone }: { label: string; value: string | number; hint: string; tone: "danger" | "warning" | "plum" | "success" }) {
  const tones = {
    danger: "border-l-[#C0392B]",
    warning: "border-l-[#9A5B0F]",
    plum: "border-l-[#6E3F8C]",
    success: "border-l-[#2E7D5B]",
  } as const;
  return (
    <Card className={`p-4 sm:p-4 border-l-4 ${tones[tone]}`}>
      <p className="text-xs font-bold text-[#5B5F7A]">{label}</p>
      <p className="text-3xl font-black text-[#1F2340] mt-1">{value}</p>
      <p className="text-[11px] text-[#5B5F7A] mt-0.5">{hint}</p>
    </Card>
  );
}

export default function MedicoDashboardPage() {
  const state = useAsync(getMonitoredPatients);
  const [query, setQuery] = React.useState("");
  const [ward, setWard] = React.useState("todas");
  const [treatment, setTreatment] = React.useState("todos");
  const [severity, setSeverity] = React.useState<SeverityFilter>("todos");

  const clear = () => {
    setQuery("");
    setWard("todas");
    setTreatment("todos");
    setSeverity("todos");
  };

  return (
    <MedicoShell
      title="Triagem do dia"
      subtitle="Pacientes pediátricos monitorados, ordenados por criticidade."
    >
      <AsyncView state={state} rows={5}>
        {(patients) => {
          const filtered = patients
            .filter((p) => {
              const q = query.trim().toLowerCase();
              const matchesQuery =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.preferredName.toLowerCase().includes(q) ||
                p.bed.toLowerCase().includes(q);
              const matchesWard = ward === "todas" || p.bed.startsWith(ward);
              const matchesTreatment = treatment === "todos" || p.treatment === treatment;
              const matchesSeverity = severity === "todos" || p.severity === severity;
              return matchesQuery && matchesWard && matchesTreatment && matchesSeverity;
            })
            .sort(
              (a, b) =>
                severityOrder[a.severity] - severityOrder[b.severity] ||
                a.adherencePct - b.adherencePct
            );

          const count = (s: Severity) => patients.filter((p) => p.severity === s).length;
          const avgAdherence = Math.round(
            patients.reduce((sum, p) => sum + p.adherencePct, 0) / (patients.length || 1)
          );
          const noCheckIn = patients.filter((p) => p.lastCheckIn === "—").length;
          const treatments = Array.from(new Set(patients.map((p) => p.treatment)));

          return (
            <div className="space-y-6">
              <section aria-label="Indicadores do dia" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Kpi label="Críticos" value={count("critico")} hint="Exigem ação agora" tone="danger" />
                <Kpi label="Em atenção" value={count("atencao")} hint="Acompanhar hoje" tone="warning" />
                <Kpi label="Sem check-in" value={noCheckIn} hint="Família ainda não relatou" tone="plum" />
                <Kpi label="Adesão média" value={`${avgAdherence}%`} hint="Medicamentos na semana" tone="success" />
              </section>

              <section aria-label="Filtros" className="bg-white rounded-[24px] border border-[#F1E4D6] p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Buscar paciente ou leito" htmlFor="busca" helperText="Nome, apelido ou leito (ex.: A-12)">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B5F7A]" aria-hidden="true" />
                      <Input
                        id="busca"
                        type="search"
                        className="pl-10"
                        placeholder="Buscar…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field label="Ala / leito" htmlFor="ala" helperText="Filtra pela ala do leito">
                    <Select id="ala" value={ward} onChange={(e) => setWard(e.target.value)}>
                      <option value="todas">Todas as alas</option>
                      <option value="A">Ala A</option>
                      <option value="B">Ala B</option>
                    </Select>
                  </Field>
                  <Field label="Tratamento" htmlFor="tratamento" helperText="Diagnóstico principal">
                    <Select id="tratamento" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
                      <option value="todos">Todos</option>
                      {treatments.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <div role="group" aria-label="Filtrar por criticidade" className="flex flex-wrap gap-2">
                  {(
                    [
                      ["todos", `Todos (${patients.length})`],
                      ["critico", `Crítico (${count("critico")})`],
                      ["atencao", `Atenção (${count("atencao")})`],
                      ["estavel", `Estável (${count("estavel")})`],
                    ] as [SeverityFilter, string][]
                  ).map(([id, label]) => (
                    <Chip key={id} selected={severity === id} onClick={() => setSeverity(id)}>
                      {label}
                    </Chip>
                  ))}
                </div>
              </section>

              {filtered.length === 0 ? (
                <EmptyState
                  title="Nenhum paciente encontrado"
                  description="Ajuste a busca ou os filtros para ver mais pacientes."
                  actionLabel="Limpar filtros"
                  onAction={clear}
                />
              ) : (
                <section aria-label="Lista de pacientes" className="bg-white rounded-[24px] border border-[#F1E4D6] overflow-hidden">
                  <p className="px-4 pt-4 text-xs font-semibold text-[#5B5F7A]" role="status">
                    {filtered.length} de {patients.length} pacientes
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[760px]">
                      <caption className="sr-only">Pacientes monitorados ordenados por criticidade</caption>
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wide text-[#5B5F7A] border-b border-[#F1E4D6]">
                          <th scope="col" className="px-4 py-3 font-bold">Paciente</th>
                          <th scope="col" className="px-4 py-3 font-bold">Criticidade</th>
                          <th scope="col" className="px-4 py-3 font-bold">Motivo do alerta</th>
                          <th scope="col" className="px-4 py-3 font-bold">Temp.</th>
                          <th scope="col" className="px-4 py-3 font-bold">Último check-in</th>
                          <th scope="col" className="px-4 py-3 font-bold">Adesão</th>
                          <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p) => (
                          <PatientRow key={p.id} p={p} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          );
        }}
      </AsyncView>
    </MedicoShell>
  );
}

function PatientRow({ p }: { p: MonitoredPatient }) {
  const febrile = p.lastTemperature >= 37.8;
  return (
    <tr className="border-b border-[#F1E4D6]/70 last:border-0 hover:bg-[#FFF8F0] align-top">
      <th scope="row" className="px-4 py-3 font-normal">
        <Link
          href={`/medico/pacientes/${p.id}`}
          className="font-extrabold text-[#1F2340] hover:text-[#6E3F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C] rounded"
        >
          {p.name}
        </Link>
        <p className="text-xs text-[#5B5F7A] mt-0.5">
          {p.age} · Leito {p.bed} · {p.treatment}
        </p>
        <p className="text-[11px] text-[#5B5F7A]">{p.cycle}</p>
      </th>
      <td className="px-4 py-3">
        <SeverityBadge level={p.severity} />
      </td>
      <td className="px-4 py-3 max-w-[260px]">
        {p.alerts.length === 0 ? (
          <span className="text-xs text-[#5B5F7A]">Sem alertas</span>
        ) : (
          <ul className="space-y-1">
            {p.alerts.map((a) => (
              <li key={a.id} className="flex items-start gap-1.5 text-xs text-[#1F2340]">
                <Siren className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#9A5B0F]" aria-hidden="true" />
                <span>
                  {a.text} <span className="text-[#5B5F7A]">({a.at})</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${febrile ? "text-[#9B2C20]" : "text-[#1F2340]"}`}>
          <Thermometer className="w-3.5 h-3.5" aria-hidden="true" />
          {p.lastTemperature.toFixed(1)} °C{febrile && <span className="sr-only"> (febre)</span>}
        </span>
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {p.lastCheckIn === "—" ? (
          <span className="inline-flex items-center gap-1 text-[#8A520D] font-bold">
            <ClipboardX className="w-3.5 h-3.5" aria-hidden="true" /> Pendente
          </span>
        ) : (
          p.lastCheckIn
        )}
      </td>
      <td className="px-4 py-3 text-xs font-bold whitespace-nowrap">
        <span className={p.adherencePct < 75 ? "text-[#9B2C20]" : "text-[#1F2340]"}>{p.adherencePct}%</span>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/medico/pacientes/${p.id}`}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#6E3F8C] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C] rounded min-h-[44px]"
          aria-label={`Abrir visão 360 de ${p.name}`}
        >
          Abrir <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </td>
    </tr>
  );
}
