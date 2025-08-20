import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Notifier = {
  nome: string;
  cpf?: string;
  conselho?: string;
  registro?: string;
  contato?: string;
  unidade?: string;
};

export function NotifierForm({ onSaved }: { onSaved?: (n: Notifier) => void }) {
  const [form, setForm] = useState<Notifier>({ nome: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("notifier");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const onChange = (k: keyof Notifier) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("notifier", JSON.stringify(form));
      toast.success("Identificador salvo");
      setLoading(false);
      onSaved?.(form);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação do Notificador</CardTitle>
        <CardDescription>Cadastre seus dados para agilizar notificações</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
          <div className="space-y-2 md:col-span-2">
            <Label>Nome completo</Label>
            <Input value={form.nome} onChange={onChange("nome")} required />
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input value={form.cpf || ""} onChange={onChange("cpf")} />
          </div>
          <div className="space-y-2">
            <Label>Conselho Profissional</Label>
            <Input value={form.conselho || ""} onChange={onChange("conselho")} placeholder="COREN, CRM, CRF..." />
          </div>
          <div className="space-y-2">
            <Label>Registro</Label>
            <Input value={form.registro || ""} onChange={onChange("registro")} />
          </div>
          <div className="space-y-2">
            <Label>Contato (e-mail/telefone)</Label>
            <Input value={form.contato || ""} onChange={onChange("contato")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Unidade/Setor</Label>
            <Input value={form.unidade || ""} onChange={onChange("unidade")} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default NotifierForm;
