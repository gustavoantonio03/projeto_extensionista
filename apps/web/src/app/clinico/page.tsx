"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Badge,
  StatCard,
  BottomNav,
} from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient } from "../../mocks/fixtures";
import {
  getAuditTrail,
  getActiveCaregiver,
  verifyAuditEntry,
} from "../../lib/data";
import { caregiverTag, formatAuditLine } from "../../lib/caregiver";
import {
  AppMode,
  AuditEntry,
  CaregiverProfile,
} from "../../lib/types";
import {
  CheckCheck,
  Hourglass,
  ShieldCheck,
  Thermometer,
  GlassWater,
} from "lucide-react";

export default function ClinicoPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [activeCaregiver, setActiveCaregiver] =
    React.useState<CaregiverProfile | null>(null);
  const [auditTrail, setAuditTrail] = React.useState<AuditEntry[]>([]);
  const [justVerifiedId, setJustVerifiedId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    const [a, c] = await Promise.all([getAuditTrail(), getActiveCaregiver()]);
    setAuditTrail(a);
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
      setTimeout(() => setJustVerifiedId(null), 2500);
      await loadData();
    }
  };

  const pendingEntries = auditTrail.filter(
    (e) => e.verificationStatus === "pendente"
  );

  // Filtra apenas ações principais (3 a 4 últimos eventos) para a lista compacta de 1 linha
  const compactAudit = auditTrail
    .filter(
      (e) =>
        e.action === "administrou_medicamento" ||
        e.action === "registrou_sintoma" ||
        e.action === "registrou_refeicao"
    )
    .slice(0, 4);

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
      />

      {mode === "crianca" ? (
        <div className="px-4 py-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#EDE3F5] text-2xl flex items-center justify-center mx-auto">
            🔒
          </div>
          <h2 className="text-base font-bold text-[#1F2340]">
            Área Exclusiva dos Cuidadores
          </h2>
          <p className="text-xs text-[#5B5F7A] max-w-xs mx-auto">
            Peça a um adulto para desbloquear ou volte para o Meu Dia.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/")}
          >
            Voltar para Meu Dia 🌱
          </Button>
        </div>
      ) : (
        <div className="px-4 py-4 pb-28 space-y-5">
          {/* 1. Conferência Cruzada (1 toque) */}
          <section aria-label="Conferência Cruzada">
            {pendingEntries.length > 0 ? (
              <div className="rounded-2xl bg-[#FFF1DA] p-3.5 border border-[#9A5B0F]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#9A5B0F] flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5" />
                    Aguardando conferência ({pendingEntries.length})
                  </span>
                  <Badge variant="warning">Dupla Checagem</Badge>
                </div>

                {pendingEntries.map((entry) => {
                  const isAuthor =
                    activeCaregiver && entry.performedBy.id === activeCaregiver.id;
                  return (
                    <div
                      key={entry.id}
                      className="p-2.5 rounded-xl bg-white border border-[#F1E4D6] flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-[#1F2340]">
                        {formatAuditLine(entry)}
                      </span>

                      {isAuthor ? (
                        <span className="text-[11px] font-semibold text-[#9A5B0F] shrink-0">
                          Outro cuidador confere
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleVerifyEntry(entry.id)}
                          leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
                          className="shrink-0 font-bold text-xs"
                        >
                          Conferir
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#E5F4EC] border border-[#2E7D5B]/25 flex items-center gap-2 text-xs text-[#2E7D5B] font-bold">
                <CheckCheck className="w-4 h-4 shrink-0" />
                <span>Todos os registros do dia foram conferidos!</span>
              </div>
            )}

            {justVerifiedId && (
              <p
                role="status"
                className="mt-2 text-xs font-bold text-[#2E7D5B] bg-[#E5F4EC] rounded-xl px-3 py-1.5"
              >
                ✅ Conferido por{" "}
                {activeCaregiver ? caregiverTag(activeCaregiver) : "você"}
              </p>
            )}
          </section>

          {/* 2. Indicadores Vitais Diretos */}
          <section aria-label="Indicadores Vitais">
            <h2 className="text-base font-extrabold text-[#1F2340] mb-2.5">
              Indicadores Vitais
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              <StatCard
                label="Temperatura"
                value="36.5"
                unit="°C"
                trend="stable"
                trendLabel="Sem febre"
                icon={<Thermometer className="w-4 h-4 text-[#2E7D5B]" />}
              />
              <StatCard
                label="Hidratação"
                value="1.250"
                unit="ml"
                trend="up"
                trendLabel="5/8 copos"
                icon={<GlassWater className="w-4 h-4 text-[#134E54]" />}
              />
              <StatCard
                label="Peso"
                value="21.4"
                unit="kg"
                trend="up"
                trendLabel="+300g no ciclo"
              />
              <StatCard
                label="Estatura"
                value="118"
                unit="cm"
                trend="up"
                trendLabel="Curva normal"
              />
            </div>
          </section>

          {/* 3. Trilha de Auditoria Compacta (3 a 4 últimos eventos em 1 linha) */}
          <section aria-label="Trilha de Auditoria Compacta">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-extrabold text-[#1F2340]">
                Últimos Registros
              </h3>
              <Badge variant="plum">{compactAudit.length} recentes</Badge>
            </div>

            <Card className="p-3.5 divide-y divide-[#F1E4D6]/80">
              {compactAudit.map((entry) => (
                <div
                  key={entry.id}
                  className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-xs font-bold text-[#1F2340]"
                >
                  <span>{formatAuditLine(entry)}</span>
                </div>
              ))}
            </Card>
          </section>

          {/* 4. Selo discreto de 1 linha no rodapé */}
          <p className="text-[11px] text-[#5B5F7A] text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0" />
            <span>Dados protegidos · LGPD (Art. 14)</span>
          </p>
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

