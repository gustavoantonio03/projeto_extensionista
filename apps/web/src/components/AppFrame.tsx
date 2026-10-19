"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Moldura por portal: o Portal do Paciente é mobile-first (coluna estreita);
 * o Portal do Médico ocupa a largura toda (densidade de dados).
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/medico")) {
    return <div className="min-h-screen bg-[#F7F4EF]">{children}</div>;
  }
  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md sm:max-w-xl mx-auto bg-[#FFF8F0] shadow-2xl relative">
      <main className="flex-1 pb-24">{children}</main>
    </div>
  );
}
