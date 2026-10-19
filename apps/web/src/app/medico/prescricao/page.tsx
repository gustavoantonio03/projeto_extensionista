"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Select,
  Sheet,
  Textarea,
} from "@siglo/ui";
import { CheckCircle2, Pencil, PauseCircle, PlayCircle, Plus, History, Salad } from "lucide-react";
import { MedicoShell } from "../../../components/medico/MedicoShell";
import { AsyncView } from "../../../components/medico/AsyncView";
import {
  addNutritionRec,
  getMonitoredPatients,
  getNutritionRecs,
  getPrescriptionChanges,
  getPrescriptions,
  savePrescription,
  setPrescriptionStatus,
} from "../../../lib/medico-data";
import { useAsync } from "../../../lib/use-async";
import { mockTeamUser } from "../../../mocks/medico-fixtures";
import type { Medication, PrescriptionItem } from "../../../lib/types";

const categoryLabel: Record<Medication["category"], string> = {
  antiemetico: "Antiemético (enjoo)",
  corticoide: "Corticoide",
  "quimio-oral": "Quimioterapia oral",
  suporte: "Suporte / outros",
};

interface FormState {
  id?: string;
  name: string;
  dosage: string;
  time: string;
  category: Medication["category"];
  instructions: string;
}
const emptyForm: FormState = { name: "", dosage: "", time: "", category: "suporte", instructions: "" };
type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (f.name.trim().length < 3) e.name = "Informe o nome do medicamento.";
  if (!f.dosage.trim()) e.dosage = "Informe a dose (ex.: 8mg • 1 comprimido).";
  if (!/^\d{2}:\d{2}$/.test(f.time)) e.time = "Informe o horário.";
  if (f.instructions.trim().length < 10) e.instructions = "Descreva como tomar, em linguagem simples (mín. 10 caracteres).";
  return e;
}

function PrescricaoContent() {
  const params = useSearchParams();
  const patients = useAsync(getMonitoredPatients);
  const [patientId, setPatientId] = React.useState(params.get("paciente") ?? "pac-001");
  const [version, setVersion] = React.useState(0);
  const data = useAsync(async () => {
    const [items, changes, recs] = await Promise.all([
      getPrescriptions(patientId),
      getPrescriptionChanges(patientId),
      getNutritionRecs(patientId),
    ]);
    return { items, changes, recs };
  }, [patientId, version]);

  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [toSuspend, setToSuspend] = React.useState<PrescriptionItem | null>(null);
  const [nutri, setNutri] = React.useState({ title: "", text: "" });
  const [nutriErrors, setNutriErrors] = React.useState<{ title?: string; text?: string }>({});

  const refresh = () => setVersion((v) => v + 1);
  const editing = Boolean(form.id);
  const isPortalPatient = patientId === "pac-001";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    await savePrescription({ ...form, patientId }, mockTeamUser.name);
    setSaving(false);
    setNotice(editing ? "Prescrição ajustada." : "Prescrição cadastrada.");
    setForm(emptyForm);
    refresh();
  };

  const confirmSuspend = async () => {
    if (!toSuspend) return;
    await setPrescriptionStatus(toSuspend.id, "suspenso", mockTeamUser.name);
    setNotice(`${toSuspend.name} suspenso.`);
    setToSuspend(null);
    refresh();
  };

  const submitNutri = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof nutriErrors = {};
    if (nutri.title.trim().length < 3) errs.title = "Dê um título curto à recomendação.";
    if (nutri.text.trim().length < 10) errs.text = "Descreva a orientação (mín. 10 caracteres).";
    setNutriErrors(errs);
    if (Object.keys(errs).length) return;
    await addNutritionRec({ patientId, ...nutri }, mockTeamUser.name);
    setNutri({ title: "", text: "" });
    setNotice("Recomendação nutricional publicada.");
    refresh();
  };

  return (
    <MedicoShell
      title="Prescrição e rotina"
      subtitle="Ajustes aqui alimentam as telas Remédios e Nutrição do Portal do Paciente."
    >
      <div className="space-y-6">
        <Card className="p-4">
          <AsyncView state={patients} rows={1}>
            {(list) => (
              <Field label="Paciente" htmlFor="paciente" helperText="Selecione para ver e editar a prescrição.">
                <Select
                  id="paciente"
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    setForm(emptyForm);
                    setErrors({});
                    setNotice(null);
                  }}
                >
                  {list.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Leito {p.bed}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
          </AsyncView>
        </Card>

        {notice && (
          <div role="status" className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#E5F4EC] border border-[#2E7D5B]/30 text-sm text-[#256648] font-semibold">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            {notice}
            {isPortalPatient ? (
              <Link href="/remedios" className="underline font-extrabold">
                Ver no Portal do Paciente
              </Link>
            ) : (
              <span className="text-xs font-normal">(O portal de demonstração exibe a paciente Clarinha.)</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <section aria-labelledby="h-lista" className="xl:col-span-3 space-y-3">
            <h2 id="h-lista" className="text-lg font-bold text-[#1F2340]">Medicamentos prescritos</h2>
            <AsyncView state={data} rows={3}>
              {({ items }) =>
                items.length === 0 ? (
                  <EmptyState
                    title="Sem medicamentos prescritos"
                    description="Cadastre o primeiro medicamento no formulário ao lado."
                  />
                ) : (
                  <ul className="space-y-3">
                    {items.map((rx) => (
                      <li key={rx.id}>
                        <Card className={`p-4 ${rx.status === "suspenso" ? "opacity-70" : ""}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-extrabold text-[#1F2340]">{rx.name}</h3>
                              <p className="text-sm text-[#6E3F8C] font-bold">{rx.dosage} · às {rx.time}</p>
                            </div>
                            <Badge variant={rx.status === "ativo" ? "success" : "neutral"}>
                              {rx.status === "ativo" ? "Ativo" : "Suspenso"}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#5B5F7A] mt-2">{categoryLabel[rx.category]}</p>
                          <p className="text-sm text-[#1F2340] mt-1">{rx.instructions}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button
                              variant="soft"
                              size="sm"
                              leftIcon={<Pencil className="w-4 h-4" />}
                              onClick={() => {
                                setForm({ id: rx.id, name: rx.name, dosage: rx.dosage, time: rx.time, category: rx.category, instructions: rx.instructions });
                                setErrors({});
                                document.getElementById("form-prescricao")?.scrollIntoView({ behavior: "smooth" });
                              }}
                              aria-label={`Editar ${rx.name}`}
                            >
                              Editar
                            </Button>
                            {rx.status === "ativo" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<PauseCircle className="w-4 h-4" />}
                                onClick={() => setToSuspend(rx)}
                                aria-label={`Suspender ${rx.name}`}
                              >
                                Suspender
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<PlayCircle className="w-4 h-4" />}
                                onClick={async () => {
                                  await setPrescriptionStatus(rx.id, "ativo", mockTeamUser.name);
                                  setNotice(`${rx.name} reativado.`);
                                  refresh();
                                }}
                                aria-label={`Reativar ${rx.name}`}
                              >
                                Reativar
                              </Button>
                            )}
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )
              }
            </AsyncView>
          </section>

          <section aria-labelledby="h-form" className="xl:col-span-2" id="form-prescricao">
            <Card className="p-5">
              <h2 id="h-form" className="text-lg font-bold text-[#1F2340] mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#6E3F8C]" aria-hidden="true" />
                {editing ? "Ajustar prescrição" : "Nova prescrição"}
              </h2>
              <form onSubmit={submit} noValidate className="space-y-4">
                <Field label="Medicamento" htmlFor="rx-name" required error={errors.name}>
                  <Input id="rx-name" value={form.name} hasError={!!errors.name} aria-invalid={!!errors.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Dose" htmlFor="rx-dose" required helperText="Ex.: 8mg • 1 comprimido" error={errors.dosage}>
                  <Input id="rx-dose" value={form.dosage} hasError={!!errors.dosage} aria-invalid={!!errors.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Horário" htmlFor="rx-time" required error={errors.time}>
                    <Input id="rx-time" type="time" value={form.time} hasError={!!errors.time} aria-invalid={!!errors.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </Field>
                  <Field label="Categoria" htmlFor="rx-cat">
                    <Select id="rx-cat" value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as Medication["category"] })}>
                      {Object.entries(categoryLabel).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Como tomar (aparece para a família)" htmlFor="rx-inst" required
                  helperText="Use linguagem simples, como falaria com o cuidador." error={errors.instructions}>
                  <Textarea id="rx-inst" value={form.instructions} hasError={!!errors.instructions} aria-invalid={!!errors.instructions}
                    onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" size="lg" isLoading={saving}>
                    {editing ? "Salvar ajuste" : "Cadastrar prescrição"}
                  </Button>
                  {editing && (
                    <Button type="button" variant="ghost" size="lg" onClick={() => { setForm(emptyForm); setErrors({}); }}>
                      Cancelar edição
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section aria-labelledby="h-nutri">
            <Card className="p-5">
              <h2 id="h-nutri" className="text-lg font-bold text-[#1F2340] mb-1 flex items-center gap-2">
                <Salad className="w-5 h-5 text-[#2E7D5B]" aria-hidden="true" /> Recomendações nutricionais
              </h2>
              <p className="text-xs text-[#5B5F7A] mb-4">Aparecem na tela Nutrição do paciente.</p>
              <AsyncView state={data} rows={1}>
                {({ recs }) =>
                  recs.length === 0 ? (
                    <p className="text-sm text-[#5B5F7A] mb-4">Nenhuma recomendação publicada.</p>
                  ) : (
                    <ul className="space-y-3 mb-4">
                      {recs.map((r) => (
                        <li key={r.id} className="p-3 rounded-2xl bg-[#E5F4EC]/50 border border-[#2E7D5B]/20">
                          <p className="font-extrabold text-sm text-[#1F2340]">{r.title}</p>
                          <p className="text-xs text-[#1F2340] mt-1">{r.text}</p>
                          <p className="text-[11px] text-[#5B5F7A] mt-1">{r.by} · {r.at}</p>
                        </li>
                      ))}
                    </ul>
                  )
                }
              </AsyncView>
              <form onSubmit={submitNutri} noValidate className="space-y-3">
                <Field label="Título" htmlFor="nr-title" error={nutriErrors.title}>
                  <Input id="nr-title" value={nutri.title} hasError={!!nutriErrors.title}
                    onChange={(e) => setNutri({ ...nutri, title: e.target.value })} />
                </Field>
                <Field label="Orientação" htmlFor="nr-text" helperText="Visível para o cuidador." error={nutriErrors.text}>
                  <Textarea id="nr-text" value={nutri.text} hasError={!!nutriErrors.text}
                    onChange={(e) => setNutri({ ...nutri, text: e.target.value })} />
                </Field>
                <Button type="submit" variant="clinical" size="md">Publicar recomendação</Button>
              </form>
            </Card>
          </section>

          <section aria-labelledby="h-hist">
            <Card className="p-5">
              <h2 id="h-hist" className="text-lg font-bold text-[#1F2340] mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-[#6E3F8C]" aria-hidden="true" /> Histórico de alterações
              </h2>
              <AsyncView state={data} rows={2}>
                {({ changes }) =>
                  changes.length === 0 ? (
                    <p className="text-sm text-[#5B5F7A]">Nenhuma alteração registrada.</p>
                  ) : (
                    <ol className="space-y-3">
                      {changes.map((c) => (
                        <li key={c.id} className="text-sm border-l-2 border-[#EDE3F5] pl-3">
                          <p className="text-[#1F2340]">{c.summary}</p>
                          <p className="text-[11px] text-[#5B5F7A]">{c.by} · {c.at}</p>
                        </li>
                      ))}
                    </ol>
                  )
                }
              </AsyncView>
            </Card>
          </section>
        </div>
      </div>

      <Sheet
        isOpen={Boolean(toSuspend)}
        onClose={() => setToSuspend(null)}
        title="Suspender medicamento?"
        description="A família deixará de ver este item em Remédios."
        position="center"
      >
        <p className="text-sm text-[#1F2340] mb-4">
          Você está prestes a suspender <strong>{toSuspend?.name}</strong>. Você poderá reativá-lo depois.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" size="md" onClick={confirmSuspend}>Sim, suspender</Button>
          <Button variant="ghost" size="md" onClick={() => setToSuspend(null)}>Voltar</Button>
        </div>
      </Sheet>
    </MedicoShell>
  );
}

export default function PrescricaoPage() {
  return (
    <React.Suspense fallback={null}>
      <PrescricaoContent />
    </React.Suspense>
  );
}
