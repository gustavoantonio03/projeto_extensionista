"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Avatar, Badge, BottomNav, Input } from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient } from "../../mocks/fixtures";
import { AppMode, CaregiverProfile } from "../../lib/types";
import {
  getCaregivers,
  getActiveCaregiver,
  setActiveCaregiver,
} from "../../lib/data";
import { caregiverTag } from "../../lib/caregiver";
import {
  Heart,
  Send,
  UserCheck,
  Users,
  Check,
} from "lucide-react";

export default function FamiliaPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("cuidador");
  const [caregivers, setCaregivers] = React.useState<CaregiverProfile[]>([]);
  const [activeCaregiver, setActiveCaregiverState] =
    React.useState<CaregiverProfile | null>(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    const [c, a] = await Promise.all([getCaregivers(), getActiveCaregiver()]);
    setCaregivers(c);
    setActiveCaregiverState(a);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSwitchCaregiver = async (id: string) => {
    const updated = await setActiveCaregiver(id);
    setActiveCaregiverState(updated);
    setFeedbackMsg(`Turno assumido por ${caregiverTag(updated)}!`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const [messages, setMessages] = React.useState([
    {
      id: "1",
      sender: "Avó (Helena)",
      text: "Fiz bolo de cenoura quentinho pra você! Amo muito! ❤️",
    },
    {
      id: "2",
      sender: "Pai (Carlos)",
      text: "Hoje à noite tem historinha do Capitão Estrela antes de dormir!",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) =>
      [
        {
          id: String(Date.now()),
          sender:
            mode === "crianca"
              ? mockPatient.preferredName
              : activeCaregiver
                ? caregiverTag(activeCaregiver)
                : "Mãe (Ana)",
          text: newMessage.trim(),
        },
        ...prev,
      ].slice(0, 2)
    );
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        onCaregiverChange={(cg) => setActiveCaregiverState(cg)}
      />

      <div className="px-4 py-4 pb-28 space-y-5">
        {/* 1. Cuidadores da Conta (Mãe, Pai, Avó) e Troca de Turno */}
        <section aria-label="Cuidadores da Conta">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-extrabold text-[#1F2340] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#6E3F8C]" />
              Cuidadores da Conta ({caregivers.length})
            </h2>
            {activeCaregiver && (
              <Badge variant="success">
                Ativo: {activeCaregiver.relationLabel}
              </Badge>
            )}
          </div>

          {feedbackMsg && (
            <div
              role="status"
              className="mb-2.5 p-2.5 rounded-xl bg-[#E5F4EC] border border-[#2E7D5B]/30 text-xs font-bold text-[#2E7D5B]"
            >
              ✅ {feedbackMsg}
            </div>
          )}

          <div className="space-y-2.5">
            {caregivers.map((cg) => {
              const isActive = activeCaregiver?.id === cg.id;
              return (
                <Card
                  key={cg.id}
                  className={`p-3.5 flex items-center justify-between gap-3 transition-all ${
                    isActive
                      ? "bg-white border-[#6E3F8C] ring-2 ring-[#6E3F8C]/20"
                      : "bg-white/85 border-[#F1E4D6]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        fallback={cg.shortName.slice(0, 2).toUpperCase()}
                        src={cg.avatarUrl}
                        size="md"
                      />
                      {isActive && (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center border border-white"
                          title="Cuidador ativo"
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1F2340]">
                        {cg.relationLabel} ({cg.shortName})
                      </h3>
                      <p className="text-xs text-[#5B5F7A]">{cg.name}</p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E5F4EC] text-[#2E7D5B] text-xs font-bold border border-[#2E7D5B]/25">
                      <UserCheck className="w-3.5 h-3.5" /> No turno
                    </span>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSwitchCaregiver(cg.id)}
                      className="text-xs"
                    >
                      Assumir Turno
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* 2. Mural de Carinho (máximo 2 recados curtos, sem datas/horários complexos) */}
        <section aria-label="Mural de Carinho">
          <h3 className="text-base font-extrabold text-[#1F2340] mb-2.5 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#F08A5D] fill-current" />
            Mural de Carinho
          </h3>

          <div className="space-y-2.5 mb-3">
            {messages.slice(0, 2).map((msg) => (
              <Card key={msg.id} className="p-3.5 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#6E3F8C]">
                    {msg.sender}
                  </span>
                  <span className="text-xs" aria-hidden="true">
                    💖
                  </span>
                </div>
                <p className="text-xs text-[#1F2340] leading-relaxed">
                  {msg.text}
                </p>
              </Card>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Escreva um recado curto de carinho..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="px-4 shrink-0"
              aria-label="Enviar recado"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </section>
      </div>

      <BottomNav
        currentTab="familia"
        mode={mode}
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}

