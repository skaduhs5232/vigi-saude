import React, { useEffect, useState } from "react"; // ✅ ADICIONAR useEffect e useState
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import NotificationModule, { NotificationRecord } from "@/components/notifications/NotificationModule";
import { buscarTodosErrosMedicacao } from "@/components/forms/services"; // ✅ ADICIONAR IMPORT

// ❌ REMOVER ou COMENTAR os dados mock
// const dadosMock: NotificationRecord[] = [
//   { id: 401, tipo: "Erros de Medicação", titulo: "Dose duplicada de antibiótico", descricao: "Paciente recebeu dose repetida.", severidade: "alta", status: "pendente", data: "2025-08-05 07:50" },
// ];

export default function ErrosMedicacao() {
  // ✅ ADICIONAR: Estado para armazenar os dados
  const [dados, setDados] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ ADICIONAR: useEffect para buscar dados da API
  useEffect(() => {
    async function carregarErros() {
      try {
        console.log('📤 Buscando erros de medicação...');
        
        const resultado = await buscarTodosErrosMedicacao();
        
        if (resultado.success && Array.isArray(resultado.data)) {
          console.log('✅ Dados recebidos:', resultado.data);
          
          // ✅ TRANSFORMAR os dados da API para o formato do componente
          const dadosFormatados: NotificationRecord[] = resultado.data.map((erro: any) => ({
            id: erro.dadosErroMedicacao?.idErroMedicacao || erro.idErroMedicacao || 0,
            tipo: "Erros de Medicação",
            titulo: erro.titulo || erro.dadosErroMedicacao?.descricao || "Erro de medicação",
            descricao: erro.dadosErroMedicacao?.descricao || erro.descricao || "",
            severidade: erro.dadosErroMedicacao?.classificacaoDano?.toLowerCase() || "média",
            status: erro.status || "pendente",
            data: erro.dadosErroMedicacao?.dataInicio || erro.dataInicio || new Date().toISOString().split('T')[0],
          }));
          
          console.log('✅ Dados formatados:', dadosFormatados);
          setDados(dadosFormatados);
        } else {
          console.warn('⚠️ Nenhum erro de medicação encontrado');
          setDados([]);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar erros de medicação:', error);
        setDados([]);
      } finally {
        setLoading(false);
      }
    }

    carregarErros();
  }, []); // ← Array vazio = executa apenas 1 vez ao montar o componente

  // ✅ ADICIONAR: Indicador de loading
  if (loading) {
    return (
      <div className="min-h-screen w-full flex bg-background">
        <HealthWatchSidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando erros de medicação...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      <main className="flex-1 overflow-auto">
        <NotificationModule
          titulo="Erros de Medicação"
          subtitulo="Eventos relacionados ao processo de medicação"
          tipoModulo="Erros de Medicação"
          dados={dados} // ✅ USAR dados reais da API (não mais dadosMock)
        />
      </main>
    </div>
  );
}