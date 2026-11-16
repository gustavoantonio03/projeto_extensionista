"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, cn } from "@siglo/ui";
import {
  LayoutDashboard,
  Pill,
  MessagesSquare,
  ShieldCheck,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { mockTeamUser } from "../../mocks/medico-fixtures";
import { useAuth, getRouteForRole } from "../../lib/AuthContext";
import { logoutSession } from "../../lib/data";

const nav = [
  { href: "/medico", label: "Triagem", Icon: LayoutDashboard, match: (p: string) => p === "/medico" || p.startsWith("/medico/pacientes") },
  { href: "/medico/prescricao", label: "Prescrição", Icon: Pill, match: (p: string) => p.startsWith("/medico/prescricao") },
  { href: "/medico/comunicacao", label: "Comunicação", Icon: MessagesSquare, match: (p: string) => p.startsWith("/medico/comunicacao") },
];

export function MedicoShell({ title, subtitle, children, actions }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { userDoc, loading, logout } = useAuth();

  // Guarda RBAC: Apenas perfil 'doctor' pode acessar o Portal do Médico
  const isDoctor = userDoc?.role === "doctor";
  const isUnauthorizedRole = userDoc && !isDoctor;

  React.useEffect(() => {
    if (!loading && isUnauthorizedRole) {
      const target = getRouteForRole(userDoc.role);
      router.replace(target);
    }
  }, [loading, isUnauthorizedRole, userDoc, router]);

  const handleLogout = async () => {
    await logout();
    await logoutSession();
    router.push("/login");
  };

  // Bloqueio visual imediato contra escalação de privilégios (BOLA / Broken Access Control)
  if (!loading && isUnauthorizedRole) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div
          data-testid="unauthorized-alert"
          role="alert"
          className="max-w-md w-full p-6 rounded-3xl bg-white border border-[#E8DFC8] shadow-lg text-center space-y-4"
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FDE8E8] text-[#C0392B] flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-black text-[#1F2340]">Acesso Não Autorizado</h2>
          <p className="text-sm text-[#5B5F7A]">
            Seu perfil atual ({userDoc?.role === "patient" ? "Paciente" : "Cuidador"}) não possui permissão para acessar o Portal Clínico e dados confidenciais de prontuários.
          </p>
          <p className="text-xs text-[#8C90A8]">Redirecionando para a sua área segura...</p>
        </div>
      </div>
    );
  }

  const doctorName = userDoc?.displayName || mockTeamUser.name;
  const doctorRole = userDoc?.role === "doctor" ? "Oncopediatra · Equipe" : mockTeamUser.roleLabel;

  return (
    <div className="md:flex min-h-screen">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:text-[#6E3F8C] font-bold"
      >
        Ir para o conteúdo
      </a>

      <aside className="md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen bg-white border-b md:border-b-0 md:border-r border-[#F1E4D6] p-4 flex md:flex-col gap-4 md:gap-6 flex-wrap items-center md:items-stretch">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6E3F8C] to-[#B04A26] flex items-center justify-center text-white text-lg shadow-sm" aria-hidden="true">
              🩺
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#1F2340] leading-none">SIGLO · Equipe</p>
              <p className="text-[11px] font-semibold text-[#5B5F7A] mt-1">Portal do Médico</p>
            </div>
          </div>

          {/* Botão de Logout Mobile */}
          <button
            type="button"
            onClick={handleLogout}
            data-testid="doctor-logout-mobile"
            className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#6E3F8C] bg-[#EDE3F5] hover:bg-[#E2D3EE] transition-colors cursor-pointer"
            aria-label="Sair da conta médica"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>

        <nav aria-label="Navegação do Portal do Médico" className="flex md:flex-col gap-1 flex-1 md:flex-none">
          {nav.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 min-h-[44px] px-3 rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E3F8C]",
                  active ? "bg-[#EDE3F5] text-[#6E3F8C]" : "text-[#5B5F7A] hover:bg-[#F4F3F1] hover:text-[#1F2340]"
                )}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#FFF8F0] border border-[#F1E4D6] shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar fallback="RS" size="sm" alt={doctorName} />
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#1F2340] truncate">{doctorName}</p>
                <p className="text-[11px] text-[#5B5F7A] truncate">{doctorRole}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              data-testid="doctor-logout-desktop"
              className="p-2 rounded-xl text-[#6E3F8C] bg-white border border-[#E8DFC8] hover:bg-[#EDE3F5] transition-colors cursor-pointer shrink-0"
              aria-label="Sair da conta médica"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="flex items-start gap-1.5 text-[11px] text-[#5B5F7A] leading-snug">
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#2E7D5B]" aria-hidden="true" />
            Dados fictícios de demonstração. Sigilo médico e LGPD (art. 11 e 14).
          </p>
        </div>
      </aside>

      <main id="conteudo" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display text-[#1F2340]">{title}</h1>
            {subtitle && <p className="text-sm text-[#5B5F7A] mt-1">{subtitle}</p>}
          </div>
          {actions}
        </header>
        {children}
      </main>
    </div>
  );
}
