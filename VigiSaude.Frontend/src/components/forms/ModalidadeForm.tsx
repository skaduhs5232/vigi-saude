import React, { useMemo, useState } from "react";
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

const schemas: Record<string, ModalidadeSchema> = {
  queda: {
    title: "Queda",
    fields: [
      { id: "nomePaciente", type: "text", label: "Nome do paciente", required: true },
      { id: "codigo", type: "text", label: "Código" },
      { id: "numeroProntuario", type: "text", label: "Número de prontuário" },
      { id: "setor", type: "text", label: "Setor" },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "diagnosticoPaciente", type: "textarea", label: "Diagnóstico do paciente" },
      { id: "avaliacaoRiscoQuedaNaAdmissao", type: "radio", label: "Paciente avaliado para risco de queda na admissão", options: ["sim", "nao"], required: true },
      { id: "registroOrientacaoPrevencaoQueda", type: "radio", label: "Registro de orientação para prevenção de queda", options: ["sim", "nao"] },
      { id: "riscoQuedaIdentificadoNaAdmissao", type: "radio", label: "Risco de queda identificado na admissão", options: ["sim", "nao"], required: true },
      {
        id: "fatoresRisco",
        type: "multiselect",
        label: "Fatores que dispõem ao risco",
        options: [
          "alteracaoEstadoMentalConfuso",
          "disturbioNeurologico",
          "prejuizoEquilibrioMarcha",
          "deficitSensitivo",
          "quedaAnterior",
          "idadeMaior60OuCrianca",
          "urgenciaUrinariaIntestinal",
          "medicamentosSNC",
          "polifarmacia",
        ],
        children: [
          {
            whenIncludes: "medicamentosSNC",
            fields: [
              { id: "quaisMedicamentosSNC", type: "multiselect", label: "Medicamentos (SNC)", options: [
                "antiarritmicos",
                "antiHipertensivos",
                "antipsicoticos",
                "antidepressivos",
                "anticonvulsivantes",
                "anestesicosGerais",
                "antidiabeticos",
                "benzodiazepinicos",
              ] },
            ],
          },
          {
            whenIncludes: "polifarmacia",
            fields: [
              { id: "qtdeMedicamentosBaixo", type: "number", label: "Qtd. medicamentos (baixo)", min: 0 },
              { id: "qtdeMedicamentosMedio", type: "number", label: "Qtd. medicamentos (médio)", min: 0 },
              { id: "qtdeMedicamentosAlto", type: "number", label: "Qtd. medicamentos (alto)", min: 0 },
            ],
          },
        ],
      },
      { id: "pacientePossuiAcompanhante", type: "radio", label: "Paciente possui acompanhante", options: ["sim", "nao"] },
      { id: "tipoDeQueda", type: "multiselect", label: "Tipo de queda", options: ["berco", "cama", "maca", "escadasDegraus", "enquantoTransportado", "equipamentoTerapeutico", "banheiro"], required: true },
      { id: "horarioDaQueda", type: "time", label: "Horário da queda", required: true },
      { id: "turno", type: "select", label: "Turno", options: ["manha", "tarde", "noite"], required: true },
      { id: "consequenciasDaQueda", type: "textarea", label: "Consequências da queda" },
    ],
  },
  "lesao-pressao": {
    title: "Lesão por pressão",
    fields: [
      { id: "nomePaciente", type: "text", label: "Nome do paciente", required: true },
      { id: "codigo", type: "text", label: "Código" },
      { id: "numeroProntuario", type: "text", label: "Número de prontuário" },
      { id: "setor", type: "text", label: "Setor" },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "dataPrimeiraAvaliacaoRisco", type: "date", label: "Data da 1ª avaliação de risco" },
      { id: "classificacaoRiscoBraden", type: "select", label: "Classificação de risco (Braden)", options: ["semRisco", "leve", "moderado", "elevado", "muitoElevado", "semRegistro"] },
      { id: "totalEscoreBraden", type: "number", label: "Total de escores (Braden)", min: 0, max: 23 },
      { id: "reavaliacao48h", type: "radio", label: "Reavaliação de risco a cada 48h", options: ["sim", "nao", "semRegistro"] },
      { id: "mobilidadePrejudicada", type: "radio", label: "Mobilidade prejudicada", options: ["sim", "nao", "semRegistro"] },
      { id: "avaliacaoBradenRealizadaPor", type: "select", label: "Avaliação Braden realizada por", options: ["enfermeiro", "estagiarioEstomoterapia", "semRegistro"] },
      { id: "registroBradenSAE", type: "radio", label: "Registro da Escala de Braden na SAE", options: ["sim", "nao"] },
      { id: "registroMobilidadeSAE", type: "radio", label: "Registro de mobilidade prejudicada na SAE", options: ["sim", "nao", "semRegistro"] },
      { id: "mudancaDecubito", type: "radio", label: "Mudança de decúbito", options: ["sim", "nao"] },
      { id: "tempoInternacaoAteLesao", type: "select", label: "Tempo de internação até o surgimento da lesão", options: ["dias0a14", "dias15a30", "dias31a45", "acima45"] },
      {
        id: "localDaLesao",
        type: "multiselect",
        label: "Local da lesão",
        options: ["sacral", "calcaneo", "trocanter", "colunaVertebral", "occipital", "panturrilha", "joelho", "pavilhaoAuricular", "outro"],
        children: [
          { whenIncludes: "outro", fields: [ { id: "localDaLesaoOutro", type: "text", label: "Outro (qual?)" } ] },
        ],
      },
      { id: "estagioDaLesao", type: "select", label: "Estágio da lesão", options: ["I", "II", "III", "IV", "indeterminado"] },
      { id: "usoSuperficieDinamicaAntes", type: "radio", label: "Uso de superfície dinâmica de apoio antes da lesão", options: ["sim", "nao"] },
      { id: "avaliacaoNutricionistaSolicitada", type: "radio", label: "Avaliação do nutricionista solicitada", options: ["sim", "nao"] },
      { id: "registroAvaliacaoNutricional", type: "radio", label: "Registro de avaliação nutricional", options: ["sim", "nao"] },
      { id: "registroAvaliacaoFisioterapica", type: "radio", label: "Registro de avaliação fisioterápica", options: ["sim", "nao"] },
      { id: "registroIncidenteEvolucaoEnfermagem", type: "radio", label: "Registro do incidente na evolução da enfermagem", options: ["sim", "nao"] },
      { id: "usoCoberturaAdequada", type: "radio", label: "Uso de cobertura adequada conforme estágio", options: ["sim", "nao", "semRegistro"] },
    ],
  },
  padrao: {
    title: "Formulário padrão",
    fields: [
      { id: "nomePaciente", type: "text", label: "Nome do paciente", required: true },
      { id: "codigo", type: "text", label: "Código" },
      { id: "numeroProntuario", type: "text", label: "Número de prontuário" },
      { id: "setor", type: "text", label: "Setor" },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
    ],
  },
};

export type ModalidadeFormProps = {
  modalidade: string; // "queda" | "lesao-pressao" | outros
};

export function ModalidadeForm({ modalidade }: ModalidadeFormProps) {
  const navigate = useNavigate();
  const schema = useMemo<ModalidadeSchema>(() => {
    if (schemas[modalidade]) return schemas[modalidade];
    return schemas.padrao;
  }, [modalidade]);

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (id: string, value: unknown) => setForm((p) => ({ ...p, [id]: value }));
  const valAsStr = (id: string): string => {
    const v = form[id];
    return v === undefined || v === null ? "" : String(v);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of schema.fields) {
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

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <Card>
          <CardHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
            <CardTitle className="text-xl md:text-2xl">{schema.title}</CardTitle>
            <CardDescription>Preencha os dados da notificação</CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {schema.fields.map((f) => (
                <div key={f.id} className="space-y-2">
                  <Label htmlFor={f.id}>
                    {f.label}{f.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {f.type === "text" && (
                    <Input id={f.id} value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} />
                  )}
                  {f.type === "number" && (
                    <Input id={f.id} type="number" value={valAsStr(f.id)} min={(f as NumberField).min} max={(f as NumberField).max} onChange={(e) => set(f.id, e.target.value)} />
                  )}
                  {f.type === "date" && (
                    <Input id={f.id} type="date" value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} />
                  )}
                  {f.type === "time" && (
                    <Input id={f.id} type="time" value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} />
                  )}
                  {f.type === "textarea" && (
                    <Textarea id={f.id} value={valAsStr(f.id)} onChange={(e) => set(f.id, e.target.value)} rows={4} />
                  )}
                  {f.type === "radio" && (
                    <div className="flex flex-wrap gap-3">
                      {(f as RadioField).options.map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-2 border rounded-md px-3 py-2">
                          <input
                            type="radio"
                            name={f.id}
                            value={opt}
                            checked={(form[f.id] || "") === opt}
                            onChange={(e) => set(f.id, e.target.value)}
                          />
                          <span className="text-sm">{opt}</span>
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
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {f.type === "multiselect" && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2">
                      {(f as MultiselectField).options.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-accent/40">
                          <Checkbox checked={isSelected(f.id, opt)} onCheckedChange={() => toggleMulti(f.id, opt)} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {f.type === "multiselect" && (f as MultiselectField).children?.map((c) => (
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
                                    <span className="text-sm">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {cf.type === "text" && (
                              <Input id={cf.id} value={valAsStr(cf.id)} onChange={(e) => set(cf.id, e.target.value)} />
                            )}
                            {cf.type === "number" && (
                              <Input id={cf.id} type="number" value={valAsStr(cf.id)} min={(cf as NumberField).min} max={(cf as NumberField).max} onChange={(e) => set(cf.id, e.target.value)} />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null
                  ))}
                  {errors[f.id] && <p className="text-xs text-destructive">{errors[f.id]}</p>}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 sticky bottom-0 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t py-4">
              <div className="w-full md:w-auto flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
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
