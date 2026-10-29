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
  type MoodValue,
  type BodyPart,
  type PainIntensity,
} from "@siglo/ui";
import { Header } from "../components/Header";
import { mockPatient } from "../mocks/fixtures";
import {
  getActiveCaregiver,
  submitCheckIn,
  verifyCheckIn,
} from "../lib/data";
import { caregiverTag } from "../lib/caregiver";
import {
  Thermometer,
  CheckCircle2,
  CheckCheck,
} from "lucide-react";
import { AppMode, CaregiverProfile, DailyCheckIn } from "../lib/types";

export default function MeuDiaPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [activeCaregiver, setActiveCaregiver] =
    React.useState<CaregiverProfile | null>(null);
  const [selectedMood, setSelectedMood] = React.useState<MoodValue>("bem");
  const [painPart, setPainPart] = React.useState<BodyPart | undefined>();
  const [painIntensity, setPainIntensity] = React.useState<PainIntensity>("pouco");
  const [temperature, setTemperature] = React.useState<number>(36.5);
  const [isSaved, setIsSaved] = React.useState(false);
  const [lastCheckIn, setLastCheckIn] = React.useState<DailyCheckIn | null>(null);

  React.useEffect(() => {
    getActiveCaregiver().then(setActiveCaregiver);
  }, []);

  const readOnly = mode === "crianca";

  const handleSaveCheckIn = async () => {
    const saved = await submitCheckIn(
      {
        mood: selectedMood,
        painPart,
        painIntensity: painPart ? painIntensity : undefined,
        tasteSymptoms: [],
        temperature,
        sleepQuality: "otimo",
      },
      activeCaregiver?.id
    );
    setLastCheckIn(saved);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleVerifyCheckIn = async () => {
    if (!lastCheckIn) return;
    const updated = await verifyCheckIn(lastCheckIn.id, activeCaregiver?.id);
    if (updated) setLastCheckIn(updated);
  };

  const checkInPerformer = lastCheckIn?.performedBy;
  const canVerifyCheckIn =
    !readOnly &&
    !!lastCheckIn &&
    !lastCheckIn.verifiedBy &&
    !!activeCaregiver &&
    !!checkInPerformer &&
    checkInPerformer.id !== activeCaregiver.id;

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        onCaregiverChange={setActiveCaregiver}
      />

      <div className="px-4 py-4 pb-28 space-y-4">
        {/* Saudação enxuta */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FAEBD6] via-[#FDE6CF] to-[#EDE3F5] p-4 border border-[#F1E4D6] flex items-center gap-3">
          <img
            src="/illustrations/onboarding-cuidado.jpg"
            alt={mockPatient.preferredName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0 bg-white"
          />
          <div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#E5F4EC] text-[#2E7D5B] text-[10px] font-bold mb-0.5">
              Dia 12 do Ciclo
            </span>
            <h2 className="text-base font-extrabold text-[#1F2340] leading-snug">
              Olá, {mockPatient.preferredName}! Como você está hoje?
            </h2>
          </div>
        </div>

        {/* 1. Humor */}
        <section>
          <h3 className="text-sm font-bold text-[#1F2340] mb-2">
            Como está o humor agora?
          </h3>
          <MoodPicker value={selectedMood} onChange={setSelectedMood} />
        </section>

        {/* 2. Escala de Dor */}
        <section>
          <h3 className="text-sm font-bold text-[#1F2340] mb-2">
            Sente algum incômodo no corpo?
          </h3>
          <Card className="p-4">
            <PainScale
              selectedPart={painPart}
              onSelectPart={(p) => setPainPart(painPart === p ? undefined : p)}
              intensity={painIntensity}
              onChangeIntensity={setPainIntensity}
            />
          </Card>
        </section>

        {/* 3. Temperatura */}
        <Card className="p-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B5F7A]">
              <Thermometer className="w-4 h-4 text-[#C0392B]" />
              <span>Temperatura</span>
              <Badge variant={temperature > 37.5 ? "danger" : "success"}>
                {temperature > 37.5 ? "Febril" : "Normal"}
              </Badge>
            </div>
            <p className="text-2xl font-black text-[#1F2340] mt-1">
              {temperature.toFixed(1)}°C
            </p>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Botão de Gravar Check-In */}
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

        {/* Linha única de rastreabilidade do check-in */}
        {lastCheckIn && checkInPerformer && (
          <div className="space-y-2" data-testid="checkin-trail">
            <p className="text-xs font-bold text-[#1F2340] bg-[#E5F4EC] border border-[#2E7D5B]/25 rounded-xl px-3 py-2 leading-snug">
              ✅ {lastCheckIn.performedAt} por {caregiverTag(checkInPerformer)} (
              {lastCheckIn.temperature.toFixed(1)}°C)
              {lastCheckIn.verifiedBy
                ? ` · ✓ ${lastCheckIn.verifiedBy.relationLabel}`
                : ""}
            </p>

            {canVerifyCheckIn && (
              <button
                type="button"
                onClick={handleVerifyCheckIn}
                className="w-full min-h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 border-[#134E54] text-[#134E54] bg-white hover:bg-[#E6EFF0] transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" aria-hidden="true" />
                Conferir / Confirmar registro
              </button>
            )}
          </div>
        )}
      </div>

      <BottomNav
        currentTab="inicio"
        mode={mode}
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}

