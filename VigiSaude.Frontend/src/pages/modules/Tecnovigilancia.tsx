import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  {
    id: 101,
    tipo: "Tecnovigilância",
    titulo: "Falha em bomba de infusão",
    descricao: "Equipamento apresentou alarme contínuo e interrupção na infusão.",
    severidade: "media",
    status: "investigacao",
    data: "2025-08-12 08:15",
  },
  {
    id: 102,
    tipo: "Tecnovigilância",
    titulo: "Descalibração de monitor cardíaco",
    descricao: "Leituras intermitentes acima do esperado. Verificação técnica necessária.",
    severidade: "baixa",
    status: "resolvida",
    data: "2025-08-12 18:40",
  },
];

export default function Tecnovigilancia() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Tecnovigilância"
          subtitulo="Ocorrências relacionadas a dispositivos e tecnologias em saúde"
          tipoModulo="Tecnovigilância"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
