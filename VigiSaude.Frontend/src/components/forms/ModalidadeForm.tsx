import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

type FieldBase = { id: string; label: string; required?: boolean };
type TextField = FieldBase & { type: "text" };
type NumberField = FieldBase & { type: "number"; min?: number; max?: number };
type DateField = FieldBase & { type: "date" };
type TimeField = FieldBase & { type: "time" };
type TextareaField = FieldBase & { type: "textarea" };
type RadioField = FieldBase & { type: "radio"; options: string[] };
type SelectField = FieldBase & { type: "select"; options: string[] };
type MultiselectChild = { whenIncludes: string; fields: Field[] };
type MultiselectField = FieldBase & { type: "multiselect"; options: string[]; children?: MultiselectChild[] };
type Field = TextField | NumberField | DateField | TimeField | TextareaField | RadioField | SelectField | MultiselectField;

export type ModalidadeSchema = { title: string; fields: Field[] };

// Opções compartilhadas do JSON de referência
const setoresOptions = ["Emergência Unidade 24h", "Emergência unidade de retaguarda", "Emergência obstétrica", "UTI", "Clínica cirúrgica", "Clínica médica", "Clínica pediátrica", "Clínica gineco-obstetrica", "CPN", "Centro cirúrgico", "Neonatologia", "Canguru", "Centro de imagem", "Laboratório", "Farmácia", "Transporte"];
const categoriaProfOptions = ["Médico", "Enfermeiro", "Farmacêutico", "Dentista", "Outros"];
const sexoOptions = ["M", "F", "Desconhecido"];
const desfechoOpcoes = ["Recuperado/resolvido", "Em recuperação", "Não recuperado", "Não resolvido", "Recuperado com sequelas", "Morte", "Desconhecido"];
const viaAdministracaoOpcoes = ["Oral", "Intramuscular", "Endovenosa", "Dérmica", "Inalatória", "Subcutânea", "Nasal", "Ocular", "Retal", "Vaginal", "Outra", "Desconhecida"];

const schemas: Record<string, ModalidadeSchema> = {
  queda: {
    title: "Queda",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      { id: "idadeMomentoUnidade", type: "select", label: "Idade no momento (unidade)", required: true, options: ["hora", "dia", "semana", "mês", "ano"] },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "diagnostico", type: "textarea", label: "Diagnóstico", required: true },
      { id: "avaliacaoRiscoAdmissao", type: "radio", label: "Avaliação de risco na admissão", required: true, options: ["Sim", "Não"] },
      { id: "registroOrientacao", type: "radio", label: "Registro de orientação", required: true, options: ["Sim", "Não"] },
      { id: "riscoQuedaIdentificado", type: "radio", label: "Risco de queda identificado", required: true, options: ["Sim", "Não"] },
      { id: "fatoresPredisponentes", type: "multiselect", label: "Fatores predisponentes", required: true, options: ["Alteração do estado mental confuso", "Distúrbio neurológico", "Prejuízo do equilíbrio da marcha", "Déficit sensitivo", "Queda anterior", "Idade > 60 anos ou criança", "Urgência urinária/intestinal", "Medicamentos que alteram SNC"] },
      { id: "usoMedicamentosSNC", type: "radio", label: "Uso de medicamentos SNC", required: true, options: ["Sim", "Não"] },
      { id: "medicamentosSNC", type: "multiselect", label: "Medicamentos SNC", options: ["Antiarritmicos", "Antipsicóticos", "Antidepressivos", "Anticonvulsivantes", "Anti-hipertensivos", "Anestésico geral", "Antidiabéticos", "Benzodiazepínicos", "Diuréticos", "Opioides", "Relaxantes musculares", "Tricíclicos", "Polifarmácia"] },
      { id: "quantidadeMedicamentosBaixoRisco", type: "number", label: "Qtd. med. baixo risco", required: true, min: 0 },
      { id: "quantidadeMedicamentosMedioRisco", type: "number", label: "Qtd. med. médio risco", required: true, min: 0 },
      { id: "quantidadeMedicamentosAltoRisco", type: "number", label: "Qtd. med. alto risco", required: true, min: 0 },
      { id: "acompanhante", type: "radio", label: "Acompanhante", required: true, options: ["Sim", "Não"] },
      { id: "tipoQueda", type: "select", label: "Tipo de queda", required: true, options: ["Tropeçar", "Perda de equilíbrio", "Escorregar", "Da própria altura", "Desmaio"] },
      { id: "localQueda", type: "select", label: "Local da queda", required: true, options: ["Berço", "Maca", "Escadas", "Cama", "Banheiro", "Equipamento diagnóstico/terapêutico", "Cadeira", "Quarto", "Transporte"] },
      { id: "horarioQueda", type: "time", label: "Horário da queda", required: true },
      { id: "turno", type: "select", label: "Turno", required: true, options: ["Manhã", "Tarde", "Noite"] },
      { id: "consequencias", type: "textarea", label: "Consequências", required: true },
    ],
  },
  "lesao-pressao": {
    title: "Lesão por pressão",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      { id: "idadeMomentoUnidade", type: "select", label: "Idade no momento (unidade)", required: true, options: ["hora", "dia", "semana", "mês", "ano"] },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "dataPrimeiraAvaliacao", type: "date", label: "Data 1ª avaliação", required: true },
      { id: "classificacaoRiscoBraden", type: "select", label: "Classificação risco (Braden)", required: true, options: ["Sem risco", "Leve", "Moderado", "Elevado", "Muito elevado", "Sem registro"] },
      { id: "totalEscores", type: "number", label: "Total escores", required: true, min: 0 },
      { id: "reavaliacao48h", type: "radio", label: "Reavaliação 48h", required: true, options: ["Sim", "Não", "Sem registro"] },
      { id: "mobilidadePrejudicada", type: "radio", label: "Mobilidade prejudicada", required: true, options: ["Sim", "Não", "Sem registro"] },
      { id: "avaliacaoPor", type: "select", label: "Avaliação por", required: true, options: ["Enfermeiro", "Estomoterapia", "Sem registro"] },
      { id: "registroBradenSAE", type: "radio", label: "Registro Braden SAE", required: true, options: ["Sim", "Não"] },
      { id: "registroMobilidadeSAE", type: "radio", label: "Registro mobilidade SAE", required: true, options: ["Sim", "Não", "Sem registro"] },
      { id: "mudancaDecubito", type: "radio", label: "Mudança de decúbito", required: true, options: ["Sim", "Não"] },
      { id: "intervaloMudanca", type: "select", label: "Intervalo mudança", required: true, options: ["2h", "3h", "Outro"] },
      { id: "tempoInternacaoLesao", type: "select", label: "Tempo internação até lesão", required: true, options: ["0-14 dias", "15-30 dias", "31-45 dias", "Acima de 45 dias"] },
      { id: "localLesao", type: "multiselect", label: "Local da lesão", required: true, options: ["Sacral", "Calcâneo", "Trocânter", "Coluna vertebral", "Occipital", "Panturrilha", "Joelho", "Pavilhão auricular", "Outro"] },
      { id: "estagioLesao", type: "select", label: "Estágio", required: true, options: ["I", "II", "III", "IV", "Indeterminado"] },
      { id: "usoColchaoDinamico", type: "radio", label: "Uso colchão dinâmico", required: true, options: ["Sim", "Não"] },
      { id: "avaliacaoNutricionista", type: "radio", label: "Avaliação nutricionista", required: true, options: ["Sim", "Não"] },
      { id: "registroAvaliacaoNutricional", type: "radio", label: "Registro avaliação nutricional", required: true, options: ["Sim", "Não"] },
      { id: "registroAvaliacaoFisioterapia", type: "radio", label: "Registro avaliação fisioterapia", required: true, options: ["Sim", "Não"] },
      { id: "registroIncidenteEnfermagem", type: "radio", label: "Registro incidente enfermagem", required: true, options: ["Sim", "Não"] },
      { id: "usoCoberturaAdequada", type: "radio", label: "Uso cobertura adequada", required: true, options: ["Sim", "Não", "Sem registro"] },
    ],
  },
  flebite: {
    title: "Flebite",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      { id: "idadeMomentoUnidade", type: "select", label: "Idade no momento (unidade)", required: true, options: ["hora", "dia", "semana", "mês", "ano"] },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "diagnostico", type: "textarea", label: "Diagnóstico", required: true },
      { id: "grauFlebite", type: "select", label: "Grau flebite", required: true, options: ["I (dor + eritema/edema sem endurecimento)", "II (dor + eritema/edema com endurecimento)", "III (dor + eritema/edema com endurecimento + cordão fibroso palpável)"] },
      { id: "localPuncao", type: "text", label: "Local punção", required: true },
      { id: "numeroPuncoes", type: "number", label: "Número punções", required: true, min: 0 },
      { id: "tipoCateter", type: "text", label: "Tipo cateter", required: true },
      { id: "calibreCateter", type: "text", label: "Calibre cateter", required: true },
      { id: "materialCateter", type: "text", label: "Material cateter", required: true },
      { id: "numeroCateteresLumen", type: "number", label: "Nº lúmens", required: true, min: 0 },
      { id: "tempoPermanencia", type: "text", label: "Tempo permanência", required: true },
      { id: "dataRetirada", type: "date", label: "Data retirada", required: true },
      { id: "usoMedicamentosVesicantes", type: "radio", label: "Uso medicamentos vesicantes", required: true, options: ["Sim", "Não"] },
      { id: "medicamentosAdministrados_medicamento", type: "text", label: "Medicamento administrado", required: true },
      { id: "medicamentosAdministrados_diluente", type: "text", label: "Diluente", required: true },
      { id: "medicamentosAdministrados_modoInfusao", type: "text", label: "Modo infusão", required: true },
      { id: "monitoramentoCateter_data", type: "date", label: "Data monitoramento", required: true },
      { id: "monitoramentoCateter_registroAcesso", type: "text", label: "Registro acesso", required: true },
    ],
  },
  "reacao-adversa": {
    title: "Reação adversa a medicamento",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      { id: "idadeMomentoUnidade", type: "select", label: "Idade no momento (unidade)", required: true, options: ["hora", "dia", "semana", "mês", "ano"] },
      { id: "descricaoIncidente", type: "textarea", label: "Descrição do incidente", required: true },
      { id: "descricaoReacao", type: "textarea", label: "Descrição da reação", required: true },
      { id: "reacao_dataInicio", type: "date", label: "Início reação", required: true },
      { id: "reacao_dataFim", type: "date", label: "Fim reação", required: true },
      { id: "reacao_duracao", type: "text", label: "Duração reação", required: true },
      { id: "reacao_desfecho", type: "select", label: "Desfecho", required: true, options: desfechoOpcoes },
      { id: "med_nomeGenerico", type: "text", label: "Medicamento (genérico)", required: true },
      { id: "med_provavelCausador", type: "radio", label: "Provável causador", required: true, options: ["Sim", "Não"] },
      { id: "med_fabricante", type: "text", label: "Fabricante" },
      { id: "med_lote", type: "text", label: "Lote" },
      { id: "med_posologia", type: "text", label: "Posologia" },
      { id: "med_viaAdministracao", type: "select", label: "Via administração", required: true, options: viaAdministracaoOpcoes },
      { id: "med_dataInicio", type: "date", label: "Início uso" },
      { id: "med_dataFim", type: "date", label: "Fim uso" },
      { id: "med_duracao", type: "text", label: "Duração uso" },
      { id: "med_indicacao", type: "text", label: "Indicação" },
      { id: "med_acaoAdotada", type: "select", label: "Ação adotada", required: true, options: ["Parou", "Dose reduzida", "Dose aumentada", "Dose inalterada", "Desconhecido", "Não aplicável"] },
    ],
  },
  "erro-medicacao": {
    title: "Erro de medicação",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      { id: "idadeMomentoUnidade", type: "select", label: "Idade no momento (unidade)", required: true, options: ["hora", "dia", "semana", "mês", "ano"] },
      { id: "descricaoIncidente", type: "textarea", label: "Descrição do incidente", required: true },
      { id: "erro_dataInicio", type: "date", label: "Início", required: true },
      { id: "erro_dataFim", type: "date", label: "Fim", required: true },
      { id: "ocorrencia", type: "select", label: "Ocorrência", required: true, options: ["Erro de prescrição", "Erro de aprazamento", "Erro de solicitação", "Erro de dispensação", "Erro de administração", "Outro"] },
      { id: "descricaoErro", type: "textarea", label: "Descrição do erro", required: true },
      { id: "efeitoNocivo", type: "select", label: "Efeito nocivo", required: true, options: ["Sim", "Não", "Desconhecido"] },
      { id: "descricaoEfeitos", type: "textarea", label: "Descrição dos efeitos" },
      { id: "desfecho", type: "select", label: "Desfecho", required: true, options: desfechoOpcoes },
      { id: "causasErro", type: "multiselect", label: "Causas do erro", required: true, options: ["Abreviação", "Nomes similares", "Distração", "Cálculo/preparação", "Rotina de administração", "Prescrição", "Equipamentos", "Outro"] },
      { id: "localErro", type: "select", label: "Local do erro", required: true, options: setoresOptions },
      { id: "med_nomeGenerico", type: "text", label: "Medicamento (genérico)", required: true },
      { id: "med_posologia", type: "text", label: "Posologia", required: true },
      { id: "med_viaAdministracao", type: "select", label: "Via administração", required: true, options: viaAdministracaoOpcoes },
      { id: "med_dataInicio", type: "date", label: "Início uso" },
      { id: "med_dataFim", type: "date", label: "Fim uso" },
      { id: "med_indicacao", type: "text", label: "Indicação" },
      { id: "med_lote", type: "text", label: "Lote" },
      { id: "med_validade", type: "date", label: "Validade" },
    ],
  },
  padrao: { title: "Formulário padrão", fields: [] },
};

export type ModalidadeFormProps = {
  modalidade: string;
};

export function ModalidadeForm({ modalidade }: ModalidadeFormProps) {
  const navigate = useNavigate();
  const schema = useMemo<ModalidadeSchema>(() => {
    if (schemas[modalidade]) return schemas[modalidade];
    return schemas.padrao;
  }, [modalidade]);

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notificadorNome, setNotificadorNome] = useState<string>("");
  const [notificadorEmail, setNotificadorEmail] = useState<string>("");
  const [notificadorTelefone, setNotificadorTelefone] = useState<string>("");
  const [notificadorTipo, setNotificadorTipo] = useState<string>("");
  const [notificadorSetor, setNotificadorSetor] = useState<string>("");
  const [notificadorCategoria, setNotificadorCategoria] = useState<string>("");
  // Paciente
  const [pacienteNome, setPacienteNome] = useState("");
  const [pacienteProntuario, setPacienteProntuario] = useState("");
  const [pacienteSetor, setPacienteSetor] = useState("");
  const [pacienteLeito, setPacienteLeito] = useState("");
  const [pacienteSexo, setPacienteSexo] = useState("");
  const [pacientePeso, setPacientePeso] = useState("");
  const [pacienteDataNascimento, setPacienteDataNascimento] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("notifier");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.nome) setNotificadorNome(parsed.nome as string);
      }
    } catch {
      // ignore
    }
  }, []);

  const set = (id: string, value: unknown) => setForm((p) => ({ ...p, [id]: value }));
  const valAsStr = (id: string): string => {
    const v = form[id];
    return v === undefined || v === null ? "" : String(v);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of schema.fields) {
      // pular campos condicionais invisíveis
      if (!showField(f)) continue;
      if (f.required) {
        const v = form[f.id];
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
          e[f.id] = "Campo obrigatório";
        }
      }
      if (f.type === "number") {
        const v = form[f.id];
        if (v !== undefined && v !== null && v !== "") {
          const n = Number(v);
          if (Number.isNaN(n)) e[f.id] = "Número inválido";
          if ((f as NumberField).min !== undefined && n < (f as NumberField).min!) e[f.id] = `Mínimo ${(f as NumberField).min}`;
          if ((f as NumberField).max !== undefined && n > (f as NumberField).max!) e[f.id] = `Máximo ${(f as NumberField).max}`;
        }
      }
    }
    // Validações do Notificador
    if (!notificadorNome) e["notificadorNome"] = "Campo obrigatório";
    if (!notificadorSetor) e["notificadorSetor"] = "Campo obrigatório";
    if (!notificadorCategoria) e["notificadorCategoria"] = "Campo obrigatório";
    if (!notificadorTipo) e["notificadorTipo"] = "Campo obrigatório";
    // Paciente
    if (!pacienteNome) e["pacienteNome"] = "Campo obrigatório";
    if (!pacienteProntuario) e["pacienteProntuario"] = "Campo obrigatório";
    if (!pacienteSetor) e["pacienteSetor"] = "Campo obrigatório";
    if (!pacienteSexo) e["pacienteSexo"] = "Campo obrigatório";
    if (!pacienteDataNascimento) e["pacienteDataNascimento"] = "Campo obrigatório";
    // Condicional: descricaoEfeitos obrigatória se efeitoNocivo = 'Sim'
    if (form["efeitoNocivo"] === "Sim") {
      const v = form["descricaoEfeitos"];
      if (!v) e["descricaoEfeitos"] = "Campo obrigatório";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Aqui poderíamos enviar para API. Por enquanto apenas log.
    console.log({ modalidade, data: form });
    navigate(-1);
  };

  const isSelected = (id: string, value: string) => Array.isArray(form[id]) && form[id].includes(value);
  const toggleMulti = (id: string, value: string) => {
    setForm((prev) => {
      const arr: string[] = Array.isArray(prev[id]) ? prev[id] : [];
      return { ...prev, [id]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const shouldRenderChild = (parentId: string, cond: string) => Array.isArray(form[parentId]) && form[parentId].includes(cond);

  // Exibe rótulos mais legíveis para opções como "semRegistro" e similares
  const prettyLabel = (s: string) => {
    const map: Record<string, string> = {
      semRegistro: "Sem registro",
      sim: "Sim",
      nao: "Não",
      manha: "Manhã",
      tarde: "Tarde",
      noite: "Noite",
    };
    if (map[s]) return map[s];
    // tenta separar camelCase e substituir separadores comuns
    const spaced = s
      .replace(/[-_]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const patientFields: Field[] = [];
  const incidentFields = schema.fields;

  // Lógica de exibição condicional de campos de incidente
  const showField = (f: Field): boolean => {
    if (f.id === "medicamentosSNC") {
      return form["usoMedicamentosSNC"] === "Sim";
    }
    if (f.id === "descricaoEfeitos") {
      return form["efeitoNocivo"] === "Sim";
    }
    return true;
  };

  const groupConfig = useMemo(() => {
    if (modalidade === "reacao-adversa") {
      return {
        "Dados principais": ["idadeMomentoValor", "idadeMomentoUnidade", "descricaoIncidente"],
        "Reações / Sintomas": ["descricaoReacao", "reacao_dataInicio", "reacao_dataFim", "reacao_duracao", "reacao_desfecho"],
        Medicamentos: ["med_nomeGenerico", "med_provavelCausador", "med_fabricante", "med_lote", "med_posologia", "med_viaAdministracao", "med_dataInicio", "med_dataFim", "med_duracao", "med_indicacao", "med_acaoAdotada"],
      } as Record<string, string[]>;
    }
    if (modalidade === "erro-medicacao") {
      return {
        "Dados principais": ["idadeMomentoValor", "idadeMomentoUnidade", "descricaoIncidente"],
        "Dados do erro": ["erro_dataInicio", "erro_dataFim", "ocorrencia", "descricaoErro", "efeitoNocivo", "descricaoEfeitos", "desfecho", "causasErro", "localErro"],
        Medicamentos: ["med_nomeGenerico", "med_posologia", "med_viaAdministracao", "med_dataInicio", "med_dataFim", "med_indicacao", "med_lote", "med_validade"],
      } as Record<string, string[]>;
    }
    return null;
  }, [modalidade]);

  const incidentFieldElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    const inserted = new Set<string>();
    for (const f of incidentFields) {
      if (!showField(f)) continue;
      if (groupConfig) {
        for (const [groupTitle, ids] of Object.entries(groupConfig)) {
          if (ids.includes(f.id) && !inserted.has(groupTitle)) {
            elements.push(
              <div key={"group-" + groupTitle} className="md:col-span-2 mt-6">
                <h4 className="text-base font-semibold">{groupTitle}</h4>
              </div>
            );
            inserted.add(groupTitle);
            break;
          }
        }
      }
      elements.push(
        <div key={f.id} className="space-y-2">
          <Label htmlFor={f.id}>
            {f.label}
            {f.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {f.type === "text" && <Input id={f.id} value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} />}
          {f.type === "number" && <Input id={f.id} type="number" value={valAsStr(f.id)} min={(f as NumberField).min} max={(f as NumberField).max} onChange={(e) => set(f.id, e.target.value)} />}
          {f.type === "date" && <Input id={f.id} type="date" value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} />}
          {f.type === "time" && <Input id={f.id} type="time" value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} />}
          {f.type === "textarea" && <Textarea id={f.id} value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} rows={4} />}
          {f.type === "radio" && (
            <div className="flex flex-wrap gap-3">
              {(f as RadioField).options.map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2 border rounded-md px-3 py-2">
                  <input type="radio" name={f.id} value={opt} checked={(form[f.id] || "") === opt} onChange={(e) => set(f.id, e.target.value)} />
                  <span className="text-sm">{prettyLabel(opt)}</span>
                </label>
              ))}
            </div>
          )}
          {f.type === "select" && (
            <Select value={valAsStr(f.id)} onValueChange={(v) => set(f.id, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {(f as SelectField).options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {prettyLabel(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {f.type === "multiselect" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {(f as MultiselectField).options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-accent/40">
                  <Checkbox checked={isSelected(f.id, opt)} onCheckedChange={() => toggleMulti(f.id, opt)} />
                  <span className="text-sm">{prettyLabel(opt)}</span>
                </label>
              ))}
            </div>
          )}
          {f.type === "multiselect" &&
            (f as MultiselectField).children?.map((c) =>
              shouldRenderChild(f.id, c.whenIncludes) ? (
                <div key={c.whenIncludes} className="mt-2 md:col-span-2 space-y-4">
                  {c.fields.map((cf) => (
                    <div key={cf.id} className="space-y-2">
                      <Label htmlFor={cf.id}>{cf.label}</Label>
                      {cf.type === "multiselect" && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {(cf as MultiselectField).options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-accent/40">
                              <Checkbox checked={isSelected(cf.id, opt)} onCheckedChange={() => toggleMulti(cf.id, opt)} />
                              <span className="text-sm">{prettyLabel(opt)}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {cf.type === "text" && <Input id={cf.id} value={valAsStr(cf.id)} onChange={(e) => set(cf.id, e.target.value)} />}
                      {cf.type === "number" && <Input id={cf.id} type="number" value={valAsStr(cf.id)} min={(cf as NumberField).min} max={(cf as NumberField).max} onChange={(e) => set(cf.id, e.target.value)} />}
                    </div>
                  ))}
                </div>
              ) : null
            )}
          {errors[f.id] && <p className="text-xs text-destructive">{errors[f.id]}</p>}
        </div>
      );
    }
    return elements;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentFields, form, modalidade, groupConfig]);

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <Card>
          <CardHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
            <CardTitle className="text-xl md:text-2xl">{schema.title}</CardTitle>
            <CardDescription>Preencha os dados da notificação</CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="grid gap-8">
              {/* Seção: Dados do Paciente */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 pt-5">
                  <h3 className="text-lg font-semibold">Dados do paciente</h3>
                  <p className="text-sm text-muted-foreground">Informações cadastrais do paciente</p>
                </div>
                <div className="space-y-2">
                  <Label>
                    Nome <span className="text-destructive">*</span>
                  </Label>
                  <Input value={pacienteNome} onChange={(e) => setPacienteNome(e.target.value)} />
                  {errors.pacienteNome && <p className="text-xs text-destructive">{errors.pacienteNome}</p>}
                </div>
                <div className="space-y-2">
                  <Label>
                    Prontuário <span className="text-destructive">*</span>
                  </Label>
                  <Input value={pacienteProntuario} onChange={(e) => setPacienteProntuario(e.target.value)} />
                  {errors.pacienteProntuario && <p className="text-xs text-destructive">{errors.pacienteProntuario}</p>}
                </div>
                <div className="space-y-2">
                  <Label>
                    Setor <span className="text-destructive">*</span>
                  </Label>
                  <Select value={pacienteSetor} onValueChange={setPacienteSetor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {setoresOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pacienteSetor && <p className="text-xs text-destructive">{errors.pacienteSetor}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Leito</Label>
                  <Input value={pacienteLeito} onChange={(e) => setPacienteLeito(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>
                    Sexo <span className="text-destructive">*</span>
                  </Label>
                  <Select value={pacienteSexo} onValueChange={setPacienteSexo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexoOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pacienteSexo && <p className="text-xs text-destructive">{errors.pacienteSexo}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Peso (kg)</Label>
                  <Input type="number" value={pacientePeso} onChange={(e) => setPacientePeso(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>
                    Data de nascimento <span className="text-destructive">*</span>
                  </Label>
                  <Input type="date" value={pacienteDataNascimento} onChange={(e) => setPacienteDataNascimento(e.target.value)} />
                  {errors.pacienteDataNascimento && <p className="text-xs text-destructive">{errors.pacienteDataNascimento}</p>}
                </div>
              </div>

              {/* Seção: Dados do Incidente */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold">Dados do incidente</h3>
                  <p className="text-sm text-muted-foreground">Detalhes do evento</p>
                </div>
                {incidentFieldElements}
              </div>

              {/* Seção: Dados do Notificador */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold">Dados do notificador</h3>
                  <p className="text-sm text-muted-foreground">Informe seus dados (todos opcionais, exceto o vínculo com a gerência de risco)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificadorNome">Nome</Label>
                  <Input id="notificadorNome" value={notificadorNome} onChange={(e) => setNotificadorNome(e.target.value)} placeholder="Ex.: Maria Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificadorEmail">E-mail</Label>
                  <Input id="notificadorEmail" type="email" value={notificadorEmail} onChange={(e) => setNotificadorEmail(e.target.value)} placeholder="exemplo@dominio.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificadorTelefone">Telefone</Label>
                  <Input id="notificadorTelefone" type="tel" value={notificadorTelefone} onChange={(e) => setNotificadorTelefone(e.target.value)} placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label>
                    Tipo de notificador <span className="text-destructive">*</span>
                  </Label>
                  <Select value={notificadorTipo} onValueChange={setNotificadorTipo}>
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
                  <Select value={notificadorSetor} onValueChange={setNotificadorSetor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {setoresOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
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
                  <Select value={notificadorCategoria} onValueChange={setNotificadorCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriaProfOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.notificadorCategoria && <p className="text-xs text-destructive">{errors.notificadorCategoria}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 sticky bottom-0 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t py-4">
              <div className="w-full md:w-auto flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default ModalidadeForm;
