import React, { useEffect, useState } from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";
import { getTodosErrosMedicacao, getErroMedicacaoPorId, PayloadErroMedicacao } from "@/components/forms/services/erro-medicacao.service";
import { toast } from "sonner";

export default function ErrosMedicacao() {
  const [dados, setDados] = useState<NotificationRecord[]>([]);

  const mapToRecord = (item: PayloadErroMedicacao): NotificationRecord => {
    // Mapeamento de severidade baseado na classificação do dano
    let severidade: "baixa" | "media" | "alta" = "baixa";
    const dano = item.dadosErroMedicacao.classificacaoDano?.toLowerCase() || "";
    if (dano.includes("grave") || dano.includes("óbito") || dano.includes("permanente")) severidade = "alta";
    else if (dano.includes("moderado") || dano.includes("temporário")) severidade = "media";

    return {
      id: item.dadosErroMedicacao.idErroMedicacao,
      tipo: "Erros de Medicação",
      titulo: `Erro de Medicação - ${item.dadosPaciente.nome}`,
      descricao: item.dadosErroMedicacao.descricao,
      severidade: severidade,
      status: "pendente", // Status padrão pois não vem da API
      data: new Date(item.dadosErroMedicacao.dataNotificacao).toLocaleString(),
      dadosPaciente: {
        nome: item.dadosPaciente.nome,
        prontuario: item.dadosPaciente.protuario,
        leito: item.dadosPaciente.leito,
        sexo: item.dadosPaciente.sexo,
        peso: String(item.dadosPaciente.peso),
        dataNascimento: new Date(item.dadosPaciente.dataNascimento).toLocaleDateString(),
      },
      dadosNotificador: {
        nome: item.dadosNotificador.nome,
        email: item.dadosNotificador.email,
        telefone: item.dadosNotificador.telefone,
        setor: String(item.dadosNotificador.setor),
        categoria: item.dadosNotificador.categoria,
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodosErrosMedicacao();
        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map(mapToRecord);
          setDados(mapped);
        } else {
          toast.error("Erro ao carregar erros de medicação");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro de conexão ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const handleView = async (id: string | number): Promise<NotificationRecord | null> => {
    try {
      const response = await getErroMedicacaoPorId(Number(id));
      if (response.success && response.data) {
        return mapToRecord(response.data as PayloadErroMedicacao);
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Erros de Medicação"
          subtitulo="Eventos relacionados ao processo de medicação"
          tipoModulo="Erros de Medicação"
          dados={dados}
          onView={handleView}
        />
      </main>
    </div>
  );
}
