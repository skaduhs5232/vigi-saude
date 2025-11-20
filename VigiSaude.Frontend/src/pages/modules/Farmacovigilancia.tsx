import React, { useEffect, useState } from "react";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";
import { getTodasRams, getRamPorId, PayloadRam } from "@/components/forms/services/reacao-adversa.service";
import { toast } from "sonner";

export default function Farmacovigilancia() {
  const [dados, setDados] = useState<NotificationRecord[]>([]);

  const mapToRecord = (item: PayloadRam): NotificationRecord => {
    // Mapeamento de severidade
    let severidade: "baixa" | "media" | "alta" = "baixa";
    const dano = item.dadosRam.classificacaoDano?.toLowerCase() || "";
    if (dano.includes("grave") || dano.includes("óbito") || dano.includes("permanente")) severidade = "alta";
    else if (dano.includes("moderado") || dano.includes("temporário")) severidade = "media";

    return {
      id: item.dadosRam.idRam,
      tipo: "Farmacovigilância",
      titulo: `Reação Adversa - ${item.dadosPaciente.nome}`,
      descricao: item.dadosRam.descricao,
      severidade: severidade,
      status: "pendente",
      data: new Date(item.dadosRam.dataNotificacao).toLocaleString(),
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
        const response = await getTodasRams();
        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map(mapToRecord);
          setDados(mapped);
        } else {
          toast.error("Erro ao carregar reações adversas");
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
      const response = await getRamPorId(Number(id));
      if (response.success && response.data) {
        return mapToRecord(response.data as PayloadRam);
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
          titulo="Farmacovigilância"
          subtitulo="Gerencie as notificações de reações adversas a medicamentos"
          tipoModulo="Farmacovigilância"
          dados={dados}
          onView={handleView}
        />
      </main>
    </div>
  );
}
