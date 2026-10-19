"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge, BottomNav } from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient, mockSuggestedMeals } from "../../mocks/fixtures";
import { AppMode, NutritionRecommendation } from "../../lib/types";
import { getNutritionRecommendations } from "../../lib/data";
import {
  Utensils,
  Play,
  MessageCircle,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

export default function NutricaoPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("crianca");
  const [mealStatus, setMealStatus] = React.useState<
    "tudo" | "metade" | "enjoo" | undefined
  >();
  const [selectedTip, setSelectedTip] = React.useState<string | null>(
    "metalico"
  );
  const [isSaved, setIsSaved] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<NutritionRecommendation[]>([]);

  React.useEffect(() => {
    getNutritionRecommendations().then(setRecommendations);
  }, []);

  const tips = [
    {
      id: "metalico",
      title: "Gosto Metálico na Boca",
      icon: "🥄",
      text: "Troque garfinhos de metal por talheres de plástico ou madeira/bambu. Picolé de limão ou chupar pastilhas suaves antes das refeições ajuda a limpar as papilas gustativas.",
    },
    {
      id: "sem-gosto",
      title: "Boca Sem Gosto",
      icon: "🍋",
      text: "Tempere com ervas aromáticas (manjericão, alecrim, hortelã) e gotinhas de limão. Molhos cremosos ajudam o alimento a descer com mais sabor.",
    },
    {
      id: "cheiro-forte",
      title: "Cheiro da Comida Incomoda",
      icon: "💨",
      text: "Sirva refeições em temperatura ambiente ou frias. Comidas quentes liberam mais vapor e odor, o que pode disparar a sensação de náusea.",
    },
  ];

  const handleSelectMealStatus = (status: "tudo" | "metade" | "enjoo") => {
    setMealStatus(status);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        title="Nutrição & Paladar"
        subtitle="Alimentação compassiva e sem culpa"
      />

      <div className="px-4 py-5 space-y-5">
        {/* Banner de Nutrição Compassiva */}
        <Card className="bg-[#E6EFF0] border-[#134E54]/20 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#134E54] flex items-center justify-center shrink-0 shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#134E54]">
                Nutrição Compassiva
              </span>
              <h3 className="font-bold text-base text-[#1F2340] mt-0.5">
                Como foi a refeição da {mockPatient.preferredName} hoje?
              </h3>
              <p className="text-xs text-[#5B5F7A] mt-1 leading-relaxed">
                Sem pressão ou culpa. O corpo gasta energia no tratamento e cada colherada é uma vitória.
              </p>
            </div>
          </div>
        </Card>

        {/* Registro Rápido: Quanto conseguiu comer? */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#1F2340]">
              Toque rápido: quanto conseguiu comer?
            </h3>
            {isSaved && (
              <span className="text-xs font-bold text-[#2E7D5B] flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Registrado!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectMealStatus("tudo")}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                mealStatus === "tudo"
                  ? "bg-[#E5F4EC] border-[#2E7D5B] text-[#2E7D5B] font-bold shadow-sm"
                  : "bg-white border-[#F1E4D6] hover:bg-[#FFF8F0]"
              }`}
            >
              <span className="text-2xl">😋</span>
              <div>
                <p className="text-xs font-bold text-[#1F2340]">Desceu muito bem!</p>
                <p className="text-[10px] text-[#5B5F7A]">Comeu quase tudo</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMealStatus("metade")}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                mealStatus === "metade"
                  ? "bg-[#EDE3F5] border-[#6E3F8C] text-[#6E3F8C] font-bold shadow-sm"
                  : "bg-white border-[#F1E4D6] hover:bg-[#FFF8F0]"
              }`}
            >
              <span className="text-2xl">🙂</span>
              <div>
                <p className="text-xs font-bold text-[#1F2340]">Comi a metade</p>
                <p className="text-[10px] text-[#5B5F7A]">Satisfeito, sem enjoo</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMealStatus("enjoo")}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                mealStatus === "enjoo"
                  ? "bg-[#FDECEA] border-[#C0392B] text-[#C0392B] font-bold shadow-sm"
                  : "bg-white border-[#F1E4D6] hover:bg-[#FFF8F0]"
              }`}
            >
              <span className="text-2xl">🤢</span>
              <div>
                <p className="text-xs font-bold text-[#1F2340]">Fiquei enjoada</p>
                <p className="text-[10px] text-[#5B5F7A]">Rejeitou o prato</p>
              </div>
            </button>
          </div>
        </section>

        {/* Recomendações da Equipe Clínica (Portal do Médico) */}
        {recommendations.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#134E54]" />
                <h3 className="text-base font-bold text-[#1F2340]">
                  Orientações da Equipe Nutricional
                </h3>
              </div>
              <Badge variant="clinical">{recommendations.length} ativas</Badge>
            </div>
            <div className="space-y-2.5">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="p-4 bg-gradient-to-r from-[#E6EFF0]/80 to-white border-[#134E54]/25 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#134E54] flex items-center gap-1.5">
                      <span>🥗</span>
                      <span>{rec.title}</span>
                    </h4>
                    <span className="text-[10px] text-[#5B5F7A] shrink-0 font-medium">
                      {rec.at}
                    </span>
                  </div>
                  <p className="text-xs text-[#1F2340] mt-1.5 leading-relaxed">
                    {rec.text}
                  </p>
                  <div className="mt-2 text-[10px] text-[#5B5F7A] flex items-center gap-1">
                    <span>Prescrito por:</span>
                    <strong className="text-[#134E54]">{rec.by}</strong>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Refeições Sugeridas */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-[#1F2340]">
              Cardápio Suave Sugerido
            </h3>
            <Badge variant="clinical">Ciclo 3 • Fácil Digestão</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockSuggestedMeals.map((meal) => (
              <Card key={meal.id} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="plum">{meal.tag}</Badge>
                    <span className="text-xs font-bold text-[#5B5F7A]">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1F2340]">
                    {meal.title}
                  </h4>
                  <p className="text-xs text-[#5B5F7A] mt-1 leading-relaxed">
                    {meal.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#F1E4D6] flex items-center justify-between text-xs font-semibold text-[#134E54]">
                  <span>✨ {meal.highlight}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas Práticas para Paladar Alterado */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-2">
            Sentindo a boca diferente?
          </h3>
          <p className="text-xs text-[#5B5F7A] mb-3">
            Toque no sintoma para ver uma dica prática de conforto imediato:
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tips.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTip(t.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTip === t.id
                    ? "bg-[#6E3F8C] text-white shadow-sm"
                    : "bg-white text-[#5B5F7A] border border-[#F1E4D6] hover:bg-[#FFF8F0]"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.title}</span>
              </button>
            ))}
          </div>

          {selectedTip && (
            <Card className="p-4 bg-[#EDE3F5]/60 border-[#6E3F8C]/30 animate-in fade-in">
              {(() => {
                const tip = tips.find((t) => t.id === selectedTip);
                if (!tip) return null;
                return (
                  <div>
                    <h5 className="font-bold text-xs text-[#6E3F8C] mb-1 flex items-center gap-1">
                      💡 Dica Especial: {tip.title}
                    </h5>
                    <p className="text-xs text-[#1F2340] leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                );
              })()}
            </Card>
          )}
        </section>

        {/* Pílulas de Conhecimento em Vídeo */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-[#1F2340]">
              Pílulas de Conhecimento
            </h3>
            <span className="text-xs font-bold text-[#6E3F8C]">Ver todas (12)</span>
          </div>

          <Card className="p-4 overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden bg-[#FAEBD6] aspect-video flex items-center justify-center mb-3">
              <img
                src="/illustrations/equipe-cuidado.jpg"
                alt="Vídeo Dra. Camila"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-[#1F2340]/25 flex items-center justify-center">
                <button
                  type="button"
                  className="w-12 h-12 rounded-full bg-[#C0392B] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  aria-label="Assistir vídeo"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                4:15 min
              </span>
            </div>
            <h4 className="font-bold text-sm text-[#1F2340]">
              Como diminuir o enjoo e a náusea pós-quimioterapia
            </h4>
            <p className="text-xs text-[#5B5F7A] mt-1">
              Dra. Camila Albuquerque • Nutricionista Oncológica Infantil
            </p>
          </Card>
        </section>

        {/* Canal de Dúvidas WhatsApp */}
        <Card className="bg-[#E5F4EC]/60 border-[#2E7D5B]/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#2E7D5B] text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-[#2E7D5B]">
                  Dúvida sobre a alimentação ou reação?
                </h5>
                <p className="text-[11px] text-[#5B5F7A]">
                  Fale com nossa equipe de nutrição e enfermagem.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                (window.location.href = "https://wa.me/5511987654321")
              }
            >
              Conversar
            </Button>
          </div>
        </Card>
      </div>

      <BottomNav
        currentTab="nutricao"
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}
