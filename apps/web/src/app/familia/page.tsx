"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Avatar, Badge, BottomNav, Field, Input } from "@siglo/ui";
import { Header } from "../../components/Header";
import { mockPatient, mockFamilyMembers } from "../../mocks/fixtures";
import { AppMode, FamilyMember, ClinicalMessage } from "../../lib/types";
import { getTeamGuidance } from "../../lib/data";
import { Heart, Send, MessageCircle, Phone, Sparkles, Stethoscope, AlertTriangle } from "lucide-react";

export default function FamiliaPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AppMode>("crianca");
  const [family] = React.useState<FamilyMember[]>(mockFamilyMembers);
  const [teamGuidance, setTeamGuidance] = React.useState<ClinicalMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState("");

  React.useEffect(() => {
    getTeamGuidance().then(setTeamGuidance);
  }, []);
  const [messages, setMessages] = React.useState([
    {
      id: "1",
      sender: "Vovó Marlene",
      text: "Minha netinha linda, a vovó fez aquele bolo de cenoura quentinho pra quando você estiver em casa! Amo você! ❤️",
      time: "Hoje às 11:30",
      avatar: "/illustrations/onboarding-familia.jpg",
    },
    {
      id: "2",
      sender: "Papai Carlos",
      text: "Hoje à noite tem historinha do Capitão Estrela antes de dormir! Força, meu amor!",
      time: "Hoje às 09:15",
      avatar: "/illustrations/onboarding-cuidado.jpg",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      {
        id: String(Date.now()),
        sender: mode === "crianca" ? mockPatient.preferredName : "Mamãe Ana Paula",
        text: newMessage,
        time: "Agora",
        avatar: "/illustrations/mascote-lumi.jpg",
      },
      ...prev,
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        patient={mockPatient}
        mode={mode}
        onToggleMode={setMode}
        title="Rede de Família"
        subtitle="Carinho e amor de quem cuida de você"
      />

      <div className="px-4 py-5 space-y-5">
        {/* Banner Ilustrado */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#EDE3F5] via-[#FDE6CF] to-[#FFF8F0] p-6 border border-[#F1E4D6] flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-white">
            <img
              src="/illustrations/onboarding-familia.jpg"
              alt="Família unida"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#6E3F8C] font-bold text-xs mb-1">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Rede de Amor Ativa</span>
            </div>
            <h2 className="text-lg font-bold font-display text-[#1F2340]">
              Todos torcendo pela {mockPatient.preferredName}
            </h2>
            <p className="text-xs text-[#5B5F7A] mt-0.5">
              Recados, áudios e carinho para alegrar o dia.
            </p>
          </div>
        </div>

        {/* Orientações Clínicas da Equipe de Saúde (/medico/comunicacao) */}
        {teamGuidance.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#134E54]" />
                <h3 className="text-base font-bold text-[#1F2340]">
                  Orientações da Equipe Médica
                </h3>
              </div>
              <Badge variant="clinical">{teamGuidance.length} avisos</Badge>
            </div>

            <div className="space-y-2.5">
              {teamGuidance.map((msg) => (
                <Card
                  key={msg.id}
                  className={`p-4 border ${
                    msg.priority === "urgente"
                      ? "bg-[#FEF2F2] border-[#E0533C]/30"
                      : "bg-[#E6EFF0]/60 border-[#134E54]/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1F2340]">
                        {msg.author}
                      </span>
                      {msg.priority === "urgente" ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E0533C] text-white">
                          <AlertTriangle className="w-2.5 h-2.5" /> Atenção
                        </span>
                      ) : (
                        <Badge variant="clinical">Equipe</Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-[#5B5F7A]">{msg.at}</span>
                  </div>
                  <p className="text-xs text-[#1F2340] leading-relaxed">
                    {msg.text}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Guardiões Familiares Conectados */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2340]">
              Guardiões Conectados ({family.length})
            </h3>
            <Badge variant="plum">Tempo Real</Badge>
          </div>

          <div className="space-y-3">
            {family.map((member) => (
              <Card key={member.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    fallback={member.name.slice(0, 2).toUpperCase()}
                    src={member.avatarUrl}
                    size="md"
                    status="online"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#1F2340]">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#5B5F7A]">{member.relation}</p>
                    {member.lastMessage && (
                      <p className="text-[11px] text-[#6E3F8C] font-medium mt-0.5 line-clamp-1">
                        &quot;{member.lastMessage}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => (window.location.href = `tel:${member.phone.replace(/\D/g, "")}`)}
                    className="p-2.5 rounded-xl bg-[#EDE3F5] text-[#6E3F8C] hover:bg-[#E5D7F0] transition-colors cursor-pointer"
                    aria-label={`Ligar para ${member.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = `https://wa.me/55${member.phone.replace(/\D/g, "")}`)
                    }
                    className="p-2.5 rounded-xl bg-[#E5F4EC] text-[#2E7D5B] hover:bg-[#D5EEDB] transition-colors cursor-pointer"
                    aria-label={`WhatsApp para ${member.name}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Enviar Mensagem de Carinho */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F08A5D]" />
            Mandar um Recado com Amor
          </h3>

          <Card className="p-4">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <Field
                label="Escreva seu recadinho de carinho"
                helperText="Todos os membros da família conectados poderão ler e responder."
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Te amo muito, estou com saudades!"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="px-5 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Field>
            </form>
          </Card>
        </section>

        {/* Mural de Recados Recentes */}
        <section>
          <h3 className="text-base font-bold text-[#1F2340] mb-3">
            Mural de Recadinhos Recentes
          </h3>

          <div className="space-y-3">
            {messages.map((msg) => (
              <Card key={msg.id} className="p-4 bg-white/90">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1F2340]">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-[#5B5F7A]">
                      • {msg.time}
                    </span>
                  </div>
                  <span className="text-sm">💖</span>
                </div>
                <p className="text-xs text-[#1F2340] leading-relaxed">
                  {msg.text}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <BottomNav
        currentTab="familia"
        onSelectTab={(_id, href) => router.push(href)}
      />
    </div>
  );
}
