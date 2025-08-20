import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 406, tipo: "Broncoaspiração", titulo: "Episódio durante alimentação", descricao: "Paciente apresentou tosse e dessaturação leve.", severidade: "media", status: "pendente", data: "2025-08-04 12:40" },
];

export default function Broncoaspiracao() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Broncoaspiração"
          subtitulo="Notificações sobre risco e eventos de broncoaspiração"
          tipoModulo="Broncoaspiração"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
