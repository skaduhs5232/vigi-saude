import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  {
    id: 1,
    tipo: "Farmacovigilância",
    titulo: "Reação adversa a Dipirona",
    descricao: "Paciente apresentou rash cutâneo e prurido após administração de Dipirona.",
    severidade: "alta",
    status: "pendente",
    data: "2025-08-10 14:22",
  },
  {
    id: 2,
    tipo: "Farmacovigilância",
    titulo: "Náusea persistente pós-medicação",
    descricao: "Evento relatado após uso de antibiótico. Sem sinais de desidratação.",
    severidade: "media",
    status: "investigacao",
    data: "2025-08-11 09:10",
  },
];

export default function Farmacovigilancia() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Farmacovigilância"
          subtitulo="Gerencie as notificações de reações adversas a medicamentos"
          tipoModulo="Farmacovigilância"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
