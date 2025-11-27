import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileDown, Plus, Search, Eye, Pencil } from "lucide-react";
import * as XLSX from "xlsx";
import { CreateNotificationDialog } from "./CreateNotificationDialog";
import { Notifier } from "@/components/notifier/NotifierForm";
import { NotifierDialog } from "@/components/notifier/NotifierDialog";
import { getLesaoById, PayloadNotificacaoLesaoPressao } from "@/components/forms/services/lesao-pressao.service";
import { getFlebiteById, PayloadNotificacaoFlebite } from "@/components/forms/services/flebite.service";

export type NotificationRecord = {
  id: string | number;
  tipo: string; // tipo/módulo (ex: Farmacovigilância)
  titulo: string;
  descricao: string;
  descricaoAdicional?: string; // opcional
  severidade: "baixa" | "media" | "alta";
  status: "pendente" | "investigacao" | "resolvida";
  data: string; // ISO string ou data legível
  // Dados específicos dos formulários
  modalidade?: string; // ex: "reacao-adversa", "erro-medicacao", "queda", etc.
  dadosFormulario?: Record<string, unknown>; // dados do formulário preenchido
  dadosPaciente?: {
    nome?: string;
    prontuario?: string;
    setor?: string;
    leito?: string;
    sexo?: string;
    peso?: string;
    dataNascimento?: string;
  };
  dadosNotificador?: {
    nome?: string;
    email?: string;
    telefone?: string;
    tipo?: string;
    setor?: string;
    categoria?: string;
  };
};

export type NotificationModuleProps = {
  titulo: string;
  subtitulo?: string;
  tipoModulo: string; // ex: "Farmacovigilância"
  dados: NotificationRecord[];
  onAdicionar?: () => void; // ação adicional ao criar novo
  onView?: (id: string | number) => Promise<NotificationRecord | null>;
};

export function NotificationModule({ titulo, subtitulo, tipoModulo, dados, onAdicionar, onView }: NotificationModuleProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filtroSeveridade, setFiltroSeveridade] = useState<string>("todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [selected, setSelected] = useState<NotificationRecord | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [rows, setRows] = useState<NotificationRecord[]>(dados);
  const [openNotifier, setOpenNotifier] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [editRecord, setEditRecord] = useState<NotificationRecord | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editSeveridade, setEditSeveridade] = useState<NotificationRecord["severidade"]>("baixa");
  const [editStatus, setEditStatus] = useState<NotificationRecord["status"]>("pendente");
  const [viewRecord, setViewRecord] = useState<NotificationRecord | null>(null);
  const [openView, setOpenView] = useState(false);

  // Mapear tipos de notificação para modalidades de formulário
  const getModalidadeFromTipo = (tipo: string): string => {
    const tipoMap: Record<string, string> = {
      "Farmacovigilância": "reacao-adversa",
      "Reação adversa a medicamento": "reacao-adversa", 
      "Erro de medicação": "erro-medicacao",
      "Erros de medicação": "erro-medicacao",
      "Flebite": "flebite",
      "Queda": "queda",
      "Lesão por pressão": "lesao-pressao",
    };
    
    return tipoMap[tipo] || "padrao";
  };

  React.useEffect(() => {
    setRows(dados);
  }, [dados]);

  const handleView = async (record: NotificationRecord) => {
    if (onView) {
      const loadingId = toast.loading("Carregando detalhes...");
      try {
        const details = await onView(record.id);
        toast.dismiss(loadingId);
        if (details) {
          setViewRecord(details);
          setOpenView(true);
        } else {
          toast.error("Não foi possível carregar os detalhes.");
        }
      } catch (error) {
        toast.dismiss(loadingId);
        console.error("Erro ao carregar detalhes:", error);
        toast.error("Erro ao carregar detalhes.");
      }
    } else {
      setViewRecord(record);
      setOpenView(true);
    }
  };

  // Função para editar notificação - navegar para formulário
  const editarNotificacao = async (notificacao: NotificationRecord) => {
    const modalidade = notificacao.modalidade || getModalidadeFromTipo(notificacao.tipo);
  const dadosEdicao = {
      isEdit: true,
      modalidade,
      notificationId: notificacao.id,
      dadosFormulario: notificacao.dadosFormulario || {},
      dadosPaciente: notificacao.dadosPaciente || {},
      dadosNotificador: notificacao.dadosNotificador || {},
    } as {
      isEdit: boolean;
      modalidade: string;
      notificationId: string | number;
      dadosFormulario: Record<string, unknown>;
      dadosPaciente: NotificationRecord["dadosPaciente"];
      dadosNotificador: NotificationRecord["dadosNotificador"];
      payload?: PayloadNotificacaoLesaoPressao | PayloadNotificacaoFlebite;
    };

    if (modalidade === "lesao-pressao") {
      const incidenteId = Number(notificacao.id);
      if (Number.isNaN(incidenteId) || incidenteId <= 0) {
        toast.error("Não foi possível identificar a notificação para edição.");
        return;
      }

      const loadingId = toast.loading("Carregando dados da lesão...");
      try {
        const detalhes = await getLesaoById(incidenteId);
        toast.dismiss(loadingId);
        if (!detalhes.success || !detalhes.data) {
          toast.error(detalhes.message || "Não foi possível carregar os dados da lesão.");
          return;
        }
        let payload: PayloadNotificacaoLesaoPressao | undefined;
        const dadosResposta = detalhes.data as PayloadNotificacaoLesaoPressao | PayloadNotificacaoLesaoPressao[];
        if (Array.isArray(dadosResposta)) {
          payload = dadosResposta[0];
        } else {
          payload = dadosResposta;
        }

        if (!payload) {
          toast.error("Nenhum dado de lesão encontrado para edição.");
          return;
        }

        dadosEdicao.payload = payload;
      } catch (error) {
        toast.dismiss(loadingId);
        console.error("Erro ao carregar lesão para edição:", error);
        toast.error("Erro inesperado ao carregar dados para edição.");
        return;
      }
    } else if (modalidade === "flebite") {
      const incidenteId = Number(notificacao.id);
      if (Number.isNaN(incidenteId) || incidenteId <= 0) {
        toast.error("Não foi possível identificar a notificação para edição.");
        return;
      }

      const loadingId = toast.loading("Carregando dados da flebite...");
      try {
        const detalhes = await getFlebiteById(incidenteId);
        toast.dismiss(loadingId);
        if (!detalhes.success || !detalhes.data) {
          toast.error(detalhes.message || "Não foi possível carregar os dados da flebite.");
          return;
        }
        let payload: PayloadNotificacaoFlebite | undefined;
        const dadosResposta = detalhes.data as PayloadNotificacaoFlebite | PayloadNotificacaoFlebite[];
        if (Array.isArray(dadosResposta)) {
          payload = dadosResposta[0];
        } else {
          payload = dadosResposta;
        }

        if (!payload) {
          toast.error("Nenhum dado de flebite encontrado para edição.");
          return;
        }

        dadosEdicao.payload = payload;
      } catch (error) {
        toast.dismiss(loadingId);
        console.error("Erro ao carregar flebite para edição:", error);
        toast.error("Erro inesperado ao carregar dados para edição.");
        return;
      }
    }

  localStorage.setItem("editNotificationData", JSON.stringify(dadosEdicao));
    navigate(`/form/${modalidade}`);
  };

  const filtrados = useMemo(() => {
    return rows.filter((d) => {
      const matchTexto = [d.titulo, d.descricao, d.tipo].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchSeveridade = filtroSeveridade === "todas" || d.severidade === filtroSeveridade;
      const matchStatus = filtroStatus === "todos" || d.status === filtroStatus;
      return matchTexto && matchSeveridade && matchStatus;
    });
  }, [rows, query, filtroSeveridade, filtroStatus]);

  const exportarXlsx = () => {
    if (!filtrados.length) {
      toast.info("Nada para exportar no filtro atual.");
      return;
    }

    // Função para formatar dados de formulário específicos por tipo
    const formatarDadosFormulario = (d: NotificationRecord) => {
      const modalidade = d.modalidade || getModalidadeFromTipo(d.tipo);
      const form = d.dadosFormulario || {};

      switch (modalidade) {
        case "queda":
          return {
            "Diagnóstico": form.diagnostico || "",
            "Tipo Queda ID": form.tipoQuedaId || "",
            "Local Queda ID": form.localQuedaId || "",
            "Horário": form.horario || "",
            "Turno": form.turno || "",
            "Desfecho": form.desfecho || "",
            "Avaliação Risco Admissão": form.avaliacaoRiscoAdmissao ? "Sim" : "Não",
            "Registro Orientação Prontuário": form.registroOrientacaoProntuario ? "Sim" : "Não",
            "Risco Identificado Admissão": form.riscoIdentificadoAdmissao ? "Sim" : "Não",
            "Paciente Com Acompanhante": form.pacienteComAcompanhante ? "Sim" : "Não",
            "Qtd Med. Baixo Risco": form.qtdMedBaixoRisco || 0,
            "Qtd Med. Médio Risco": form.qtdMedMedioRisco || 0,
            "Qtd Med. Alto Risco": form.qtdMedAltoRisco || 0,
            "Classificação Incidente": form.classificacaoIncidente || "",
            "Classificação Dano": form.classificacaoDano || "",
          };
        case "lesao-pressao":
          return {
            "Data 1ª Avaliação": form.dataPrimeiraAvaliacao || "",
            "Classificação Braden": form.classificacaoBraden || "",
            "Escore Braden": form.escoreBraden || "",
            "Reavaliação 48h": form.reavaliacao48Horas || "",
            "Mobilidade Prejudicada": form.mobilidadePrejudicada ? "Sim" : "Não",
            "Responsável Avaliação": form.responsavelAvaliacao || "",
            "Registro SAE": form.resgistroSAE || "",
            "Mudança Decúbito": form.mudancaDecubito ? "Sim" : "Não",
            "Intervalo Mudança (h)": form.intervaloMudanca || "",
            "Tempo Internação Lesão": form.tempoInternacaoLesao || "",
            "Local Lesão ID": form.idLocalLesao || "",
            "Estágio Lesão": form.estagioLesao || "",
            "Superfície Dinâmica Apoio": form.superficeDinamicaApoio ? "Sim" : "Não",
            "Avaliação Nutricionista": form.solicitacaoAvaliacaoNutri ? "Sim" : "Não",
            "Registro Avaliação Nutri": form.registroAvaliacaoNutri ? "Sim" : "Não",
            "Registro Avaliação Fisio": form.registroavaliacaoFisio ? "Sim" : "Não",
            "Registro Enfermagem": form.registroEnfermagem ? "Sim" : "Não",
            "Uso Cobertura Adequada": form.usoCoberturaAdequada || "",
            "Classificação Incidente": form.classificacaoIncidente || "",
            "Classificação Dano": form.classificacaoDano || "",
          };
        case "flebite":
          return {
            "Diagnóstico": form.diagnostico || "",
            "Grau Flebite": form.grauFlebite || "",
            "Local Punção": form.localPuncao || "",
            "Qtd Punções até Incidente": form.qtdPuncoesAteIncidente || "",
            "Tipo Cateter": form.tipoCateter || "",
            "Calibre Cateter": form.calibreCateter || "",
            "Nº Cateteres Inseridos": form.numCateteresInseridos || "",
            "Tempo Permanência Acesso (h)": form.tempoPermanenciaAcesso || "",
            "Qtd Med. Vesicante/Irritante": form.qtdMedVesicanteIrritante || "",
            "Classificação Incidente": form.classificacaoIncidente || "",
            "Classificação Dano": form.classificacaoDano || "",
          };
        case "reacao-adversa":
          return {
            "Classificação Incidente": form.classificacaoIncidente || "",
            "Classificação Dano": form.classificacaoDano || "",
            "Data Início": form.dataInicio || "",
            "Data Fim": form.dataFim || "",
          };
        case "erro-medicacao":
          return {
            "Classificação Incidente": form.classificacaoIncidente || "",
            "Classificação Dano": form.classificacaoDano || "",
            "Data Início": form.dataInicio || "",
            "Data Fim": form.dataFim || "",
          };
        default:
          return {};
      }
    };

    const plain = filtrados.map((d) => ({
      // Dados básicos
      ID: d.id,
      Tipo: d.tipo,
      Título: d.titulo,
      Descrição: d.descricao,
      "Descrição Adicional": d.descricaoAdicional || "",
      Severidade: d.severidade,
      Status: d.status,
      Data: d.data,
      // Dados do paciente
      "Paciente - Nome": d.dadosPaciente?.nome || "",
      "Paciente - Prontuário": d.dadosPaciente?.prontuario || "",
      "Paciente - Setor": d.dadosPaciente?.setor || "",
      "Paciente - Leito": d.dadosPaciente?.leito || "",
      "Paciente - Sexo": d.dadosPaciente?.sexo || "",
      "Paciente - Peso": d.dadosPaciente?.peso || "",
      "Paciente - Data Nascimento": d.dadosPaciente?.dataNascimento || "",
      // Dados do notificador
      "Notificador - Nome": d.dadosNotificador?.nome || "",
      "Notificador - Email": d.dadosNotificador?.email || "",
      "Notificador - Telefone": d.dadosNotificador?.telefone || "",
      "Notificador - Tipo": d.dadosNotificador?.tipo || "",
      "Notificador - Setor": d.dadosNotificador?.setor || "",
      "Notificador - Categoria": d.dadosNotificador?.categoria || "",
      // Dados específicos do formulário
      ...formatarDadosFormulario(d),
    }));

    const ws = XLSX.utils.json_to_sheet(plain);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tipoModulo.substring(0, 31)); // Excel limita nome da aba a 31 caracteres
    XLSX.writeFile(wb, `${tipoModulo}-notificacoes.xlsx`);
    toast.success("Exportação concluída");
  };

  const getSavedNotifier = (): Notifier | null => {
    try {
      const raw = localStorage.getItem("notifier");
      return raw ? (JSON.parse(raw) as Notifier) : null;
    } catch {
      return null;
    }
  };

  const novoRegistro = () => {
    // Limpar dados de edição antes de navegar para novo formulário
    localStorage.removeItem("editNotificationData");
    const modalidade = getModalidadeFromTipo(tipoModulo);
    navigate(`/form/${modalidade}`);
  };

  const handleCreateSubmit = (record: NotificationRecord) => {
    setRows((prev) => [record, ...prev]);
    onAdicionar?.();
    toast.success(`Notificação criada em ${record.tipo}`);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRecord) return;
    const formData = new FormData(e.currentTarget);
    const updated: NotificationRecord = {
      ...editRecord,
      titulo: String(formData.get("titulo") || editRecord.titulo),
      descricao: String(formData.get("descricao") || editRecord.descricao),
  descricaoAdicional: String(formData.get("descricaoAdicional") || editRecord.descricaoAdicional || ""),
      severidade: editSeveridade || editRecord.severidade,
      status: editStatus || editRecord.status,
      data: String(formData.get("data") || editRecord.data),
    };
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    toast.success(`Notificação #${updated.id} atualizada`);
    setOpenEdit(false);
  };

  React.useEffect(() => {
    if (openEdit && editRecord) {
      setEditSeveridade(editRecord.severidade);
      setEditStatus(editRecord.status);
    }
  }, [openEdit, editRecord]);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{titulo}</h2>
        {subtitulo && <p className="text-muted-foreground">{subtitulo}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro</CardTitle>
          <CardDescription>Refine as notificações exibidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={filtroSeveridade} onValueChange={setFiltroSeveridade}>
              <SelectTrigger>
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas severidades</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="investigacao">Em investigação</SelectItem>
                <SelectItem value="resolvida">Resolvida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={novoRegistro} className="gap-2">
              <Plus className="h-4 w-4" /> Nova notificação
            </Button>
            <Button variant="secondary" onClick={exportarXlsx} className="gap-2">
              <FileDown className="h-4 w-4" /> Exportar .xlsx
            </Button>
          </div>
        </CardContent>
      </Card>
      <CreateNotificationDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSubmit={handleCreateSubmit}
        defaultTipo={tipoModulo}
        allowChooseTipo={false}
      />
      <NotifierDialog
        open={openNotifier}
        onOpenChange={(v) => {
          setOpenNotifier(v);
          if (!v && pendingCreate) {
            // Se acabou de fechar após salvar, navega para o formulário
            const hasNotifier = !!getSavedNotifier();
            if (hasNotifier) {
              // Limpar dados de edição antes de navegar para novo formulário
              localStorage.removeItem("editNotificationData");
              const modalidade = getModalidadeFromTipo(tipoModulo);
              navigate(`/form/${modalidade}`);
            }
            setPendingCreate(false);
          }
        }}
        onSaved={() => {
          if (pendingCreate) {
            setOpenNotifier(false);
            // Limpar dados de edição antes de navegar para novo formulário
            localStorage.removeItem("editNotificationData");
            const modalidade = getModalidadeFromTipo(tipoModulo);
            navigate(`/form/${modalidade}`);
            setPendingCreate(false);
          }
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Lista de registros de {tipoModulo}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={d.titulo}>
                    {d.titulo}
                  </TableCell>
                  <TableCell className={
                    d.severidade === "alta" ? "text-destructive" : d.severidade === "media" ? "text-warning" : "text-muted-foreground"
                  }>
                    {d.severidade}
                  </TableCell>
                  <TableCell>{d.status}</TableCell>
                  <TableCell>{d.data}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleView(d)}>
                      <Eye className="h-4 w-4" /> Ver
                    </Button>
                    <Button size="sm" variant="ghost" className="ml-2 gap-1" onClick={() => editarNotificacao(d)}>
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum registro encontrado para o filtro.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableCaption>{filtrados.length} registro(s) encontrado(s)</TableCaption>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Editar Notificação #{editRecord?.id}</DialogTitle>
          </DialogHeader>
          {editRecord && (
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Input value={editRecord.tipo} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID</label>
                  <Input value={String(editRecord.id)} disabled />
                </div>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input name="titulo" defaultValue={editRecord.titulo} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <Input name="data" type="datetime-local" defaultValue={editRecord.data} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input name="descricao" defaultValue={editRecord.descricao} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição adicional (opcional)</label>
                <Input name="descricaoAdicional" defaultValue={editRecord.descricaoAdicional || ""} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severidade</label>
          <Select value={editSeveridade} onValueChange={(v: NotificationRecord["severidade"]) => setEditSeveridade(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
          <Select value={editStatus} onValueChange={(v: NotificationRecord["status"]) => setEditStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="investigacao">Em investigação</SelectItem>
                      <SelectItem value="resolvida">Resolvida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Notificação #{viewRecord?.id}</DialogTitle>
          </DialogHeader>
          {viewRecord && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <span className="text-muted-foreground block mb-1">Tipo</span>
                  <div className="font-medium">{viewRecord.tipo}</div>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Severidade</span>
                  <div className={`font-medium inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                    viewRecord.severidade === "alta" ? "bg-red-100 text-red-800" : 
                    viewRecord.severidade === "media" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-green-100 text-green-800"
                  }`}>
                    {viewRecord.severidade.toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Status</span>
                  <div className="font-medium">{viewRecord.status}</div>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Data</span>
                  <div className="font-medium">{viewRecord.data}</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground font-medium">Título</span>
                <div className="font-semibold text-lg">{viewRecord.titulo}</div>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground font-medium">Descrição</span>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-foreground whitespace-pre-wrap">{viewRecord.descricao}</p>
                </div>
              </div>

              {viewRecord.descricaoAdicional && (
                <div className="space-y-2">
                  <span className="text-muted-foreground font-medium">Descrição adicional</span>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-foreground whitespace-pre-wrap">{viewRecord.descricaoAdicional}</p>
                  </div>
                </div>
              )}

              {/* Exibir dados do paciente se disponíveis */}
              {viewRecord.dadosPaciente && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    Dados do Paciente
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(viewRecord.dadosPaciente).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <div className="font-medium">{String(value)}</div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Exibir dados do notificador se disponíveis */}
              {viewRecord.dadosNotificador && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    Dados do Notificador
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(viewRecord.dadosNotificador).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <div className="font-medium">{String(value)}</div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NotificationModule;
