import React from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotifierForm from "@/components/notifier/NotifierForm";

export default function Notificador() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Identificação do Notificador</h2>
          <p className="text-muted-foreground">Cadastre seus dados para facilitar os registros</p>
        </div>
        <NotifierForm />
      </main>
    </div>
  );
}
