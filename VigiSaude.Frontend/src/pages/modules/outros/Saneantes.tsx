import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 503, tipo: "Vigilância de Saneantes", titulo: "Irritação devido a saneante", descricao: "Relato de irritação respiratória após uso concentrado.", severidade: "alta", status: "investigacao", data: "2025-08-15 19:45" },
];

export default function Saneantes() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Vigilância de Saneantes"
          subtitulo="Eventos e reações relacionadas a saneantes"
          tipoModulo="Vigilância de Saneantes"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
