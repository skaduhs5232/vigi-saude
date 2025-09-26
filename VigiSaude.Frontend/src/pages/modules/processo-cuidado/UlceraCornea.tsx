import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 404, tipo: "Úlcera de Córnea", titulo: "Sinais de ulceração ocular", descricao: "Paciente com queixa de dor e visão turva.", severidade: "alta", status: "investigacao", data: "2025-08-06 20:10" },
];

export default function UlceraCornea() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Úlcera de Córnea"
          subtitulo="Eventos relacionados à proteção ocular"
          tipoModulo="Úlcera de Córnea"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
