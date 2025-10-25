import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type PacienteValues = {
  nome: string;
  prontuario: string;
  setor: string;
  leito: string;
  sexo: string;
  peso: string;
  dataNascimento: string;
};

export type NotificadorValues = {
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  setor: string;
  categoria: string;
};

export type SetorOption = { idSetor: number; descricaoSetor: string };

type DadosPacienteSectionProps = {
  values: PacienteValues;
  onChange: (field: keyof PacienteValues, value: string) => void;
  errors: Record<string, string>;
  setores: SetorOption[];
  setoresCarregando: boolean;
  sexoOptions: string[];
};

export function DadosPacienteSection({ values, onChange, errors, setores, setoresCarregando, sexoOptions }: DadosPacienteSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2 pt-5">
        <h3 className="text-lg font-semibold">Dados do paciente</h3>
        <p className="text-sm text-muted-foreground">Informações cadastrais do paciente</p>
      </div>
      <div className="space-y-2">
        <Label>
          Nome <span className="text-destructive">*</span>
        </Label>
        <Input value={values.nome} onChange={(e) => onChange("nome", e.target.value)} />
        {errors.pacienteNome && <p className="text-xs text-destructive">{errors.pacienteNome}</p>}
      </div>
      <div className="space-y-2">
        <Label>
          Prontuário <span className="text-destructive">*</span>
        </Label>
        <Input value={values.prontuario} onChange={(e) => onChange("prontuario", e.target.value)} />
        {errors.pacienteProntuario && <p className="text-xs text-destructive">{errors.pacienteProntuario}</p>}
      </div>
      <div className="space-y-2">
        <Label>
          Setor <span className="text-destructive">*</span>
        </Label>
        <Select
          value={values.setor}
          onValueChange={(value) => onChange("setor", value)}
          disabled={setoresCarregando || setores.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={setoresCarregando ? "Carregando setores..." : "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            {setores.map((setor) => (
              <SelectItem key={setor.idSetor} value={String(setor.idSetor)}>
                {setor.descricaoSetor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.pacienteSetor && <p className="text-xs text-destructive">{errors.pacienteSetor}</p>}
      </div>
      <div className="space-y-2">
        <Label>Leito</Label>
        <Input value={values.leito} onChange={(e) => onChange("leito", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>
          Sexo <span className="text-destructive">*</span>
        </Label>
        <Select value={values.sexo} onValueChange={(value) => onChange("sexo", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {sexoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.pacienteSexo && <p className="text-xs text-destructive">{errors.pacienteSexo}</p>}
      </div>
      <div className="space-y-2">
        <Label>Peso (kg)</Label>
        <Input type="number" value={values.peso} onChange={(e) => onChange("peso", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>
          Data de nascimento <span className="text-destructive">*</span>
        </Label>
        <Input type="date" value={values.dataNascimento} onChange={(e) => onChange("dataNascimento", e.target.value)} />
        {errors.pacienteDataNascimento && <p className="text-xs text-destructive">{errors.pacienteDataNascimento}</p>}
      </div>
    </div>
  );
}

type DadosNotificadorSectionProps = {
  values: NotificadorValues;
  onChange: (field: keyof NotificadorValues, value: string) => void;
  errors: Record<string, string>;
  setores: SetorOption[];
  setoresCarregando: boolean;
  categoriaProfOptions: string[];
  onCarregarUltimosDados: () => void;
};

export function DadosNotificadorSection({
  values,
  onChange,
  errors,
  setores,
  setoresCarregando,
  categoriaProfOptions,
  onCarregarUltimosDados,
}: DadosNotificadorSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Dados do notificador</h3>
          <p className="text-sm text-muted-foreground">
            Informe seus dados (todos opcionais, exceto o vínculo com a gerência de risco)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onCarregarUltimosDados} className="shrink-0">
          Últimos dados
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notificadorNome">Nome</Label>
        <Input
          id="notificadorNome"
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
          placeholder="Ex.: Maria Silva"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notificadorEmail">E-mail</Label>
        <Input
          id="notificadorEmail"
          type="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="exemplo@dominio.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notificadorTelefone">Telefone</Label>
        <Input
          id="notificadorTelefone"
          type="tel"
          value={values.telefone}
          onChange={(e) => onChange("telefone", e.target.value)}
          placeholder="(00) 00000-0000"
        />
      </div>
      <div className="space-y-2">
        <Label>
          Tipo de notificador <span className="text-destructive">*</span>
        </Label>
        <Select value={values.tipo} onValueChange={(value) => onChange("tipo", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Funcionário da gerência de risco">Funcionário da gerência de risco</SelectItem>
            <SelectItem value="Não">Não</SelectItem>
          </SelectContent>
        </Select>
        {errors.notificadorTipo && <p className="text-xs text-destructive">{errors.notificadorTipo}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="notificadorSetor">
          Setor <span className="text-destructive">*</span>
        </Label>
        <Select
          value={values.setor}
          onValueChange={(value) => onChange("setor", value)}
          disabled={setoresCarregando || setores.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={setoresCarregando ? "Carregando setores..." : "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            {setores.map((setor) => (
              <SelectItem key={setor.idSetor} value={String(setor.idSetor)}>
                {setor.descricaoSetor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.notificadorSetor && <p className="text-xs text-destructive">{errors.notificadorSetor}</p>}
      </div>
      <div className="space-y-2">
        <Label>
          Categoria profissional <span className="text-destructive">*</span>
        </Label>
        <Select value={values.categoria} onValueChange={(value) => onChange("categoria", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {categoriaProfOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.notificadorCategoria && <p className="text-xs text-destructive">{errors.notificadorCategoria}</p>}
      </div>
    </div>
  );
}
