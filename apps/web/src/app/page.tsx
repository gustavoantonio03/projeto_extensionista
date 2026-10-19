"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Badge,
  MoodPicker,
  PainScale,
  BottomNav,
  DecorBlob,
  type MoodValue,
  type BodyPart,
  type PainIntensity,
} from "@siglo/ui";
import { Header } from "../components/Header";
import { mockPatient } from "../mocks/fixtures";
import { submitCheckIn } from "../lib/data";
import { Mic, Heart, Thermometer, Coffee, PhoneCall, CheckCircle2 } from "lucide-react";
import { AppMode } from "../lib/types";

export default function MeuDiaPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("crianca");
  const [selectedMood, setSelectedMood] = React.useState<MoodValue>("bem");
  const [painPart, setPainPart] = React.useState<BodyPart | undefined>();
  const [painIntensity, setPainIntensity] = React.useState<PainIntensity>("pouco");
  const [temperature, setTemperature] = React.useState<number>(36.5);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSaveCheckIn = async () => {
    await submitCheckIn({
      mood: selectedMood,
      painPart,
      painIntensity: painPart ? painIntensity : undefined,
      tasteSymptoms: ["enjoo-leve"],
      temperature,
      sleepQuality: "otimo",
      notes: "Check-in matinal gravado com sucesso.",
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        title="Meu Dia"
        subtitle={`Bom dia, ${mockPatient.preferredName}!`}
      />

      <div className="px-4 py-5 space-y-5">
        {/* Banner Ilustrado de Boas-Vindas */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FAEBD6] via-[#FDE6CF] to-[#EDE3F5] p-6 border border-[#F1E4D6] shadow-sm">
          <DecorBlob
            variant="leaf"
            color="peach"
            className="absolute -right-8 -bottom-8 w-36 h-36 opacity-60"
          />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-white">
              <img
                src="/illustrations/onboarding-cuidado.jpg"
                alt="Acolhimento"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5F4EC] text-[#2E7D5B] text-xs font-bold mb-1">
                ● Dia 12 do Ciclo
              </span>
              <h2 className="text-xl font-bold font-display text-[#1F2340] leading-tight">
                {mode === "crianca"
                  ? `Como seu corpinho acordou hoje, ${mockPatient.preferredName}?`
                  : `Registro Diário de Saúde da ${mockPatient.preferredName}`}
              </h2>
            </div>
          </div>
        </div>

        {/* Check-in de Voz Amigável */}
        <Card variant="tinted" className="text-center p-6 bg-[#F6F0FA]/70 border-[#EDE3F5]">
          <h3 className="font-bold text-base text-[#1F2340] mb-1">
            🎙️ Conte com a sua voz
          </h3>
          <p className="text-xs text-[#5B5F7A] mb-4">
            Não precisa digitar nada. Toque no microfone e diga como você está se sentindo.
          </p>

          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`w-20 h-20 rounded-full mx-auto flex flex-col items-center justify-center transition-all cursor-pointer shadow-md ${
              isRecording
                ? "bg-[#C0392B] text-white scale-110 animate-pulse"
                : "bg-[#6E3F8C] text-white hover:bg-[#5A3175]"
            }`}
            aria-label={isRecording ? "Parar gravação" : "Gravar áudio"}
          >
            <Mic className="w-7 h-7" />
            <span className="text-[10px] font-bold mt-1">
              {isRecording ? "OUVINDO..." : "FALAR"}
            </span>
          </button>

          {isRecording && (
            <p className="text-xs font-bold text-[#6E3F8C] mt-3 animate-pulse">
              Escutando... &quot;Estou um pouquinho cansada hoje...&quot;
            </p>
          )}
        </Card>

        {/* Pergunta 1: Como você está agora? */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-[#1F2340]">
              Como você está agora?
            </h3>
            <span className="text-xs text-[#5B5F7A] font-semibold">
              Toque em 1 carinha
            </span>
          </div>
          <MoodPicker value={selectedMood} onChange={setSelectedMood} />
        </section>

        {/* Rede de Carinho Acionada se não estiver bem */}
        {selectedMood !== "bem" && (
          <Card className="bg-[#EDE6F6] border-[#B79AD6]/40 p-5 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6E3F8C] shrink-0 shadow-xs">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#1F2340]">
                  Rede de Carinho Avisada!
                </h4>
                <p className="text-xs text-[#5B5F7A] mt-1 leading-relaxed">
                  Avisamos com amor a mamãe Ana Paula e o papai Carlos para te mandarem um abraço agora mesmo.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<PhoneCall className="w-4 h-4" />}
                    onClick={() => (window.location.href = "tel:11981112233")}
                  >
                    Ligar para a Mamãe
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Onde dói no corpo? */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-2">
            O que você está sentindo no corpo?
          </h3>
          <Card>
            <PainScale
              selectedPart={painPart}
              onSelectPart={(p) => setPainPart(painPart === p ? undefined : p)}
              intensity={painIntensity}
              onChangeIntensity={setPainIntensity}
            />
          </Card>
        </section>

        {/* Temperatura e Estômago */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#5B5F7A] mb-2">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-[#C0392B]" />
                Temperatura
              </span>
              <Badge variant={temperature > 37.5 ? "danger" : "success"}>
                {temperature > 37.5 ? "Atenção Febril" : "Sem Febre"}
              </Badge>
            </div>
            <div className="text-center py-2">
              <span className="text-3xl font-black text-[#1F2340]">
                {temperature.toFixed(1)}°C
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTemperature((t) => Math.max(35, t - 0.2))}
                className="w-10 h-10 rounded-xl bg-[#F4F3F1] hover:bg-[#E9E8E6] font-bold text-lg text-[#1F2340] cursor-pointer"
                aria-label="Diminuir temperatura"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setTemperature((t) => Math.min(41, t + 0.2))}
                className="w-10 h-10 rounded-xl bg-[#F4F3F1] hover:bg-[#E9E8E6] font-bold text-lg text-[#1F2340] cursor-pointer"
                aria-label="Aumentar temperatura"
              >
                +
              </button>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B5F7A] mb-2">
              <Coffee className="w-4 h-4 text-[#B04A26]" />
              Paladar & Estômago
            </div>
            <p className="text-xs text-[#5B5F7A] mb-3">
              Sentiu gosto estranho ou enjoo?
            </p>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F3F1] hover:bg-[#EDE3F5] text-[#1F2340] flex items-center justify-between cursor-pointer"
              >
                <span>Gosto de ferro / metálico</span>
                <span className="text-xs text-[#6E3F8C]">Dica 💡</span>
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F3F1] hover:bg-[#EDE3F5] text-[#1F2340] flex items-center justify-between cursor-pointer"
              >
                <span>Enjoo leve após almoço</span>
                <span className="text-xs text-[#6E3F8C]">Ajustar</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Enfermeira Clara Online */}
        <Card className="bg-[#E6EFF0]/60 border-[#134E54]/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-xs">
              <img
                src="/illustrations/equipe-cuidado.jpg"
                alt="Enfermeira Clara"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
                <h4 className="font-bold text-xs text-[#134E54]">
                  Enfermeira Clara está online
                </h4>
              </div>
              <p className="text-xs text-[#5B5F7A] mt-0.5">
                Acompanhando seu prontuário em tempo real pelo Hospital OncoVida.
              </p>
            </div>
          </div>
        </Card>

        {/* Botão de Gravar Check-In */}
        <div className="pt-2 sticky bottom-20 z-20">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSaveCheckIn}
            leftIcon={
              isSaved ? (
                <CheckCircle2 className="w-5 h-5 text-[#E5F4EC]" />
              ) : undefined
            }
          >
            {isSaved ? "Gravado com Sucesso! ❤️" : "Gravar Como Me Sinto Hoje"}
          </Button>
        </div>
      </div>

      <BottomNav
        currentTab="inicio"
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}
