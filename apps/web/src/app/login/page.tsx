"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Badge } from "@siglo/ui";
import { loginAs } from "../../lib/data";
import type { LoginProfileKey } from "../../lib/types";
import { ArrowRight, ShieldCheck } from "lucide-react";

const LOGIN_OPTIONS: {
  key: LoginProfileKey;
  emoji: string;
  label: string;
  roleTag: string;
  description: string;
  accent: string;
}[] = [
  {
    key: "crianca",
    emoji: "🧒",
    label: "Entrar como Criança (Clarinha)",
    roleTag: "Paciente",
    description: "Visão lúdica de Meu Dia, humor e mural de carinho.",
    accent: "hover:border-[#F08A5D] bg-[#FFF8F0]",
  },
  {
    key: "mae",
    emoji: "👩",
    label: "Entrar como Mãe (Ana)",
    roleTag: "Cuidadora Principal",
    description: "Gestão completa de remédios, check-in e dupla checagem.",
    accent: "hover:border-[#6E3F8C] bg-white",
  },
  {
    key: "pai",
    emoji: "👨",
    label: "Entrar como Pai (Carlos)",
    roleTag: "Cuidador Familiar",
    description: "Conferência cruzada de doses e acompanhamento diário.",
    accent: "hover:border-[#6E3F8C] bg-white",
  },
  {
    key: "medico",
    emoji: "🩺",
    label: "Entrar como Médico",
    roleTag: "Dr. Roberto Silva",
    description: "Portal clínico de triagem, prescrição e visão 360.",
    accent: "hover:border-[#134E54] bg-[#F0F8FA]",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = React.useState<LoginProfileKey | null>(
    null
  );

  const handleLogin = async (profileKey: LoginProfileKey) => {
    setLoadingKey(profileKey);
    const { redirectTo } = await loginAs(profileKey);
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] px-4 py-8 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Identidade visual OncoVida */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6E3F8C] to-[#B04A26] flex items-center justify-center text-white text-2xl mx-auto shadow-md">
            🌱
          </div>
          <h1 className="text-2xl font-extrabold font-display text-[#1F2340]">
            OncoVida · SIGLO
          </h1>
          <p className="text-xs text-[#5B5F7A] max-w-xs mx-auto leading-relaxed">
            Selecione o perfil para simular o acesso isolado no dispositivo correspondente:
          </p>
        </div>

        {/* Lista de Perfis de Acesso */}
        <div className="space-y-3" role="list" aria-label="Perfis de acesso">
          {LOGIN_OPTIONS.map((opt) => {
            const isLoading = loadingKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                disabled={loadingKey !== null}
                onClick={() => handleLogin(opt.key)}
                className={`w-full p-4 rounded-2xl border-2 border-[#F1E4D6] text-left transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs active:scale-[0.99] ${opt.accent}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className="w-11 h-11 rounded-2xl bg-[#EDE3F5]/70 flex items-center justify-center text-xl shrink-0"
                    aria-hidden="true"
                  >
                    {opt.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="font-extrabold text-sm text-[#1F2340]">
                        {opt.label}
                      </span>
                    </div>
                    <Badge variant="plum" className="mb-1">
                      {opt.roleTag}
                    </Badge>
                    <p className="text-xs text-[#5B5F7A] leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <span className="w-8 h-8 rounded-xl bg-[#EDE3F5] text-[#6E3F8C] flex items-center justify-center shrink-0">
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isLoading ? "translate-x-1 animate-pulse" : ""
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="p-3.5 mt-6 bg-white/80 border-[#F1E4D6]">
        <p className="text-[11px] text-[#5B5F7A] text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D5B] shrink-0" />
          <span>
            Sessões isoladas por dispositivo · Conformidade LGPD (Art. 14)
          </span>
        </p>
      </Card>
    </div>
  );
}
