import type { Metadata } from "next";
import "./globals.css";
import { AppFrame } from "../components/AppFrame";

export const metadata: Metadata = {
  title: "OncoVida — Portal do Paciente e Cuidador",
  description:
    "Acompanhamento acolhedor, diário e seguro para pacientes oncológicos pediátricos e seus cuidadores.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600..700;1,9..144,600&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans selection:bg-[#EDE3F5] selection:text-[#6E3F8C]">
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
