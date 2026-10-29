"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, Button } from "@siglo/ui";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth, getRouteForRole } from "../../lib/AuthContext";
import { seedInitialUsers } from "../../lib/seed";
import type { FirebaseRole } from "../../lib/types";

interface QuickAccount {
  email: string;
  role: FirebaseRole;
  label: string;
  roleLabel: string;
  emoji: string;
  badgeVariant: "plum" | "warning" | "clinical";
  description: string;
}

const QUICK_ACCOUNTS: QuickAccount[] = [
  {
    email: "clarinha@siglo.com",
    role: "patient",
    label: "Criança (Clarinha)",
    roleLabel: "Paciente · 6 anos",
    emoji: "🧒",
    badgeVariant: "warning",
    description: "Visão lúdica: Meu Dia, humor, dor e mural carinhoso.",
  },
  {
    email: "mae@siglo.com",
    role: "caregiver",
    label: "Mãe (Ana)",
    roleLabel: "Cuidadora Principal",
    emoji: "👩",
    badgeVariant: "plum",
    description: "Gestão diária: remédios, horários e dupla checagem.",
  },
  {
    email: "medico@siglo.com",
    role: "doctor",
    label: "Dr. Roberto Silva",
    roleLabel: "Oncopediatra · Equipe",
    emoji: "🩺",
    badgeVariant: "clinical",
    description: "Portal Clínico: prescrições, triagem e visão 360.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Estado para seed inicial
  const [seeding, setSeeding] = React.useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSeedSuccessMsg(null);

    try {
      const { userDoc, redirectTo } = await login(email.trim(), password);
      const target = redirectTo || getRouteForRole(userDoc?.role || "caregiver");
      router.push(target);
    } catch (err: any) {
      console.error("Falha ao autenticar:", err);
      let friendly = "Não foi possível entrar. Verifique seu e-mail e senha.";
      if (
        err?.code === "auth/invalid-credential" ||
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
      ) {
        friendly = "E-mail ou senha incorretos. Use os botões de teste abaixo ou execute o Seed.";
      } else if (err?.code === "auth/too-many-requests") {
        friendly = "Muitas tentativas sem sucesso. Aguarde alguns instantes e tente novamente.";
      } else if (err?.code === "auth/invalid-email") {
        friendly = "O formato de e-mail informado é inválido.";
      }
      setErrorMsg(friendly);
      setLoading(false);
    }
  };

  const handleQuickFill = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword("siglo123");
    setErrorMsg(null);
  };

  const handleDirectQuickLogin = async (account: QuickAccount) => {
    setEmail(account.email);
    setPassword("siglo123");
    setLoading(true);
    setErrorMsg(null);
    setSeedSuccessMsg(null);

    try {
      const { userDoc, redirectTo } = await login(account.email, "siglo123");
      const target = redirectTo || getRouteForRole(userDoc?.role || account.role);
      router.push(target);
    } catch (err: any) {
      // Se falhar porque ainda não foi feito seed, sugere clicar no botão de seed
      console.warn("Conta ainda não existe no Firebase Auth. Sugerindo seed...", err);
      setErrorMsg(
        `A conta ${account.email} ainda não foi criada no Firebase. Clique em "Criar Usuários de Teste (Seed)" abaixo.`
      );
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setErrorMsg(null);
    setSeedSuccessMsg(null);

    try {
      const res = await seedInitialUsers();
      if (res.success) {
        setSeedSuccessMsg(
          "3 contas de teste criadas no Firebase Auth e Firestore! Senha padrão: siglo123"
        );
      } else {
        setErrorMsg("Houve um aviso ao provisionar usuários. Verifique o console.");
      }
    } catch (err: any) {
      console.error("Erro ao rodar seed:", err);
      setErrorMsg(err?.message || "Erro ao rodar script de seed.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] px-4 py-8 flex flex-col justify-between">
      <div className="space-y-6 max-w-[390px] mx-auto w-full">
        {/* Identidade visual OncoVida */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6E3F8C] to-[#B04A26] flex items-center justify-center text-white text-2xl mx-auto shadow-md">
            🌱
          </div>
          <h1 className="text-2xl font-extrabold font-display text-[#1F2340]">
            OncoVida · SIGLO
          </h1>
          <p className="text-xs text-[#5B5F7A] leading-relaxed">
            Acesso integrado com Firebase Authentication e perfis no Firestore.
          </p>
        </div>

        {/* Feedback de Erro */}
        {errorMsg && (
          <div
            role="alert"
            className="p-3 rounded-2xl bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] flex items-start gap-2.5 text-xs animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Feedback de Sucesso no Seed */}
        {seedSuccessMsg && (
          <div
            role="status"
            className="p-3 rounded-2xl bg-[#DEF7EC] border border-[#84E1BC] text-[#03543F] flex items-start gap-2.5 text-xs animate-in fade-in duration-200"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#0E9F6E]" />
            <span className="leading-snug">{seedSuccessMsg}</span>
          </div>
        )}

        {/* Formulário de Login Real */}
        <Card className="p-4 bg-white/95 border-[#F1E4D6] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-[#1F2340] mb-1"
              >
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5B5F7A]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="ex: clarinha@siglo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFC8] bg-[#FFFBF5] text-xs text-[#1F2340] placeholder:text-[#A0A3BD] focus:outline-none focus:ring-2 focus:ring-[#6E3F8C] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-[#1F2340] mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5B5F7A]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFC8] bg-[#FFFBF5] text-xs text-[#1F2340] placeholder:text-[#A0A3BD] focus:outline-none focus:ring-2 focus:ring-[#6E3F8C] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || seeding}
              className="w-full justify-center font-bold text-xs py-2.5 shadow-sm mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no OncoVida</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Divisor */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#E8DFC8]"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-[#A0A3BD]">
            Acesso Rápido de Testes
          </span>
          <div className="flex-grow border-t border-[#E8DFC8]"></div>
        </div>

        {/* Cards de Acesso Rápido aos Perfis */}
        <div className="space-y-2.5" role="list" aria-label="Contas de teste">
          {QUICK_ACCOUNTS.map((acc) => (
            <div
              key={acc.email}
              className="p-3 rounded-2xl bg-white border border-[#F1E4D6] shadow-2xs hover:border-[#6E3F8C]/40 transition-all flex items-center justify-between gap-2.5"
            >
              <button
                type="button"
                onClick={() => handleDirectQuickLogin(acc)}
                disabled={loading || seeding}
                className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer group"
              >
                <span
                  className="w-10 h-10 rounded-xl bg-[#EDE3F5]/80 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform"
                  aria-hidden="true"
                >
                  {acc.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs text-[#1F2340]">
                      {acc.label}
                    </span>
                    <Badge variant={acc.badgeVariant} className="text-[10px] py-0">
                      {acc.roleLabel}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#5B5F7A] truncate">
                    {acc.email} · senha: <span className="font-mono text-[#6E3F8C]">siglo123</span>
                  </p>
                </div>
              </button>

              <button
                type="button"
                title="Preencher no formulário"
                onClick={() => handleQuickFill(acc.email)}
                className="px-2 py-1 text-[10px] font-semibold text-[#6E3F8C] bg-[#EDE3F5] hover:bg-[#E2D3EE] rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Preencher
              </button>
            </div>
          ))}
        </div>

        {/* Botão de Seed Inicial */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding || loading}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#6E3F8C]/40 bg-[#EDE3F5]/50 hover:bg-[#EDE3F5] text-[#6E3F8C] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {seeding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Criando contas no Firebase...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#B04A26]" />
                <span>🌱 Criar Usuários de Teste no Firebase (Seed)</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-[#7A7E96] text-center mt-1.5 leading-tight">
            Cria médico@siglo.com, mae@siglo.com e clarinha@siglo.com no Firebase Auth + Firestore.
          </p>
        </div>
      </div>

      {/* Rodapé LGPD */}
      <Card className="p-3 mt-6 bg-white/80 border-[#F1E4D6] max-w-[390px] mx-auto w-full">
        <p className="text-[11px] text-[#5B5F7A] text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D5B] shrink-0" />
          <span>
            Firebase Auth + Firestore · LGPD Art. 14 (Melhor Interesse da Criança)
          </span>
        </p>
      </Card>
    </div>
  );
}
