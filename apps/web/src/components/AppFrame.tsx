"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Moldura por portal:
 * - O Portal do Médico ocupa a tela inteira (desktop ampla para densidade de dados clínicos).
 * - O Portal do Paciente/Cuidador é estritamente Mobile-First (estilo app nativo centralizado
 *   com max-w-[430px] no desktop, e 100% de largura no mobile).
 * - Não usa transition nem overflow-x no wrapper para não quebrar a fixação do BottomNav na viewport.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/medico")) {
    return <div className="min-h-screen bg-[#F7F4EF]">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden box-border bg-[#EFE8DD] flex justify-center items-start sm:py-6 selection:bg-[#6E3F8C]/20">
      <div className="w-full max-w-full sm:max-w-[430px] min-h-screen sm:rounded-[42px] bg-[#FFF8F0] shadow-[0_25px_60px_-15px_rgba(31,35,64,0.22)] sm:border sm:border-[#E8DFC8] relative flex flex-col justify-between box-border">
        <main className="flex-1 pb-24 w-full max-w-full box-border">{children}</main>
      </div>
    </div>
  );
}
