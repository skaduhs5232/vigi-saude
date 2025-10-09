
import React, { useEffect, useState } from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";
import { getTodasLesoesPressao, PayloadNotificacaoLesaoPressao } from "@/components/forms/services/lesao-pressao.service";

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

function mapLesaoPressaoToNotificationRecord(item: PayloadNotificacaoLesaoPressao): NotificationRecord {
  const paciente = item.dadosPaciente ?? ({} as PayloadNotificacaoLesaoPressao["dadosPaciente"]);
  const lesao = item.dadosLesaoPressao ?? ({} as PayloadNotificacaoLesaoPressao["dadosLesaoPressao"]);
  const notificador = item.dadosNotificador ?? ({} as PayloadNotificacaoLesaoPressao["dadosNotificador"]);
  return {
    id: lesao.idLesaoPressao ?? "",
    tipo: "Lesão por Pressão",
    titulo: `Lesão estágio ${lesao.estagioLesao ?? "-"}`,
    descricao: lesao.descricao ?? "",
    descricaoAdicional: `Braden: ${lesao.classificacaoBraden ?? "-"}, Escore: ${lesao.escoreBraden ?? "-"}, Dano: ${lesao.classificacaoDano ?? "-"}`,
    severidade: normalizarSeveridade(lesao.classificacaoDano),
    status: "pendente", // ou mapeie conforme necessário
    data: lesao.dataNotificacao ?? "",
    dadosPaciente: {
      nome: paciente.nome,
      prontuario: paciente.protuario,
      setor: lesao.idSetor !== undefined && lesao.idSetor !== null ? String(lesao.idSetor) : undefined,
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
    modalidade: "lesao-pressao",
    dadosFormulario: lesao ? (lesao as unknown as Record<string, unknown>) : undefined,
  };
}

export default function LesaoPressao() {
  const [dados, setDados] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getTodasLesoesPressao();
      if (res.success && Array.isArray(res.data)) {
        setDados(res.data.map(mapLesaoPressaoToNotificationRecord));
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
          <div className="p-8 text-center text-muted-foreground">Carregando lesões por pressão...</div>
        ) : (
          <NotificationModule
            titulo="Lesão por Pressão"
            subtitulo="Notificações relacionadas a lesões por pressão"
            tipoModulo="Lesão por Pressão"
            dados={dados}
          />
        )}
      </main>
    </div>
  );
}
