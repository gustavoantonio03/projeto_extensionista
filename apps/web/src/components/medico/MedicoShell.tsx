"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, cn } from "@siglo/ui";
import { LayoutDashboard, Pill, MessagesSquare, ShieldCheck } from "lucide-react";
import { PortalSwitcher } from "../PortalSwitcher";
import { mockTeamUser } from "../../mocks/medico-fixtures";

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

  return (
    <div className="md:flex min-h-screen">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:text-[#6E3F8C] font-bold"
      >
        Ir para o conteúdo
      </a>

      <aside className="md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen bg-white border-b md:border-b-0 md:border-r border-[#F1E4D6] p-4 flex md:flex-col gap-4 md:gap-6 flex-wrap items-center md:items-stretch">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6E3F8C] to-[#B04A26] flex items-center justify-center text-white text-lg shadow-sm" aria-hidden="true">
            🩺
          </div>
          <div>
            <p className="font-extrabold text-sm text-[#1F2340] leading-none">SIGLO · Equipe</p>
            <p className="text-[11px] font-semibold text-[#5B5F7A] mt-1">Portal do Médico</p>
          </div>
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
          <PortalSwitcher current="medico" className="flex-col" />
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FFF8F0] border border-[#F1E4D6]">
            <Avatar fallback="RS" size="sm" alt={mockTeamUser.name} />
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#1F2340] truncate">{mockTeamUser.name}</p>
              <p className="text-[11px] text-[#5B5F7A] truncate">{mockTeamUser.roleLabel}</p>
            </div>
          </div>
          <p className="flex items-start gap-1.5 text-[11px] text-[#5B5F7A] leading-snug">
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#2E7D5B]" aria-hidden="true" />
            Dados fictícios de demonstração. Sigilo médico e LGPD (art. 11 e 14).
          </p>
        </div>
        <div className="md:hidden w-full">
          <PortalSwitcher current="medico" />
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
