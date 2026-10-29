import type { AuditEntry, CaregiverProfile, Medication } from "./types";

const CATEGORY_LABELS: Record<Medication["category"], string> = {
  antiemetico: "Prevenir enjoo",
  corticoide: "Corticoide",
  "quimio-oral": "Quimioterapia oral",
  suporte: "Suporte",
};

/** Rótulo amigável da categoria clínica de uma medicação. */
export function medicationCategoryLabel(category: Medication["category"]): string {
  return CATEGORY_LABELS[category];
}

/** Rótulo curto padronizado: "Mãe (Ana)", "Pai (Carlos)", "Avó (Helena)". */
export function caregiverTag(cg: CaregiverProfile): string {
  return `${cg.relationLabel} (${cg.shortName})`;
}

/**
 * Formata um evento da trilha em 1 linha escaneável:
 * Ex.: "08:05 · Dexametasona dada por Mãe (✓ Pai)"
 */
export function formatAuditLine(entry: AuditEntry): string {
  const actor = entry.performedBy.relationLabel;
  const checkSuffix =
    entry.verificationStatus === "conferido" && entry.verifiedBy
      ? ` (✓ ${entry.verifiedBy.relationLabel})`
      : entry.verificationStatus === "pendente"
        ? " (pendente)"
        : "";

  const label =
    entry.subject ??
    (entry.action === "administrou_medicamento"
      ? `Medicação dada por ${actor}`
      : entry.action === "registrou_sintoma"
        ? `Check-in por ${actor}`
        : entry.action === "registrou_refeicao"
          ? `Refeição por ${actor}`
          : entry.description);

  return `${entry.performedAt} · ${label}${checkSuffix}`;
}

/**
 * Converte o estado de uma medicação nas props de rastreabilidade do `MedicationCard`.
 * Regras de dupla checagem:
 * - Só pode conferir quem NÃO registrou a dose e enquanto estiver pendente.
 * - Só quem registrou pode desfazer, e apenas antes de ser conferido.
 */
export function medicationTrailProps(
  med: Medication,
  active: CaregiverProfile | null
) {
  const performer = med.performedBy;
  const isPerformer = !!performer && !!active && performer.id === active.id;
  return {
    performedByLabel: performer ? caregiverTag(performer) : undefined,
    performedAt: med.performedAt ?? med.takenAt,
    verificationStatus: med.verificationStatus,
    verifiedByLabel: med.verifiedBy ? med.verifiedBy.relationLabel : undefined,
    verifiedAt: med.verifiedAt,
    canVerify:
      med.taken &&
      med.verificationStatus === "pendente" &&
      !!active &&
      !isPerformer,
    canUndo: med.verificationStatus !== "conferido" && (!performer || isPerformer),
  };
}

