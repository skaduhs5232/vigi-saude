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
};

export function NotificationModule({ titulo, subtitulo, tipoModulo, dados, onAdicionar }: NotificationModuleProps) {
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

  // Função para editar notificação - navegar para formulário
  const editarNotificacao = (notificacao: NotificationRecord) => {
    const modalidade = notificacao.modalidade || getModalidadeFromTipo(notificacao.tipo);
    
    // Salvar dados da notificação no localStorage para carregar no formulário
    const dadosEdicao = {
      isEdit: true,
      notificationId: notificacao.id,
      dadosFormulario: notificacao.dadosFormulario || {},
      dadosPaciente: notificacao.dadosPaciente || {},
      dadosNotificador: notificacao.dadosNotificador || {},
    };
    
    localStorage.setItem("editNotificationData", JSON.stringify(dadosEdicao));
    
    // Navegar para o formulário
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
    const plain = filtrados.map((d) => ({
      ID: d.id,
      Tipo: d.tipo,
      Título: d.titulo,
      Descrição: d.descricao,
  "Descrição adicional": d.descricaoAdicional || "",
      Severidade: d.severidade,
      Status: d.status,
      Data: d.data,
    }));
    const ws = XLSX.utils.json_to_sheet(plain);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tipoModulo);
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
    const hasNotifier = !!getSavedNotifier();
    if (!hasNotifier) {
      setPendingCreate(true);
      setOpenNotifier(true);
      return;
    }
    setOpenCreate(true);
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
            // Se acabou de fechar após salvar, abre criação
            const hasNotifier = !!getSavedNotifier();
            if (hasNotifier) {
              setOpenCreate(true);
            }
            setPendingCreate(false);
          }
        }}
        onSaved={() => {
          if (pendingCreate) {
            setOpenNotifier(false);
            setOpenCreate(true);
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="h-4 w-4" /> Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>
                            Detalhes da Notificação #{d.id}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Tipo</span>
                              <div className="font-medium">{d.tipo}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Severidade</span>
                              <div className="font-medium">{d.severidade}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status</span>
                              <div className="font-medium">{d.status}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Data</span>
                              <div className="font-medium">{d.data}</div>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Título</span>
                            <div className="font-semibold">{d.titulo}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Descrição</span>
                            <p className="text-foreground whitespace-pre-wrap">{d.descricao}</p>
                          </div>
                          {d.descricaoAdicional && (
                            <div>
                              <span className="text-muted-foreground">Descrição adicional</span>
                              <p className="text-foreground whitespace-pre-wrap">{d.descricaoAdicional}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
    </div>
  );
}

export default NotificationModule;
