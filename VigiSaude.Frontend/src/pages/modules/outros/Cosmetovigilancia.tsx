import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";

const dadosMock: NotificationRecord[] = [
  { id: 502, tipo: "Cosmetovigilância", titulo: "Dermatite após uso de cosmético", descricao: "Paciente refere prurido e eritema após uso de creme.", severidade: "baixa", status: "pendente", data: "2025-08-14 15:30" },
];

export default function Cosmetovigilancia() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Cosmetovigilância"
          subtitulo="Reações e eventos relacionados a cosméticos"
          tipoModulo="Cosmetovigilância"
          dados={dadosMock}
        />
      </main>
    </div>
  );
}
