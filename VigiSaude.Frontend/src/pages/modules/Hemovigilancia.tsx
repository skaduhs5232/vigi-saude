import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  {
    id: 201,
    tipo: "Hemovigilância",
    titulo: "Reação transfusional leve",
    descricao: "Paciente apresentou febre baixa durante transfusão. Medidas adotadas.",
    severidade: "baixa",
    status: "pendente",
    data: "2025-08-09 16:30",
  },
  {
    id: 202,
    tipo: "Hemovigilância",
    titulo: "Atraso na liberação de hemocomponente",
    descricao: "Tempo de espera acima do SLA. Avaliar logística.",
    severidade: "media",
    status: "investigacao",
    data: "2025-08-13 10:05",
  },
];

export default function Hemovigilancia() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Hemovigilância"
          subtitulo="Eventos hemotransfusionais e correlatos"
          tipoModulo="Hemovigilância"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
