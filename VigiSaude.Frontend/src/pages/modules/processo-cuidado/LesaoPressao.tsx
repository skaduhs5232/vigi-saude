import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 403, tipo: "Lesão por Pressão", titulo: "Lesão sacral estágio 2", descricao: "Paciente acamado com lesão em evolução.", severidade: "media", status: "pendente", data: "2025-08-03 17:00" },
];

export default function LesaoPressao() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Lesão por Pressão"
          subtitulo="Notificações relacionadas a lesões por pressão"
          tipoModulo="Lesão por Pressão"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
