import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationRecord } from "./NotificationModule";

export type CreateNotificationDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (record: NotificationRecord) => void;
  defaultTipo?: string;
  allowChooseTipo?: boolean;
  tiposDisponiveis?: string[];
};

const defaultTipos = [
  "Farmacovigilância",
  "Tecnovigilância",
  "Hemovigilância",
  "Erros de Medicação",
  "Flebite",
  "Lesão por Pressão",
  "Úlcera de Córnea",
  "Queda",
  "Broncoaspiração",
  "Biovigilância",
  "Cosmetovigilância",
  "Vigilância de Saneantes",
];

export function CreateNotificationDialog({ open, onOpenChange, onSubmit, defaultTipo, allowChooseTipo, tiposDisponiveis }: CreateNotificationDialogProps) {
  const [tipo, setTipo] = useState<string>(defaultTipo || "");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [severidade, setSeveridade] = useState<"baixa" | "media" | "alta">("baixa");
  const [status, setStatus] = useState<"pendente" | "investigacao" | "resolvida">("pendente");
  const [data, setData] = useState<string>("");

  const tipos = useMemo(() => tiposDisponiveis && tiposDisponiveis.length ? tiposDisponiveis : defaultTipos, [tiposDisponiveis]);

  useEffect(() => {
    if (open) {
      setTipo(defaultTipo || tipos[0] || "");
      setTitulo("");
      setDescricao("");
      setSeveridade("baixa");
      setStatus("pendente");
      const now = new Date();
      const isoLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setData(isoLocal);
    }
  }, [open, defaultTipo, tipos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: NotificationRecord = {
      id: Date.now(),
      tipo: tipo || defaultTipo || "",
      titulo,
      descricao,
      severidade,
      status,
      data,
    };
    onSubmit(record);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Criar nova notificação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {allowChooseTipo ? (
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipos.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Input value={defaultTipo || tipo} disabled />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Severidade</Label>
              <Select value={severidade} onValueChange={(v: string) => setSeveridade(v as NotificationRecord["severidade"])}>
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
              <Label>Status</Label>
              <Select value={status} onValueChange={(v: string) => setStatus(v as NotificationRecord["status"])}>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNotificationDialog;
