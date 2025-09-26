import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 405, tipo: "Queda", titulo: "Queda da própria altura", descricao: "Sem fraturas aparentes. Avaliação clínica em andamento.", severidade: "baixa", status: "resolvida", data: "2025-08-02 22:00" },
];

export default function Queda() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Queda"
          subtitulo="Eventos de queda em ambiente assistencial"
          tipoModulo="Queda"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
