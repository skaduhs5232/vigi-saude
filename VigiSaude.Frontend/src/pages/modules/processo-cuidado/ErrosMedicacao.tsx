import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 401, tipo: "Erros de Medicação", titulo: "Dose duplicada de antibiótico", descricao: "Paciente recebeu dose repetida.", severidade: "alta", status: "pendente", data: "2025-08-05 07:50" },
];

export default function ErrosMedicacao() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Erros de Medicação"
          subtitulo="Eventos relacionados ao processo de medicação"
          tipoModulo="Erros de Medicação"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
