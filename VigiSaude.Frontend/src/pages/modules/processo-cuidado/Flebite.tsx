import React, { useEffect, useState } from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";
import { getTodasFlebites, PayloadNotificacaoFlebite } from "@/components/forms/services/flebite.service";

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

function mapFlebiteToNotificationRecord(item: PayloadNotificacaoFlebite): NotificationRecord {
  const paciente = item.dadosPaciente ?? ({} as PayloadNotificacaoFlebite["dadosPaciente"]);
  const flebite = item.dadosFlebite ?? ({} as PayloadNotificacaoFlebite["dadosFlebite"]);
  const notificador = item.dadosNotificador ?? ({} as PayloadNotificacaoFlebite["dadosNotificador"]);
  
  return {
    id: flebite.idFlebite ?? "",
    tipo: "Flebite",
    titulo: `Flebite grau ${flebite.grauFlebite ?? "-"} em ${flebite.localPuncao ?? "local não especificado"}`,
    descricao: flebite.descricao ?? flebite.diagnostico ?? "",
    descricaoAdicional: `Tipo cateter: ${flebite.tipoCateter ?? "-"}, Calibre: ${flebite.calibreCateter ?? "-"}, Permanência: ${flebite.tempoPermanenciaAcesso ?? 0}h`,
    severidade: normalizarSeveridade(flebite.classificacaoDano),
    status: "pendente", // ou mapeie conforme necessário
    data: flebite.dataNotificacao ?? "",
    dadosPaciente: {
      nome: paciente.nome,
      prontuario: paciente.protuario,
      setor: flebite.idSetor !== undefined && flebite.idSetor !== null ? String(flebite.idSetor) : undefined,
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
    modalidade: "flebite",
    dadosFormulario: flebite ? (flebite as unknown as Record<string, unknown>) : undefined,
  };
}

export default function Flebite() {
  const [dados, setDados] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getTodasFlebites();
      if (res.success && Array.isArray(res.data)) {
        setDados(res.data.map(mapFlebiteToNotificationRecord));
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
          <div className="p-8 text-center text-muted-foreground">Carregando flebites...</div>
        ) : (
          <NotificationModule
            titulo="Flebite"
            subtitulo="Eventos de flebite relacionados a terapia intravenosa"
            tipoModulo="Flebite"
            dados={dados}
          />
        )}
      </main>
    </div>
  );
}
