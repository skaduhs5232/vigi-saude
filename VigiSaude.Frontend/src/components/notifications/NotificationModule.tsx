import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileDown, Plus, Search, Eye } from "lucide-react";
import * as XLSX from "xlsx";
import { CreateNotificationDialog } from "./CreateNotificationDialog";
import { Notifier } from "@/components/notifier/NotifierForm";
import { NotifierDialog } from "@/components/notifier/NotifierDialog";

export type NotificationRecord = {
  id: string | number;
  tipo: string; // tipo/módulo (ex: Farmacovigilância)
  titulo: string;
  descricao: string;
  severidade: "baixa" | "media" | "alta";
  status: "pendente" | "investigacao" | "resolvida";
  data: string; // ISO string ou data legível
};

export type NotificationModuleProps = {
  titulo: string;
  subtitulo?: string;
  tipoModulo: string; // ex: "Farmacovigilância"
  dados: NotificationRecord[];
  onAdicionar?: () => void; // ação adicional ao criar novo
};

export function NotificationModule({ titulo, subtitulo, tipoModulo, dados, onAdicionar }: NotificationModuleProps) {
  const [query, setQuery] = useState("");
  const [filtroSeveridade, setFiltroSeveridade] = useState<string>("todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [selected, setSelected] = useState<NotificationRecord | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [rows, setRows] = useState<NotificationRecord[]>(dados);
  const [openNotifier, setOpenNotifier] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);

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
                        </div>
                      </DialogContent>
                    </Dialog>
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
    </div>
  );
}

export default NotificationModule;
