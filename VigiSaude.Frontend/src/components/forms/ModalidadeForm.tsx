import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  criarNotificacaoLesaoPressao,
  putLesaoPressao,
  PayloadNotificacaoLesaoPressao
} from "./services/lesao-pressao.service";
import { criarNotificacaoQueda } from "./services/queda.service";
import { criarNotificacaoFlebite, PayloadNotificacaoFlebite, MedicamentoFlebite } from "./services/flebite.service";
import { criarNotificacaoReacaoAdversa, obterDesfechos as obterDesfechosReacao } from "./services/reacao-adversa.service";
import { criarNotificacaoErroMedicacao, obterDesfechos as obterDesfechosErro, Desfecho } from "./services/erro-medicacao.service";
import { DadosPaciente, DadosNotificador } from "./interfaces/padroes";
import { useDadosDinamicos } from "./hooks/useDadosDinamicos";

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

const setoresOptions = ["Emergência Unidade 24h", "Emergência unidade de retaguarda", "Emergência obstétrica", "UTI", "Clínica cirúrgica", "Clínica médica", "Clínica pediátrica", "Clínica gineco-obstetrica", "CPN", "Centro cirúrgico", "Neonatologia", "Canguru", "Centro de imagem", "Laboratório", "Farmácia", "Transporte"];
const categoriaProfOptions = ["Médico", "Enfermeiro", "Farmacêutico", "Dentista", "Outros"];
const sexoOptions = ["M", "F", "Desconhecido"];
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
      { id: "classificacaoIncidente", type: "select", label: "Classificação do Incidente", required: true, options: ["Incidente sem dano", "Incidente com dano", "Evento adverso", "Quase erro"] },
      { id: "classificacaoDano", type: "select", label: "Classificação do Dano", required: true, options: ["Nenhum", "Leve", "Moderado", "Grave", "Óbito"] },
      { id: "descricaoIncidente", type: "textarea", label: "Descrição do Incidente", required: true },
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
      { id: "desfecho", type: "select", label: "Desfecho", required: true, options: [] },
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
  
  // ==================== DADOS DINÂMICOS DA API ====================
  const dadosDinamicos = useDadosDinamicos(modalidade);
  
  // ==================== CONFIGURAÇÃO DO SCHEMA ====================
  const schema = useMemo<ModalidadeSchema>(() => {
    if (schemas[modalidade]) return schemas[modalidade];
    return schemas.padrao;
  }, [modalidade]);

  // ==================== ESTADOS DO FORMULÁRIO ====================
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados do Notificador
  const [notificadorNome, setNotificadorNome] = useState<string>("");
  const [notificadorEmail, setNotificadorEmail] = useState<string>("");
  const [notificadorTelefone, setNotificadorTelefone] = useState<string>("");
  const [notificadorTipo, setNotificadorTipo] = useState<string>("");
  const [notificadorSetor, setNotificadorSetor] = useState<string>("");
  const [notificadorCategoria, setNotificadorCategoria] = useState<string>("");
  
  // Estados do Paciente
  const [pacienteNome, setPacienteNome] = useState("");
  const [pacienteProntuario, setPacienteProntuario] = useState("");
  const [pacienteSetor, setPacienteSetor] = useState("");
  const [pacienteLeito, setPacienteLeito] = useState("");
  const [pacienteSexo, setPacienteSexo] = useState("");
  const [pacientePeso, setPacientePeso] = useState("");
  const [pacienteDataNascimento, setPacienteDataNascimento] = useState("");
  
  const [desfechos, setDesfechos] = useState<Desfecho[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState<number | null>(null);
  const [originalLesaoPayload, setOriginalLesaoPayload] = useState<PayloadNotificacaoLesaoPressao | null>(null);

  const precisaDesfechos = useMemo(() => {
    return schema.fields.some(field => 
      field.id === "desfecho" || field.id === "reacao_desfecho"
    );
  }, [schema]);

  useEffect(() => {
    if (!precisaDesfechos) {
      return;
    }

    const carregarDesfechos = async () => {
      try {
        console.log(`Carregando desfechos para modalidade '${modalidade}'...`);
        
        const dados = modalidade === "reacao-adversa" 
          ? await obterDesfechosReacao()
          : await obterDesfechosErro();

        console.log('desfechos:', dados?.length || 0, 'itens');
        setDesfechos(dados);
      } catch (error) {
        toast.error('Erro ao carregar desfechos');
      }
    };
    
    carregarDesfechos();
  }, [precisaDesfechos, modalidade]);

  useEffect(() => {
    const notificadorData = {
      nome: notificadorNome,
      email: notificadorEmail,
      telefone: notificadorTelefone,
      tipo: notificadorTipo,
      setor: notificadorSetor,
      categoria: notificadorCategoria,
    };
    
    const hasData = Object.values(notificadorData).some(value => value.trim() !== "");
    if (hasData) {
      localStorage.setItem("lastNotificadorData", JSON.stringify(notificadorData));
    }
  }, [notificadorNome, notificadorEmail, notificadorTelefone, notificadorTipo, notificadorSetor, notificadorCategoria]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastNotificadorData");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!notificadorNome && parsed.nome) setNotificadorNome(parsed.nome);
        if (!notificadorEmail && parsed.email) setNotificadorEmail(parsed.email);
        if (!notificadorTelefone && parsed.telefone) setNotificadorTelefone(parsed.telefone);
        if (!notificadorTipo && parsed.tipo) setNotificadorTipo(parsed.tipo);
        if (!notificadorSetor && parsed.setor) setNotificadorSetor(parsed.setor);
        if (!notificadorCategoria && parsed.categoria) setNotificadorCategoria(parsed.categoria);
      }
    } catch {
      // ts-ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const booleanToRadioValue = useCallback((valor: boolean | null | undefined, allowSemRegistro = false): string => {
    if (valor === true) return "Sim";
    if (valor === false) return "Não";
    return allowSemRegistro ? "Sem registro" : "";
  }, []);

  const intervaloNumeroParaOpcao = useCallback((valor: number | null | undefined): string => {
    if (valor === 2) return "2h";
    if (valor === 3) return "3h";
    return valor !== undefined && valor !== null && valor !== 0 ? "Outro" : "";
  }, []);

  const preencherFormularioLesaoPressao = useCallback((payload: PayloadNotificacaoLesaoPressao) => {
    if (!payload) return;

    const paciente = payload.dadosPaciente;
    const lesao = payload.dadosLesaoPressao;
    const notificador = payload.dadosNotificador;

    if (paciente) {
  const pacienteRecord = paciente as unknown as Record<string, unknown>;
      const prontuario = pacienteRecord.prontuario ?? pacienteRecord.protuario ?? "";
      const setorPaciente = pacienteRecord.setor ?? null;
      const pesoPaciente = pacienteRecord.peso ?? pacienteRecord.pesoKg ?? null;

      setPacienteNome(paciente.nome || "");
      setPacienteProntuario(String(prontuario || ""));
      setPacienteSetor(
        lesao?.idSetor !== undefined && lesao?.idSetor !== null
          ? String(lesao.idSetor)
          : setorPaciente !== null && setorPaciente !== undefined
            ? String(setorPaciente)
            : ""
      );
      setPacienteLeito(paciente.leito || "");
      setPacienteSexo(paciente.sexo || "");
      setPacientePeso(pesoPaciente !== null && pesoPaciente !== undefined ? String(pesoPaciente) : "");
      setPacienteDataNascimento(paciente.dataNascimento || "");
    }

    if (notificador) {
      setNotificadorNome(notificador.nome || "");
      setNotificadorEmail(notificador.email || "");
      setNotificadorTelefone(notificador.telefone || "");
      setNotificadorTipo(notificador.funcionarioGerenciaRisco ? "Funcionário da gerência de risco" : "Não");
      setNotificadorSetor(notificador.setor !== undefined && notificador.setor !== null ? String(notificador.setor) : "");
      setNotificadorCategoria(notificador.categoria || "");
    }

    if (lesao) {
      const valoresFormulario: Record<string, unknown> = {
        dataAdmissao: paciente?.dataAdmissao || lesao.dataInicio || "",
        dataPrimeiraAvaliacao: lesao.dataPrimeiraAvaliacao || "",
        classificacaoIncidente: lesao.classificacaoIncidente || "",
        classificacaoDano: lesao.classificacaoDano || "",
        descricaoIncidente: lesao.descricao || "",
        classificacaoRiscoBraden: lesao.classificacaoBraden || "",
        totalEscores: lesao.escoreBraden ?? "",
        reavaliacao48h: lesao.reavaliacao48Horas || "",
        mobilidadePrejudicada: booleanToRadioValue(lesao.mobilidadePrejudicada, true),
        avaliacaoPor: lesao.responsavelAvaliacao || "",
        registroBradenSAE: lesao.resgistroSAE || "",
        registroMobilidadeSAE: lesao.resgistroSAE || "",
        mudancaDecubito: booleanToRadioValue(lesao.mudancaDecubito),
        intervaloMudanca: intervaloNumeroParaOpcao(lesao.intervaloMudanca),
        tempoInternacaoLesao: lesao.tempoInternacaoLesao || "",
        localLesao: lesao.idLocalLesao && lesao.idLocalLesao > 0 ? [String(lesao.idLocalLesao)] : [],
        estagioLesao: lesao.estagioLesao || "",
        usoColchaoDinamico: booleanToRadioValue(lesao.superficeDinamicaApoio),
        avaliacaoNutricionista: booleanToRadioValue(lesao.solicitacaoAvaliacaoNutri),
        registroAvaliacaoNutricional: booleanToRadioValue(lesao.registroAvaliacaoNutri),
        registroAvaliacaoFisioterapia: booleanToRadioValue(lesao.registroavaliacaoFisio),
        registroIncidenteEnfermagem: booleanToRadioValue(lesao.registroEnfermagem),
        usoCoberturaAdequada: lesao.usoCoberturaAdequada || "",
  descricaoOutro: (lesao as unknown as Record<string, unknown>)?.descricaoOutro ?? (lesao as unknown as Record<string, unknown>)?.descicaoOutro ?? "",
      };

      setForm((prev) => ({ ...prev, ...valoresFormulario }));
    }
  }, [booleanToRadioValue, intervaloNumeroParaOpcao]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("editNotificationData");
      if (!raw) {
        setIsEditMode(false);
        setOriginalLesaoPayload(null);
        setEditNotificationId(null);
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.isEdit) {
        setIsEditMode(false);
        setOriginalLesaoPayload(null);
        setEditNotificationId(null);
        return;
      }

      if (parsed.modalidade && parsed.modalidade !== modalidade) {
        setIsEditMode(false);
        setOriginalLesaoPayload(null);
        setEditNotificationId(null);
        return;
      }

      setIsEditMode(true);

      const notificationId = Number(parsed.notificationId);
      const hasValidId = !Number.isNaN(notificationId);
      setEditNotificationId(hasValidId ? notificationId : null);

      if (modalidade === "lesao-pressao" && parsed.payload) {
        const payload = parsed.payload as PayloadNotificacaoLesaoPressao;
        setOriginalLesaoPayload(payload);
        const lesaoIdRaw = payload.dadosLesaoPressao?.idLesaoPressao ?? parsed.notificationId;
        const lesaoId = Number(lesaoIdRaw);
        if (!Number.isNaN(lesaoId)) {
          setEditNotificationId(lesaoId);
        }
        preencherFormularioLesaoPressao(payload);
      } else {
        if (parsed.dadosFormulario) {
          setForm((prev) => ({ ...prev, ...parsed.dadosFormulario }));
        }

        const dadosPaciente = parsed.dadosPaciente || {};
        if (dadosPaciente.nome !== undefined) setPacienteNome(dadosPaciente.nome || "");
        if (dadosPaciente.prontuario !== undefined) setPacienteProntuario(dadosPaciente.prontuario || "");
        if (dadosPaciente.setor !== undefined) setPacienteSetor(String(dadosPaciente.setor || ""));
        if (dadosPaciente.leito !== undefined) setPacienteLeito(dadosPaciente.leito || "");
        if (dadosPaciente.sexo !== undefined) setPacienteSexo(dadosPaciente.sexo || "");
        if (dadosPaciente.peso !== undefined) setPacientePeso(String(dadosPaciente.peso || ""));
        if (dadosPaciente.dataNascimento !== undefined) setPacienteDataNascimento(dadosPaciente.dataNascimento || "");

        const dadosNotificador = parsed.dadosNotificador || {};
        if (dadosNotificador.nome !== undefined) setNotificadorNome(dadosNotificador.nome || "");
        if (dadosNotificador.email !== undefined) setNotificadorEmail(dadosNotificador.email || "");
        if (dadosNotificador.telefone !== undefined) setNotificadorTelefone(dadosNotificador.telefone || "");
        if (dadosNotificador.tipo !== undefined) setNotificadorTipo(dadosNotificador.tipo || "");
        if (dadosNotificador.setor !== undefined) setNotificadorSetor(String(dadosNotificador.setor || ""));
        if (dadosNotificador.categoria !== undefined) setNotificadorCategoria(dadosNotificador.categoria || "");
      }
    } catch (error) {
      console.error("Erro ao preparar dados para edição:", error);
    }
  }, [modalidade, preencherFormularioLesaoPressao]);

  // ==================== FUNÇÕES AUXILIARES ====================
  const carregarUltimosDados = () => {
    try {
      const raw = localStorage.getItem("lastNotificadorData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setNotificadorNome(parsed.nome || "");
        setNotificadorEmail(parsed.email || "");
        setNotificadorTelefone(parsed.telefone || "");
        setNotificadorTipo(parsed.tipo || "");
        setNotificadorSetor(parsed.setor || "");
        setNotificadorCategoria(parsed.categoria || "");
      }
    } catch {
      // ts-ignore
    }
  };

  const set = (id: string, value: unknown) => setForm((p) => ({ ...p, [id]: value }));
  
  const valAsStr = (id: string): string => {
    const v = form[id];
    return v === undefined || v === null ? "" : String(v);
  };

  const simNaoParaBoolean = (valor: unknown): boolean => {
    const str = String(valor || '');
    return str.toLowerCase() === 'sim';
  };

  const extrairNumero = (valor: unknown): number => {
    const str = String(valor || '');
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const parseDecimal = (valor: unknown): number => {
    const str = String(valor ?? '').replace(',', '.');
    const sanitized = str.replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(sanitized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const toDateOnly = (valor: unknown): string | null => {
    const str = String(valor ?? '').trim();
    if (!str) return null;
    return str;
  };


  // Mapear IDs dos campos para nomes legíveis
  const getFieldDisplayName = (fieldId: string): string => {
    const fieldMap: Record<string, string> = {
      // Campos do paciente
      "pacienteNome": "Nome do paciente",
      "pacienteProntuario": "Prontuário do paciente", 
      "pacienteSetor": "Setor do paciente",
      "pacienteSexo": "Sexo do paciente",
      "pacienteDataNascimento": "Data de nascimento do paciente",
      
      // Campos do notificador
      "notificadorNome": "Nome do notificador",
      "notificadorSetor": "Setor do notificador",
      "notificadorCategoria": "Categoria profissional do notificador",
      "notificadorTipo": "Tipo de notificador",
      
      // Campos específicos de incidentes
      "descricaoEfeitos": "Descrição dos efeitos",
    };

    // Se o campo está no mapa, retorna o nome amigável
    if (fieldMap[fieldId]) return fieldMap[fieldId];

    // Para campos do schema, busca o label
    const field = schema.fields.find(f => f.id === fieldId);
    if (field) return field.label;

    // Fallback: retorna o ID formatado
    return fieldId.replace(/([A-Z])/g, ' $1').toLowerCase();
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const missingFields: string[] = [];

    for (const f of schema.fields) {
      // pular campos condicionais invisíveis
      if (!showField(f)) continue;
      if (f.required) {
        const v = form[f.id];
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
          e[f.id] = "Campo obrigatório";
          missingFields.push(getFieldDisplayName(f.id));
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
    if (!notificadorNome) {
      e["notificadorNome"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("notificadorNome"));
    }
    if (!notificadorSetor) {
      e["notificadorSetor"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("notificadorSetor"));
    }
    if (!notificadorCategoria) {
      e["notificadorCategoria"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("notificadorCategoria"));
    }
    if (!notificadorTipo) {
      e["notificadorTipo"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("notificadorTipo"));
    }
    // Paciente
    if (!pacienteNome) {
      e["pacienteNome"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("pacienteNome"));
    }
    if (!pacienteProntuario) {
      e["pacienteProntuario"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("pacienteProntuario"));
    }
    if (!pacienteSetor) {
      e["pacienteSetor"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("pacienteSetor"));
    }
    if (!pacienteSexo) {
      e["pacienteSexo"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("pacienteSexo"));
    }
    if (!pacienteDataNascimento) {
      e["pacienteDataNascimento"] = "Campo obrigatório";
      missingFields.push(getFieldDisplayName("pacienteDataNascimento"));
    }

    if (form["efeitoNocivo"] === "Sim") {
      const v = form["descricaoEfeitos"];
      if (!v) {
        e["descricaoEfeitos"] = "Campo obrigatório";
        missingFields.push(getFieldDisplayName("descricaoEfeitos"));
      }
    }

    setErrors(e);

    if (missingFields.length > 0) {
      const message = missingFields.length === 1 
        ? `Campo obrigatório: ${missingFields[0]}`
        : `Campos obrigatórios faltando: ${missingFields.join(", ")}`;
      
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const dadosPaciente: DadosPaciente = {
      nome: pacienteNome,
      prontuario: pacienteProntuario,
      setor: pacienteSetor,
      leito: pacienteLeito,
      sexo: pacienteSexo,
      peso: pacientePeso,
      dataNascimento: pacienteDataNascimento,
    };

    const dadosNotificador: DadosNotificador = {
      nome: notificadorNome,
      email: notificadorEmail,
      telefone: notificadorTelefone,
      tipo: notificadorTipo,
      setor: notificadorSetor,
      categoria: notificadorCategoria,
    };

    toast.info(isEditMode ? "Atualizando notificação..." : "Criando notificação...", {
      position: "top-right",
      autoClose: 2000,
    });

    try {
      let resultado;

      if (modalidade === "lesao-pressao") {
        const lesaoOriginal = originalLesaoPayload?.dadosLesaoPressao;
        const pacienteOriginal = originalLesaoPayload?.dadosPaciente;
        const notificadorOriginal = originalLesaoPayload?.dadosNotificador;

        const funcionarioGerenciaRisco = notificadorTipo === "Funcionário da gerência de risco";

        const registroBraden = String(form.registroBradenSAE || '').toLowerCase();
        const registroMobilidade = String(form.registroMobilidadeSAE || '').toLowerCase();
        const resgistroSAE = (registroBraden === 'sim' || registroMobilidade === 'sim') ? 'Sim' : 'Não';

        const localLesaoArray = Array.isArray(form.localLesao) ? (form.localLesao as string[]) : [];
        const idLocalLesao = localLesaoArray.length > 0
          ? Number(localLesaoArray[0])
          : lesaoOriginal?.idLocalLesao ?? 0;

        const pacienteId = pacienteOriginal?.idPaciente ?? 0;
        const notificadorId = notificadorOriginal?.idNotificador ?? 0;
        const lesaoId = isEditMode
          ? (lesaoOriginal?.idLesaoPressao ?? editNotificationId ?? 0)
          : 0;

        const dataAdmissao = String(
          form.dataAdmissao || pacienteOriginal?.dataAdmissao || new Date().toISOString().split('T')[0]
        );
        const dataPrimeiraAvaliacao = String(form.dataPrimeiraAvaliacao || lesaoOriginal?.dataPrimeiraAvaliacao || '');
        const dataFim = String(form.dataPrimeiraAvaliacao || lesaoOriginal?.dataFim || dataPrimeiraAvaliacao);
        const dataNotificacao = isEditMode && lesaoOriginal?.dataNotificacao
          ? lesaoOriginal.dataNotificacao
          : new Date().toISOString().split('T')[0];
        const horaNascimento = pacienteOriginal?.horaNascimento || "00:00:00";

        const payload: PayloadNotificacaoLesaoPressao = {
          dadosPaciente: {
            idPaciente: pacienteId,
            nome: pacienteNome,
            protuario: pacienteProntuario,
            leito: pacienteLeito,
            sexo: pacienteSexo,
            peso: Number(pacientePeso) || 0,
            dataNascimento: pacienteDataNascimento,
            horaNascimento,
            dataAdmissao,
          },
          dadosLesaoPressao: {
            idPaciente: pacienteId,
            idSetor: pacienteSetor ? Number(pacienteSetor) : (lesaoOriginal?.idSetor ?? 0),
            idTipoIncidente: 5,
            idNotificador: notificadorId,
            dataInicio: dataAdmissao,
            dataFim,
            descricao: String(form.descricaoIncidente || lesaoOriginal?.descricao || ''),
            dataNotificacao,
            classificacaoIncidente: String(form.classificacaoIncidente || lesaoOriginal?.classificacaoIncidente || ''),
            classificacaoDano: String(form.classificacaoDano || lesaoOriginal?.classificacaoDano || ''),
            idLesaoPressao: lesaoId || undefined,
            dataPrimeiraAvaliacao,
            classificacaoBraden: String(form.classificacaoRiscoBraden || lesaoOriginal?.classificacaoBraden || ''),
            escoreBraden: Number(form.totalEscores) || lesaoOriginal?.escoreBraden || 0,
            reavaliacao48Horas: String(form.reavaliacao48h || lesaoOriginal?.reavaliacao48Horas || ''),
            mobilidadePrejudicada: simNaoParaBoolean(form.mobilidadePrejudicada || (lesaoOriginal?.mobilidadePrejudicada ? 'Sim' : 'Não')),
            responsavelAvaliacao: String(form.avaliacaoPor || lesaoOriginal?.responsavelAvaliacao || ''),
            resgistroSAE,
            mudancaDecubito: simNaoParaBoolean(form.mudancaDecubito || (lesaoOriginal?.mudancaDecubito ? 'Sim' : 'Não')),
            intervaloMudanca: form.intervaloMudanca ? extrairNumero(form.intervaloMudanca) : (lesaoOriginal?.intervaloMudanca ?? 0),
            tempoInternacaoLesao: String(form.tempoInternacaoLesao || lesaoOriginal?.tempoInternacaoLesao || ''),
            idLocalLesao,
            descicaoOutro: lesaoOriginal?.descicaoOutro || "",
            estagioLesao: String(form.estagioLesao || lesaoOriginal?.estagioLesao || ''),
            superficeDinamicaApoio: simNaoParaBoolean(form.usoColchaoDinamico || (lesaoOriginal?.superficeDinamicaApoio ? 'Sim' : 'Não')),
            solicitacaoAvaliacaoNutri: simNaoParaBoolean(form.avaliacaoNutricionista || (lesaoOriginal?.solicitacaoAvaliacaoNutri ? 'Sim' : 'Não')),
            registroAvaliacaoNutri: simNaoParaBoolean(form.registroAvaliacaoNutricional || (lesaoOriginal?.registroAvaliacaoNutri ? 'Sim' : 'Não')),
            registroavaliacaoFisio: simNaoParaBoolean(form.registroAvaliacaoFisioterapia || (lesaoOriginal?.registroavaliacaoFisio ? 'Sim' : 'Não')),
            registroEnfermagem: simNaoParaBoolean(form.registroIncidenteEnfermagem || (lesaoOriginal?.registroEnfermagem ? 'Sim' : 'Não')),
            usoCoberturaAdequada: String(form.usoCoberturaAdequada || lesaoOriginal?.usoCoberturaAdequada || ''),
          },
          dadosNotificador: {
            idNotificador: notificadorId,
            nome: notificadorNome,
            email: notificadorEmail,
            telefone: notificadorTelefone,
            setor: notificadorSetor ? Number(notificadorSetor) : (notificadorOriginal?.setor ?? 0),
            categoria: notificadorCategoria,
            funcionarioGerenciaRisco: funcionarioGerenciaRisco,
          },
        };

        if (isEditMode && lesaoId > 0) {
          resultado = await putLesaoPressao(lesaoId, payload);
        } else {
          resultado = await criarNotificacaoLesaoPressao(payload);
        }

      } else if (modalidade === "queda") {
        const payload = {
          dadosQueda: {
            idadeMomentoValor: Number(form.idadeMomentoValor) || 0,
            idadeMomentoUnidade: String(form.idadeMomentoUnidade || ''),
            dataAdmissao: String(form.dataAdmissao || ''),
            diagnostico: String(form.diagnostico || ''),
            avaliacaoRiscoAdmissao: String(form.avaliacaoRiscoAdmissao || ''),
            registroOrientacao: String(form.registroOrientacao || ''),
            riscoQuedaIdentificado: String(form.riscoQuedaIdentificado || ''),
            fatoresPredisponentes: Array.isArray(form.fatoresPredisponentes) ? form.fatoresPredisponentes as string[] : [],
            usoMedicamentosSNC: String(form.usoMedicamentosSNC || ''),
            medicamentosSNC: Array.isArray(form.medicamentosSNC) ? form.medicamentosSNC as string[] : [],
            quantidadeMedicamentosBaixoRisco: Number(form.quantidadeMedicamentosBaixoRisco) || 0,
            quantidadeMedicamentosMedioRisco: Number(form.quantidadeMedicamentosMedioRisco) || 0,
            quantidadeMedicamentosAltoRisco: Number(form.quantidadeMedicamentosAltoRisco) || 0,
            acompanhante: String(form.acompanhante || ''),
            tipoQueda: String(form.tipoQueda || ''),
            localQueda: String(form.localQueda || ''),
            horarioQueda: String(form.horarioQueda || ''),
            turno: String(form.turno || ''),
            consequencias: String(form.consequencias || '')
          },
          dadosPaciente,
          dadosNotificador
        };
        resultado = await criarNotificacaoQueda(payload);

      } else if (modalidade === "flebite") {
        const normalizar = (texto: string) =>
          texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const tipoIncidenteFlebiteId = dadosDinamicos.tiposIncidente.find((tipo) =>
          normalizar(tipo.descricaoTipoIncidente || "").includes("fleb")
        )?.idTipoIncidente ?? 0;

        if (tipoIncidenteFlebiteId === 0 && dadosDinamicos.tiposIncidente.length > 0) {
          console.warn("Tipo de incidente para flebite não encontrado. Usando 0.");
        }

        const setorPacienteId = Number(pacienteSetor) || 0;
        const setorNotificadorId = Number(notificadorSetor) || setorPacienteId;
        const funcionarioGerenciaRisco = notificadorTipo === "Funcionário da gerência de risco";

  const tempoPermanenciaTexto = String(form.tempoPermanencia || "");
        const descricaoPartes: string[] = [];

        const registroAcesso = String(form.monitoramentoCateter_registroAcesso || "").trim();
        if (registroAcesso) descricaoPartes.push(`Registro do acesso: ${registroAcesso}`);

        const dataMonitoramento = String(form.monitoramentoCateter_data || "").trim();
        if (dataMonitoramento) descricaoPartes.push(`Monitoramento em: ${dataMonitoramento}`);

        if (tempoPermanenciaTexto.trim()) {
          descricaoPartes.push(`Tempo de permanência informado: ${tempoPermanenciaTexto.trim()}`);
        }

        const dataAdmissaoFlebite = toDateOnly(form.dataAdmissao) ?? new Date().toISOString().split('T')[0];
        const dataRetirada = toDateOnly(form.dataRetirada);
        const dataNotificacao = new Date().toISOString().split('T')[0];

        const medicamentos: MedicamentoFlebite[] = [];
        const nomeMedicamento = String(form.medicamentosAdministrados_medicamento || "").trim();
        if (nomeMedicamento) {
          const medicamento: MedicamentoFlebite = {
            idMedicamento: 0,
            nomeGenerico: nomeMedicamento,
          };

          const diluente = String(form.medicamentosAdministrados_diluente || "").trim();
          if (diluente) medicamento.diluente = diluente;

          const modoInfusao = String(form.medicamentosAdministrados_modoInfusao || "").trim();
          if (modoInfusao) medicamento.modoInfusao = modoInfusao;

          medicamentos.push(medicamento);
        }

        const payload: PayloadNotificacaoFlebite = {
          dadosPaciente: {
            idPaciente: 0,
            nome: pacienteNome,
            protuario: pacienteProntuario,
            leito: pacienteLeito,
            sexo: pacienteSexo,
            peso: parseDecimal(pacientePeso),
            dataNascimento: pacienteDataNascimento,
            horaNascimento: "00:00:00",
            dataAdmissao: dataAdmissaoFlebite,
          },
          dadosFlebite: {
            idPaciente: 0,
            idSetor: setorPacienteId,
            idTipoIncidente: tipoIncidenteFlebiteId,
            idNotificador: 0,
            dataInicio: dataAdmissaoFlebite,
            dataFim: dataRetirada ?? dataAdmissaoFlebite,
            descricao: descricaoPartes.join(" | ") || String(form.diagnostico || ""),
            dataNotificacao,
            classificacaoIncidente: "",
            classificacaoDano: "",
            idFlebite: 0,
            diagnostico: String(form.diagnostico || ""),
            grauFlebite: String(form.grauFlebite || ""),
            localPuncao: String(form.localPuncao || ""),
            qtdPuncoesAteIncidente: Number(form.numeroPuncoes) || 0,
            tipoCateter: String(form.tipoCateter || ""),
            calibreCateter: String(form.calibreCateter || ""),
            numCateteresInseridos: Number(form.numeroCateteresLumen) || 0,
            tempoPermanenciaAcesso: extrairNumero(tempoPermanenciaTexto),
            qtdMedVesicanteIrritante: simNaoParaBoolean(form.usoMedicamentosVesicantes) ? Math.max(medicamentos.length, 1) : 0,
            medicamentos,
          },
          dadosNotificador: {
            idNotificador: 0,
            nome: notificadorNome,
            email: notificadorEmail,
            telefone: notificadorTelefone,
            setor: setorNotificadorId,
            categoria: notificadorCategoria,
            funcionarioGerenciaRisco,
          },
          medicamentos,
        };

        resultado = await criarNotificacaoFlebite(payload);

      } else if (modalidade === "reacao-adversa") {
        const payload = {
          dadosReacaoAdversa: {
            idadeMomentoValor: Number(form.idadeMomentoValor) || 0,
            idadeMomentoUnidade: String(form.idadeMomentoUnidade || ''),
            descricaoIncidente: String(form.descricaoIncidente || ''),
            descricaoReacao: String(form.descricaoReacao || ''),
            reacao_dataInicio: String(form.reacao_dataInicio || ''),
            reacao_dataFim: String(form.reacao_dataFim || ''),
            reacao_duracao: String(form.reacao_duracao || ''),
            reacao_desfecho: String(form.reacao_desfecho || ''),
            med_nomeGenerico: String(form.med_nomeGenerico || ''),
            med_provavelCausador: String(form.med_provavelCausador || ''),
            med_fabricante: String(form.med_fabricante || ''),
            med_lote: String(form.med_lote || ''),
            med_posologia: String(form.med_posologia || ''),
            med_viaAdministracao: String(form.med_viaAdministracao || ''),
            med_dataInicio: String(form.med_dataInicio || ''),
            med_dataFim: String(form.med_dataFim || ''),
            med_duracao: String(form.med_duracao || ''),
            med_indicacao: String(form.med_indicacao || ''),
            med_acaoAdotada: String(form.med_acaoAdotada || '')
          },
          dadosPaciente,
          dadosNotificador
        };
        resultado = await criarNotificacaoReacaoAdversa(payload);

      } else if (modalidade === "erro-medicacao") {
        const payload = {
          dadosErroMedicacao: {
            idadeMomentoValor: Number(form.idadeMomentoValor) || 0,
            idadeMomentoUnidade: String(form.idadeMomentoUnidade || ''),
            descricaoIncidente: String(form.descricaoIncidente || ''),
            erro_dataInicio: String(form.erro_dataInicio || ''),
            erro_dataFim: String(form.erro_dataFim || ''),
            ocorrencia: String(form.ocorrencia || ''),
            descricaoErro: String(form.descricaoErro || ''),
            efeitoNocivo: String(form.efeitoNocivo || ''),
            descricaoEfeitos: String(form.descricaoEfeitos || ''),
            desfecho: String(form.desfecho || ''),
            causasErro: Array.isArray(form.causasErro) ? form.causasErro as string[] : [],
            localErro: String(form.localErro || ''),
            med_nomeGenerico: String(form.med_nomeGenerico || ''),
            med_posologia: String(form.med_posologia || ''),
            med_viaAdministracao: String(form.med_viaAdministracao || ''),
            med_dataInicio: String(form.med_dataInicio || ''),
            med_dataFim: String(form.med_dataFim || ''),
            med_indicacao: String(form.med_indicacao || ''),
            med_lote: String(form.med_lote || ''),
            med_validade: String(form.med_validade || '')
          },
          dadosPaciente,
          dadosNotificador
        };
        resultado = await criarNotificacaoErroMedicacao(payload);

      } else {
        // Para modalidades ainda não implementadas
        const dadosCompletos = {
          modalidade,
          dadosFormulario: form,
          dadosPaciente,
          dadosNotificador,
        };
        
        console.log({ 
          action: "create", 
          modalidade, 
          data: dadosCompletos 
        });

        toast.success("Formulário salvo com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => navigate(-1), 1500);
        return;
      }

      if (resultado?.success) {
        toast.success(
          resultado.message || (isEditMode ? "Notificação atualizada com sucesso!" : "Notificação criada com sucesso!"),
          {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        console.log('Notificação processada com sucesso:', resultado);
        if (isEditMode) {
          localStorage.removeItem("editNotificationData");
        }
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error(resultado?.message || (isEditMode ? "Erro ao atualizar notificação" : "Erro ao processar notificação"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.error('Erro da API:', resultado);
      }

    } catch (error) {
      console.error('Erro ao processar notificação:', error);
      toast.error("Erro inesperado ao processar notificação. Tente novamente.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const isSelected = (id: string, value: string) => Array.isArray(form[id]) && form[id].includes(value);
  const toggleMulti = (id: string, value: string) => {
    setForm((prev) => {
      const arr: string[] = Array.isArray(prev[id]) ? prev[id] : [];
      return { ...prev, [id]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const shouldRenderChild = (parentId: string, cond: string) => Array.isArray(form[parentId]) && form[parentId].includes(cond);

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
    const spaced = s
      .replace(/[-_]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  // ==================== LÓGICA DE EXIBIÇÃO CONDICIONAL ====================
  const showField = (f: Field): boolean => {
    // Campo de medicamentos SNC só aparece se "Sim" for selecionado
    if (f.id === "medicamentosSNC") {
      return form["usoMedicamentosSNC"] === "Sim";
    }
    // Descrição de efeitos só aparece se houve efeito nocivo
    if (f.id === "descricaoEfeitos") {
      return form["efeitoNocivo"] === "Sim";
    }
    return true;
  };

  // Campos do formulário de incidente (vêm do schema)
  const incidentFields = schema.fields;

  // ==================== FUNÇÕES PARA DADOS DINÂMICOS ====================
  const isDynamicField = (fieldId: string): boolean => {
    const dynamicFields = [
      'tipoQueda', 
      'localQueda', 
      'fatoresPredisponentes', 
      'medicamentosSNC',
      'localLesao',
      'localErro' // Setor onde ocorreu o erro
    ];
    return dynamicFields.includes(fieldId);
  };

  const getFieldDynamicData = (fieldId: string): Array<{ id: string; label: string }> => {
    if (dadosDinamicos.carregando) return [];
    
    switch (fieldId) {
      case 'tipoQueda':
        return dadosDinamicos.tiposQueda.map(t => ({
          id: String(t.idTipoQueda),
          label: t.descricaoTipo
        }));
      
      case 'localQueda':
        return dadosDinamicos.locaisQueda.map(l => ({
          id: String(l.idLocalQueda),
          label: l.descricaoLocal
        }));
      
      case 'fatoresPredisponentes':
        return dadosDinamicos.fatoresRiscoQueda.map(f => ({
          id: String(f.idFatorRiscoQueda),
          label: f.descricaoFator
        }));
      
      case 'medicamentosSNC':
        return dadosDinamicos.categoriasMedicamentoQueda.map(c => ({
          id: String(c.idCategoriaMedicamentoQueda),
          label: c.descricaoCatMedQueda
        }));
      
      case 'localLesao':
        return dadosDinamicos.locaisLesao.map(l => ({
          id: String(l.idLocalLesao),
          label: l.descricaoLocal
        }));
      
      case 'localErro':
        return dadosDinamicos.setores.map(s => ({
          id: String(s.idSetor),
          label: s.descricaoSetor
        }));
      
      default:
        return [];
    }
  };

  // ==================== AGRUPAMENTO DE CAMPOS ====================
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

  // ==================== RENDERIZAÇÃO DOS CAMPOS DO FORMULÁRIO ====================
  const incidentFieldElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    const inserted = new Set<string>();
    
    for (const f of incidentFields) {
      // Pula campos que não devem ser exibidos
      if (!showField(f)) continue;
      
      // Adiciona cabeçalho de grupo se configurado
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
      
      // Renderiza o campo baseado em seu tipo
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
            <Select value={valAsStr(f.id)} onValueChange={(v) => set(f.id, v)} disabled={((f.id === "desfecho" || f.id === "reacao_desfecho") && desfechos.length === 0) || (getFieldDynamicData(f.id).length === 0 && isDynamicField(f.id))}>
              <SelectTrigger>
                <SelectValue placeholder={
                  ((f.id === "desfecho" || f.id === "reacao_desfecho") && desfechos.length === 0) || 
                  (getFieldDynamicData(f.id).length === 0 && isDynamicField(f.id))
                    ? "Carregando..."
                    : "Selecione"
                } />
              </SelectTrigger>
              <SelectContent>
                {/* Campos de desfecho usam dados dinâmicos da API */}
                {(f.id === "desfecho" || f.id === "reacao_desfecho") ? (
                  desfechos.map((desfecho) => (
                    <SelectItem key={desfecho.idDesfecho} value={String(desfecho.idDesfecho)}>
                      {desfecho.descricaoDesfecho}
                    </SelectItem>
                  ))
                ) : isDynamicField(f.id) ? (
                  getFieldDynamicData(f.id).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  (f as SelectField).options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {prettyLabel(opt)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
          {f.type === "multiselect" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {(isDynamicField(f.id) ? getFieldDynamicData(f.id) : (f as MultiselectField).options.map(opt => ({ id: opt, label: opt }))).map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-accent/40">
                  <Checkbox checked={isSelected(f.id, opt.id)} onCheckedChange={() => toggleMulti(f.id, opt.id)} />
                  <span className="text-sm">{prettyLabel(opt.label)}</span>
                </label>
              ))}
            </div>
          )}
          {/* Campos condicionais dentro de multiselect */}
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
  }, [incidentFields, form, modalidade, groupConfig, desfechos, dadosDinamicos]);

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <Card>
          <CardHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
            <CardTitle className="text-xl md:text-2xl">
              {schema.title}
            </CardTitle>
            <CardDescription>
              Preencha os dados da notificação
            </CardDescription>
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
                  <Select value={pacienteSetor} onValueChange={setPacienteSetor} disabled={dadosDinamicos.carregando || dadosDinamicos.setores.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder={dadosDinamicos.carregando ? "Carregando setores..." : "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      {dadosDinamicos.setores.map((s) => (
                        <SelectItem key={s.idSetor} value={String(s.idSetor)}>
                          {s.descricaoSetor}
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
                <div className="md:col-span-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Dados do notificador</h3>
                    <p className="text-sm text-muted-foreground">Informe seus dados (todos opcionais, exceto o vínculo com a gerência de risco)</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={carregarUltimosDados}
                    className="shrink-0"
                  >
                    Últimos dados
                  </Button>
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
                  <Select value={notificadorSetor} onValueChange={setNotificadorSetor} disabled={dadosDinamicos.carregando || dadosDinamicos.setores.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder={dadosDinamicos.carregando ? "Carregando setores..." : "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      {dadosDinamicos.setores.map((s) => (
                        <SelectItem key={s.idSetor} value={String(s.idSetor)}>
                          {s.descricaoSetor}
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
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default ModalidadeForm;
