import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 501, tipo: "Biovigilância", titulo: "Exposição biológica acidental", descricao: "Contato com material biológico. PPE utilizado.", severidade: "media", status: "investigacao", data: "2025-08-07 06:20" },
];

export default function Biovigilancia() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Biovigilância"
          subtitulo="Eventos relacionados a agentes biológicos"
          tipoModulo="Biovigilância"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
