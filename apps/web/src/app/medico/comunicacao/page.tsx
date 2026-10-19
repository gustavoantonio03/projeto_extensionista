"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  Field,
  Select,
  Tabs,
  Textarea,
} from "@siglo/ui";
import { CheckCircle2, MailOpen, Reply, SendHorizonal, Siren } from "lucide-react";
import { MedicoShell } from "../../../components/medico/MedicoShell";
import { AsyncView } from "../../../components/medico/AsyncView";
import { getMessages, getMonitoredPatients, markMessageRead, sendTeamMessage } from "../../../lib/medico-data";
import { useAsync } from "../../../lib/use-async";
import { mockTeamUser } from "../../../mocks/medico-fixtures";
import type { ClinicalMessage } from "../../../lib/types";

const templates = [
  "Mantenha a hidratação em pequenos goles ao longo do dia.",
  "Por favor, retorne ao hospital hoje para avaliação.",
  "Dose confirmada. Continue conforme a prescrição.",
  "Registre a temperatura a cada 4 horas e nos avise.",
];

function ComunicacaoContent() {
  const params = useSearchParams();
  const [version, setVersion] = React.useState(0);
  const refresh = () => setVersion((v) => v + 1);
  const state = useAsync(async () => {
    const [messages, patients] = await Promise.all([getMessages(), getMonitoredPatients()]);
    return { messages, patients };
  }, [version]);

  const [filter, setFilter] = React.useState("todas");
  const [patientId, setPatientId] = React.useState(params.get("paciente") ?? "pac-001");
  const [priority, setPriority] = React.useState<ClinicalMessage["priority"]>("normal");
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [sending, setSending] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 5) {
      setError("Escreva a orientação para o cuidador (mín. 5 caracteres).");
      return;
    }
    setError(undefined);
    setSending(true);
    await sendTeamMessage({ patientId, text: text.trim(), priority }, mockTeamUser.name);
    setSending(false);
    setText("");
    setNotice("Orientação enviada ao cuidador.");
    refresh();
  };

  return (
    <MedicoShell
      title="Comunicação com cuidadores"
      subtitle="Recados clínicos, orientações e respostas da equipe."
    >
      <AsyncView state={state} rows={4}>
        {({ messages, patients }) => {
          const nameOf = (id: string) => patients.find((p) => p.id === id)?.name ?? id;
          const unread = messages.filter((m) => m.direction === "cuidador-para-equipe" && !m.read);
          const urgent = messages.filter((m) => m.priority === "urgente");
          const shown = messages
            .filter((m) =>
              filter === "todas" ? true : filter === "nao-lidas" ? unread.includes(m) : m.priority === "urgente"
            )
            .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "urgente" ? -1 : 1));

          return (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <section aria-labelledby="h-mural" className="xl:col-span-3 space-y-4">
                <h2 id="h-mural" className="text-lg font-bold text-[#1F2340]">Mural de recados</h2>
                <Tabs
                  ariaLabel="Filtrar recados"
                  value={filter}
                  onChange={setFilter}
                  tabs={[
                    { id: "todas", label: "Todos", count: messages.length },
                    { id: "nao-lidas", label: "Não lidos", count: unread.length },
                    { id: "urgentes", label: "Urgentes", count: urgent.length },
                  ]}
                />
                <div role="tabpanel" id={`panel-${filter}`} aria-labelledby={`tab-${filter}`}>
                  {shown.length === 0 ? (
                    <EmptyState title="Nenhum recado aqui" description="Quando houver mensagens neste filtro, elas aparecem nesta lista." />
                  ) : (
                    <ul className="space-y-3">
                      {shown.map((m) => {
                        const fromCaregiver = m.direction === "cuidador-para-equipe";
                        return (
                          <li key={m.id}>
                            <Card className={`p-4 ${fromCaregiver && !m.read ? "border-l-4 border-l-[#6E3F8C]" : ""}`}>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-extrabold text-sm text-[#1F2340]">{m.author}</span>
                                <span className="text-xs text-[#5B5F7A]">sobre {nameOf(m.patientId)} · {m.at}</span>
                                {m.priority === "urgente" && (
                                  <Badge variant="danger"><Siren className="w-3 h-3" aria-hidden="true" /> Urgente</Badge>
                                )}
                                <Badge variant={fromCaregiver ? "plum" : "clinical"}>
                                  {fromCaregiver ? "Do cuidador" : "Da equipe"}
                                </Badge>
                              </div>
                              <p className="text-sm text-[#1F2340]">{m.text}</p>
                              {fromCaregiver && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <Button
                                    variant="soft"
                                    size="sm"
                                    leftIcon={<Reply className="w-4 h-4" />}
                                    onClick={() => {
                                      setPatientId(m.patientId);
                                      setPriority(m.priority);
                                      document.getElementById("composer")?.scrollIntoView({ behavior: "smooth" });
                                      document.getElementById("msg-text")?.focus();
                                    }}
                                  >
                                    Responder
                                  </Button>
                                  {!m.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      leftIcon={<MailOpen className="w-4 h-4" />}
                                      onClick={async () => {
                                        await markMessageRead(m.id);
                                        refresh();
                                      }}
                                    >
                                      Marcar como lido
                                    </Button>
                                  )}
                                </div>
                              )}
                            </Card>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>

              <section aria-labelledby="h-composer" id="composer" className="xl:col-span-2">
                <Card className="p-5 xl:sticky xl:top-6">
                  <h2 id="h-composer" className="text-lg font-bold text-[#1F2340] mb-4 flex items-center gap-2">
                    <SendHorizonal className="w-5 h-5 text-[#6E3F8C]" aria-hidden="true" /> Enviar orientação
                  </h2>
                  {notice && (
                    <div role="status" className="mb-4 flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#E5F4EC] border border-[#2E7D5B]/30 text-sm text-[#256648] font-semibold">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      {notice}
                      {patientId === "pac-001" && (
                        <Link href="/familia" className="underline font-extrabold">Ver em Família</Link>
                      )}
                    </div>
                  )}
                  <form onSubmit={send} noValidate className="space-y-4">
                    <Field label="Paciente / cuidador" htmlFor="msg-patient">
                      <Select id="msg-patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} — {p.caregiver}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Prioridade" htmlFor="msg-priority" helperText="Urgente destaca a mensagem para a família.">
                      <Select id="msg-priority" value={priority} onChange={(e) => setPriority(e.target.value as ClinicalMessage["priority"])}>
                        <option value="normal">Normal</option>
                        <option value="urgente">Urgente</option>
                      </Select>
                    </Field>
                    <div role="group" aria-label="Modelos de mensagem" className="flex flex-wrap gap-2">
                      {templates.map((t) => (
                        <Chip key={t} onClick={() => setText(t)}>
                          {t.length > 34 ? `${t.slice(0, 34)}…` : t}
                        </Chip>
                      ))}
                    </div>
                    <Field label="Mensagem" htmlFor="msg-text" required helperText="Use linguagem simples e acolhedora." error={error}>
                      <Textarea id="msg-text" value={text} hasError={!!error} aria-invalid={!!error}
                        onChange={(e) => setText(e.target.value)} />
                    </Field>
                    <Button type="submit" size="lg" fullWidth isLoading={sending} leftIcon={<SendHorizonal className="w-4 h-4" />}>
                      Enviar ao cuidador
                    </Button>
                  </form>
                </Card>
              </section>
            </div>
          );
        }}
      </AsyncView>
    </MedicoShell>
  );
}

export default function ComunicacaoPage() {
  return (
    <React.Suspense fallback={null}>
      <ComunicacaoContent />
    </React.Suspense>
  );
}
