import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 402, tipo: "Flebite", titulo: "Sinais de flebite em MSE", descricao: "Vermelhidão e dor no local da punção.", severidade: "media", status: "investigacao", data: "2025-08-08 13:25" },
];

export default function Flebite() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Flebite"
          subtitulo="Eventos de flebite relacionados a terapia intravenosa"
          tipoModulo="Flebite"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
