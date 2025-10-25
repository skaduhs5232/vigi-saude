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
  categoriaProfOptions,
  sexoOptions,
  schemas,
  ModalidadeSchema,
  Field,
  NumberField,
  MultiselectField,
  SelectField,
  RadioField,
  DesfechoOption,
  EditModePayload,
} from "./schemas/modalidade-schemas";
import {
  DadosPacienteSection,
  DadosNotificadorSection,
  PacienteValues,
  NotificadorValues,
} from "./sections/form-sections";
import {
  criarNotificacaoLesaoPressao,
  putLesaoPressao,
  PayloadNotificacaoLesaoPressao,
} from "./services/lesao-pressao.service";
import { criarNotificacaoQueda } from "./services/queda.service";
import { criarNotificacaoFlebite, PayloadNotificacaoFlebite, MedicamentoFlebite } from "./services/flebite.service";
import { criarNotificacaoReacaoAdversa, obterDesfechos as obterDesfechosReacao } from "./services/reacao-adversa.service";
import { criarNotificacaoErroMedicacao, obterDesfechos as obterDesfechosErro } from "./services/erro-medicacao.service";
import { DadosPaciente, DadosNotificador } from "./interfaces/padroes";
import { useDadosDinamicos } from "./hooks/useDadosDinamicos";

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
  
  const [desfechos, setDesfechos] = useState<DesfechoOption[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState<number | null>(null);
  const [originalLesaoPayload, setOriginalLesaoPayload] = useState<PayloadNotificacaoLesaoPressao | null>(null);

  const pacienteValues = useMemo<PacienteValues>(() => ({
    nome: pacienteNome,
    prontuario: pacienteProntuario,
    setor: pacienteSetor,
    leito: pacienteLeito,
    sexo: pacienteSexo,
    peso: pacientePeso,
    dataNascimento: pacienteDataNascimento,
  }), [
    pacienteNome,
    pacienteProntuario,
    pacienteSetor,
    pacienteLeito,
    pacienteSexo,
    pacientePeso,
    pacienteDataNascimento,
  ]);

  const notificadorValues = useMemo<NotificadorValues>(() => ({
    nome: notificadorNome,
    email: notificadorEmail,
    telefone: notificadorTelefone,
    tipo: notificadorTipo,
    setor: notificadorSetor,
    categoria: notificadorCategoria,
  }), [
    notificadorNome,
    notificadorEmail,
    notificadorTelefone,
    notificadorTipo,
    notificadorSetor,
    notificadorCategoria,
  ]);

  const handlePacienteChange = (field: keyof PacienteValues, value: string) => {
    switch (field) {
      case "nome":
        setPacienteNome(value);
        break;
      case "prontuario":
        setPacienteProntuario(value);
        break;
      case "setor":
        setPacienteSetor(value);
        break;
      case "leito":
        setPacienteLeito(value);
        break;
      case "sexo":
        setPacienteSexo(value);
        break;
      case "peso":
        setPacientePeso(value);
        break;
      case "dataNascimento":
        setPacienteDataNascimento(value);
        break;
      default:
        break;
    }
  };

  const handleNotificadorChange = (field: keyof NotificadorValues, value: string) => {
    switch (field) {
      case "nome":
        setNotificadorNome(value);
        break;
      case "email":
        setNotificadorEmail(value);
        break;
      case "telefone":
        setNotificadorTelefone(value);
        break;
      case "tipo":
        setNotificadorTipo(value);
        break;
      case "setor":
        setNotificadorSetor(value);
        break;
      case "categoria":
        setNotificadorCategoria(value);
        break;
      default:
        break;
    }
  };

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
    const notificadorData = { ...notificadorValues };

    const hasData = Object.values(notificadorData).some((value) => value.trim() !== "");
    if (hasData) {
      localStorage.setItem("lastNotificadorData", JSON.stringify(notificadorData));
    }
  }, [notificadorValues]);

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

  const parsed = JSON.parse(raw) as EditModePayload | null;
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
  if (dadosPaciente.nome !== undefined) setPacienteNome(String(dadosPaciente.nome || ""));
  if (dadosPaciente.prontuario !== undefined) setPacienteProntuario(String(dadosPaciente.prontuario || ""));
  if (dadosPaciente.setor !== undefined) setPacienteSetor(String(dadosPaciente.setor || ""));
  if (dadosPaciente.leito !== undefined) setPacienteLeito(String(dadosPaciente.leito || ""));
  if (dadosPaciente.sexo !== undefined) setPacienteSexo(String(dadosPaciente.sexo || ""));
  if (dadosPaciente.peso !== undefined) setPacientePeso(String(dadosPaciente.peso || ""));
  if (dadosPaciente.dataNascimento !== undefined) setPacienteDataNascimento(String(dadosPaciente.dataNascimento || ""));

        const dadosNotificador = parsed.dadosNotificador || {};
  if (dadosNotificador.nome !== undefined) setNotificadorNome(String(dadosNotificador.nome || ""));
  if (dadosNotificador.email !== undefined) setNotificadorEmail(String(dadosNotificador.email || ""));
  if (dadosNotificador.telefone !== undefined) setNotificadorTelefone(String(dadosNotificador.telefone || ""));
  if (dadosNotificador.tipo !== undefined) setNotificadorTipo(String(dadosNotificador.tipo || ""));
  if (dadosNotificador.setor !== undefined) setNotificadorSetor(String(dadosNotificador.setor || ""));
  if (dadosNotificador.categoria !== undefined) setNotificadorCategoria(String(dadosNotificador.categoria || ""));
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
      nome: pacienteValues.nome,
      prontuario: pacienteValues.prontuario,
      setor: pacienteValues.setor,
      leito: pacienteValues.leito,
      sexo: pacienteValues.sexo,
      peso: pacienteValues.peso,
      dataNascimento: pacienteValues.dataNascimento,
    };

    const dadosNotificador: DadosNotificador = {
      nome: notificadorValues.nome,
      email: notificadorValues.email,
      telefone: notificadorValues.telefone,
      tipo: notificadorValues.tipo,
      setor: notificadorValues.setor,
      categoria: notificadorValues.categoria,
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
              <DadosPacienteSection
                values={pacienteValues}
                onChange={handlePacienteChange}
                errors={errors}
                setores={dadosDinamicos.setores}
                setoresCarregando={dadosDinamicos.carregando}
                sexoOptions={sexoOptions}
              />

              {/* Seção: Dados do Incidente */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold">Dados do incidente</h3>
                  <p className="text-sm text-muted-foreground">Detalhes do evento</p>
                </div>
                {incidentFieldElements}
              </div>

              {/* Seção: Dados do Notificador */}
              <DadosNotificadorSection
                values={notificadorValues}
                onChange={handleNotificadorChange}
                errors={errors}
                setores={dadosDinamicos.setores}
                setoresCarregando={dadosDinamicos.carregando}
                categoriaProfOptions={categoriaProfOptions}
                onCarregarUltimosDados={carregarUltimosDados}
              />
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
