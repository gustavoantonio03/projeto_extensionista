"use client";

import * as React from "react";
import {
  getMedications,
  getActiveCaregiver,
  toggleMedicationTaken,
  verifyMedicationAction,
} from "./data";
import type { CaregiverProfile, Medication } from "./types";

/**
 * Estado compartilhado por Meu Dia e Remédios para a rotina de medicação com
 * rastreabilidade: quem deu a dose, quando, e a conferência por outro cuidador.
 * Tudo mockado (lib/data.ts) — nenhuma chamada de rede.
 */
export function useMedicationTrail() {
  const [meds, setMeds] = React.useState<Medication[]>([]);
  const [activeCaregiver, setActiveCaregiver] =
    React.useState<CaregiverProfile | null>(null);

  React.useEffect(() => {
    getMedications().then(setMeds);
    getActiveCaregiver().then(setActiveCaregiver);
  }, []);

  const replace = React.useCallback((updated: Medication | null) => {
    if (!updated) return;
    setMeds((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }, []);

  /** Marca/desmarca a dose em nome do cuidador ativo. */
  const toggle = React.useCallback(
    async (id: string, taken: boolean) => {
      replace(await toggleMedicationTaken(id, taken, activeCaregiver?.id));
    },
    [activeCaregiver, replace]
  );

  /** Conferência cruzada pelo cuidador ativo (nunca o mesmo que registrou). */
  const verify = React.useCallback(
    async (id: string) => {
      replace(await verifyMedicationAction(id, activeCaregiver?.id));
    },
    [activeCaregiver, replace]
  );

  return { meds, activeCaregiver, setActiveCaregiver, toggle, verify };
}
