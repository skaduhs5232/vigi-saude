import { Desfecho } from "../services/erro-medicacao.service";
import { PayloadNotificacaoLesaoPressao } from "../services/lesao-pressao.service";
import { PayloadNotificacaoFlebite } from "../services/flebite.service";

// Base field definitions for dynamic schemas
export type FieldBase = { id: string; label: string; required?: boolean };
export type TextField = FieldBase & { type: "text" };
export type NumberField = FieldBase & { type: "number"; min?: number; max?: number };
export type DateField = FieldBase & { type: "date" };
export type TimeField = FieldBase & { type: "time" };
export type TextareaField = FieldBase & { type: "textarea" };
export type RadioField = FieldBase & { type: "radio"; options: string[] };
export type SelectField = FieldBase & { type: "select"; options: string[] };
export type MultiselectChild = { whenIncludes: string; fields: Field[] };
export type MultiselectField = FieldBase & { type: "multiselect"; options: string[]; children?: MultiselectChild[] };
export type Field =
  | TextField
  | NumberField
  | DateField
  | TimeField
  | TextareaField
  | RadioField
  | SelectField
  | MultiselectField;

export type ModalidadeSchema = { title: string; fields: Field[] };

export const setoresOptions = [
  "Emergência Unidade 24h",
  "Emergência unidade de retaguarda",
  "Emergência obstétrica",
  "UTI",
  "Clínica cirúrgica",
  "Clínica médica",
  "Clínica pediátrica",
  "Clínica gineco-obstetrica",
  "CPN",
  "Centro cirúrgico",
  "Neonatologia",
  "Canguru",
  "Centro de imagem",
  "Laboratório",
  "Farmácia",
  "Transporte",
];

export const categoriaProfOptions = ["Médico", "Enfermeiro", "Farmacêutico", "Dentista", "Outros"];
export const sexoOptions = ["M", "F", "Desconhecido"];
export const viaAdministracaoOpcoes = [
  "Oral",
  "Intramuscular",
  "Endovenosa",
  "Dérmica",
  "Inalatória",
  "Subcutânea",
  "Nasal",
  "Ocular",
  "Retal",
  "Vaginal",
  "Outra",
  "Desconhecida",
];

export const schemas: Record<string, ModalidadeSchema> = {
  queda: {
    title: "Queda",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      {
        id: "idadeMomentoUnidade",
        type: "select",
        label: "Idade no momento (unidade)",
        required: true,
        options: ["hora", "dia", "semana", "mês", "ano"],
      },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "diagnostico", type: "textarea", label: "Diagnóstico", required: true },
      {
        id: "avaliacaoRiscoAdmissao",
        type: "radio",
        label: "Avaliação de risco na admissão",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "registroOrientacao",
        type: "radio",
        label: "Registro de orientação",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "riscoQuedaIdentificado",
        type: "radio",
        label: "Risco de queda identificado",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "fatoresPredisponentes",
        type: "multiselect",
        label: "Fatores predisponentes",
        required: true,
        options: [
          "Alteração do estado mental confuso",
          "Distúrbio neurológico",
          "Prejuízo do equilíbrio da marcha",
          "Déficit sensitivo",
          "Queda anterior",
          "Idade > 60 anos ou criança",
          "Urgência urinária/intestinal",
          "Medicamentos que alteram SNC",
        ],
      },
      {
        id: "usoMedicamentosSNC",
        type: "radio",
        label: "Uso de medicamentos SNC (se sim, especificar abaixo)",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "medicamentosSNC",
        type: "multiselect",
        label: "Medicamentos SNC",
        options: [
          "Antiarritmicos",
          "Antipsicóticos",
          "Antidepressivos",
          "Anticonvulsivantes",
          "Anti-hipertensivos",
          "Anestésico geral",
          "Antidiabéticos",
          "Benzodiazepínicos",
          "Diuréticos",
          "Opioides",
          "Relaxantes musculares",
          "Tricíclicos",
          "Polifarmácia",
        ],
      },
      {
        id: "quantidadeMedicamentosBaixoRisco",
        type: "number",
        label: "Qtd. med. baixo risco",
        required: true,
        min: 0,
      },
      {
        id: "quantidadeMedicamentosMedioRisco",
        type: "number",
        label: "Qtd. med. médio risco",
        required: true,
        min: 0,
      },
      {
        id: "quantidadeMedicamentosAltoRisco",
        type: "number",
        label: "Qtd. med. alto risco",
        required: true,
        min: 0,
      },
      { id: "acompanhante", type: "radio", label: "Acompanhante", required: true, options: ["Sim", "Não"] },
      {
        id: "tipoQueda",
        type: "select",
        label: "Tipo de queda",
        required: true,
        options: ["Tropeçar", "Perda de equilíbrio", "Escorregar", "Da própria altura", "Desmaio"],
      },
      {
        id: "localQueda",
        type: "select",
        label: "Local da queda",
        required: true,
        options: [
          "Berço",
          "Maca",
          "Escadas",
          "Cama",
          "Banheiro",
          "Equipamento diagnóstico/terapêutico",
          "Cadeira",
          "Quarto",
          "Transporte",
        ],
      },
      { id: "horarioQueda", type: "time", label: "Horário da queda", required: true },
      { id: "turno", type: "select", label: "Turno", required: true, options: ["Manhã", "Tarde", "Noite"] },
      { id: "consequencias", type: "textarea", label: "Consequências", required: true },
    ],
  },
  "lesao-pressao": {
    title: "Lesão por pressão",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      {
        id: "idadeMomentoUnidade",
        type: "select",
        label: "Idade no momento (unidade)",
        required: true,
        options: ["hora", "dia", "semana", "mês", "ano"],
      },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "dataPrimeiraAvaliacao", type: "date", label: "Data 1ª avaliação", required: true },
      {
        id: "classificacaoIncidente",
        type: "select",
        label: "Classificação do Incidente",
        required: true,
        options: ["Incidente sem dano", "Incidente com dano", "Evento adverso", "Quase erro"],
      },
      {
        id: "classificacaoDano",
        type: "select",
        label: "Classificação do Dano",
        required: true,
        options: ["Nenhum", "Leve", "Moderado", "Grave", "Óbito"],
      },
      { id: "descricaoIncidente", type: "textarea", label: "Descrição do Incidente", required: true },
      {
        id: "classificacaoRiscoBraden",
        type: "select",
        label: "Classificação risco (Braden)",
        required: true,
        options: ["Sem risco", "Leve", "Moderado", "Elevado", "Muito elevado", "Sem registro"],
      },
      { id: "totalEscores", type: "number", label: "Total escores", required: true, min: 0 },
      {
        id: "reavaliacao48h",
        type: "radio",
        label: "Reavaliação 48h",
        required: true,
        options: ["Sim", "Não", "Sem registro"],
      },
      {
        id: "mobilidadePrejudicada",
        type: "radio",
        label: "Mobilidade prejudicada",
        required: true,
        options: ["Sim", "Não", "Sem registro"],
      },
      {
        id: "avaliacaoPor",
        type: "select",
        label: "Avaliação por",
        required: true,
        options: ["Enfermeiro", "Estomoterapia", "Sem registro"],
      },
      {
        id: "registroBradenSAE",
        type: "radio",
        label: "Registro Braden SAE",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "registroMobilidadeSAE",
        type: "radio",
        label: "Registro mobilidade SAE",
        required: true,
        options: ["Sim", "Não", "Sem registro"],
      },
      {
        id: "mudancaDecubito",
        type: "radio",
        label: "Mudança de decúbito",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "intervaloMudanca",
        type: "select",
        label: "Intervalo mudança",
        required: true,
        options: ["2h", "3h", "Outro"],
      },
      {
        id: "tempoInternacaoLesao",
        type: "select",
        label: "Tempo internação até lesão",
        required: true,
        options: ["0-14 dias", "15-30 dias", "31-45 dias", "Acima de 45 dias"],
      },
      {
        id: "localLesao",
        type: "multiselect",
        label: "Local da lesão",
        required: true,
        options: [
          "Sacral",
          "Calcâneo",
          "Trocânter",
          "Coluna vertebral",
          "Occipital",
          "Panturrilha",
          "Joelho",
          "Pavilhão auricular",
          "Outro",
        ],
      },
      { id: "estagioLesao", type: "select", label: "Estágio", required: true, options: ["I", "II", "III", "IV", "Indeterminado"] },
      {
        id: "usoColchaoDinamico",
        type: "radio",
        label: "Uso colchão dinâmico",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "avaliacaoNutricionista",
        type: "radio",
        label: "Avaliação nutricionista",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "registroAvaliacaoNutricional",
        type: "radio",
        label: "Registro avaliação nutricional",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "registroAvaliacaoFisioterapia",
        type: "radio",
        label: "Registro avaliação fisioterapia",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "registroIncidenteEnfermagem",
        type: "radio",
        label: "Registro incidente enfermagem",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "usoCoberturaAdequada",
        type: "radio",
        label: "Uso cobertura adequada",
        required: true,
        options: ["Sim", "Não", "Sem registro"],
      },
    ],
  },
  flebite: {
    title: "Flebite",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      {
        id: "idadeMomentoUnidade",
        type: "select",
        label: "Idade no momento (unidade)",
        required: true,
        options: ["hora", "dia", "semana", "mês", "ano"],
      },
      { id: "dataAdmissao", type: "date", label: "Data de admissão", required: true },
      { id: "diagnostico", type: "textarea", label: "Diagnóstico", required: true },
      {
        id: "grauFlebite",
        type: "select",
        label: "Grau flebite",
        required: true,
        options: [
          "I (dor + eritema/edema sem endurecimento)",
          "II (dor + eritema/edema com endurecimento)",
          "III (dor + eritema/edema com endurecimento + cordão fibroso palpável)",
        ],
      },
      { id: "localPuncao", type: "text", label: "Local punção", required: true },
      { id: "numeroPuncoes", type: "number", label: "Número punções", required: true, min: 0 },
      { id: "tipoCateter", type: "text", label: "Tipo cateter", required: true },
      { id: "calibreCateter", type: "text", label: "Calibre cateter", required: true },
      { id: "materialCateter", type: "text", label: "Material cateter", required: true },
      { id: "numeroCateteresLumen", type: "number", label: "Nº lúmens", required: true, min: 0 },
      { id: "tempoPermanencia", type: "text", label: "Tempo permanência", required: true },
      { id: "dataRetirada", type: "date", label: "Data retirada", required: true },
      {
        id: "usoMedicamentosVesicantes",
        type: "radio",
        label: "Uso medicamentos vesicantes",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        id: "medicamentosAdministrados_medicamento",
        type: "text",
        label: "Medicamento administrado",
        required: true,
      },
      { id: "medicamentosAdministrados_diluente", type: "text", label: "Diluente", required: true },
      { id: "medicamentosAdministrados_modoInfusao", type: "text", label: "Modo infusão", required: true },
      { id: "monitoramentoCateter_data", type: "date", label: "Data monitoramento", required: true },
      {
        id: "monitoramentoCateter_registroAcesso",
        type: "text",
        label: "Registro acesso",
        required: true,
      },
    ],
  },
  "reacao-adversa": {
    title: "Reação adversa a medicamento",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      {
        id: "idadeMomentoUnidade",
        type: "select",
        label: "Idade no momento (unidade)",
        required: true,
        options: ["hora", "dia", "semana", "mês", "ano"],
      },
      { id: "descricaoIncidente", type: "textarea", label: "Descrição do incidente", required: true },
      { id: "descricaoReacao", type: "textarea", label: "Descrição da reação", required: true },
      { id: "reacao_dataInicio", type: "date", label: "Início reação", required: true },
      { id: "reacao_dataFim", type: "date", label: "Fim reação", required: true },
      { id: "reacao_duracao", type: "text", label: "Duração reação", required: true },
      { id: "reacao_desfecho", type: "select", label: "Desfecho", required: true, options: [] },
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
      {
        id: "med_acaoAdotada",
        type: "select",
        label: "Ação adotada",
        required: true,
        options: ["Parou", "Dose reduzida", "Dose aumentada", "Dose inalterada", "Desconhecido", "Não aplicável"],
      },
    ],
  },
  "erro-medicacao": {
    title: "Erro de medicação",
    fields: [
      { id: "idadeMomentoValor", type: "number", label: "Idade no momento (valor)", required: true, min: 0 },
      {
        id: "idadeMomentoUnidade",
        type: "select",
        label: "Idade no momento (unidade)",
        required: true,
        options: ["hora", "dia", "semana", "mês", "ano"],
      },
      { id: "descricaoIncidente", type: "textarea", label: "Descrição do incidente", required: true },
      { id: "erro_dataInicio", type: "date", label: "Início", required: true },
      { id: "erro_dataFim", type: "date", label: "Fim", required: true },
      {
        id: "ocorrencia",
        type: "select",
        label: "Ocorrência",
        required: true,
        options: [
          "Erro de prescrição",
          "Erro de aprazamento",
          "Erro de solicitação",
          "Erro de dispensação",
          "Erro de administração",
          "Outro",
        ],
      },
      { id: "descricaoErro", type: "textarea", label: "Descrição do erro", required: true },
      { id: "efeitoNocivo", type: "select", label: "Efeito nocivo", required: true, options: ["Sim", "Não", "Desconhecido"] },
      { id: "descricaoEfeitos", type: "textarea", label: "Descrição dos efeitos" },
      { id: "desfecho", type: "select", label: "Desfecho", required: true, options: [] },
      {
        id: "causasErro",
        type: "multiselect",
        label: "Causas do erro",
        required: true,
        options: [
          "Abreviação",
          "Nomes similares",
          "Distração",
          "Cálculo/preparação",
          "Rotina de administração",
          "Prescrição",
          "Equipamentos",
          "Outro",
        ],
      },
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

export type EditModePayload = {
  isEdit: boolean;
  modalidade: string;
  notificationId?: number;
  payload?: PayloadNotificacaoLesaoPressao | PayloadNotificacaoFlebite;
  dadosFormulario?: Record<string, unknown>;
  dadosPaciente?: Record<string, unknown>;
  dadosNotificador?: Record<string, unknown>;
};

export type DesfechoOption = Desfecho;
