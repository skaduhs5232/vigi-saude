import React, { useEffect, useState } from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";
import { GetTodasQuedas, PayloadNotificacaoQueda } from "@/components/forms/services/queda.service";

function normalizarSeveridade(classificacaoDano?: string): NotificationRecord["severidade"] {
  switch ((classificacaoDano || "").toLowerCase()) {
    case "grave":
    case "óbito":
    case "obito":
      return "alta";
    case "moderado":
      return "media";
    case "leve":
    case "nenhum":
      return "baixa";
    default:
      return "media";
  }
}

function mapQuedaNotificationRecord(item: PayloadNotificacaoQueda): NotificationRecord {
  const paciente = item.dadosPaciente ?? ({} as PayloadNotificacaoQueda["dadosPaciente"]);
  const queda = item.dadosQueda ?? ({} as PayloadNotificacaoQueda["dadosQueda"]);
  const notificador = item.dadosNotificador ?? ({} as PayloadNotificacaoQueda["dadosNotificador"]);
  return {
    id: queda.idQueda ?? "",
    tipo: "Queda",
    titulo:queda.tipoQuedaId ? `Queda tipo ID ${queda.tipoQuedaId}` : "Queda",
    descricao: queda.descricao ?? "",
    severidade: normalizarSeveridade(queda.classificacaoDano),
    status: "pendente", 
    data: queda.dataNotificacao ?? "",


    dadosPaciente: {
      nome: paciente.nome,
      prontuario: paciente.protuario,
      setor: queda.idSetor !== undefined && queda.idSetor !== null ? String(queda.idSetor) : undefined,
      leito: paciente.leito,
      sexo: paciente.sexo,
      peso: paciente.peso !== undefined && paciente.peso !== null ? String(paciente.peso) : undefined,
      dataNascimento: paciente.dataNascimento,
    },


    dadosNotificador: {
      nome: notificador.nome,
      email: notificador.email,
      telefone: notificador.telefone,
      tipo: notificador.funcionarioGerenciaRisco ? "Funcionário da gerência de risco" : "Não",
      setor: notificador.setor !== undefined && notificador.setor !== null ? String(notificador.setor) : undefined,
      categoria: notificador.categoria,
    },
    modalidade: "queda",
    dadosFormulario: queda ? (queda as unknown as Record<string, unknown>) : undefined,
  };
}


export default function Queda() {
  const [dados, setDados] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await GetTodasQuedas();
      if (res.success && Array.isArray(res.data)) {
        setDados(res.data.map(mapQuedaNotificationRecord));
      } else {
        setDados([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando queda...</div>
        ) : (
          <NotificationModule
            titulo="Quedas"
            subtitulo="Notificações relacionadas a quedas"
            tipoModulo="Queda"
            dados={dados}
          />
        )}
      </main>
    </div>
  );
}
