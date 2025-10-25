import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  FileText,
  Activity,
  LogOut
} from "lucide-react";

// Dados mockados para os gráficos
const incidentesUltimoMes = [
  { mes: "Jan", flebite: 12, queda: 8, lesaoPressao: 15, reacaoAdversa: 6, erroMedicacao: 9 },
  { mes: "Fev", flebite: 19, queda: 12, lesaoPressao: 18, reacaoAdversa: 8, erroMedicacao: 7 },
  { mes: "Mar", flebite: 15, queda: 10, lesaoPressao: 12, reacaoAdversa: 11, erroMedicacao: 13 },
  { mes: "Abr", flebite: 22, queda: 15, lesaoPressao: 20, reacaoAdversa: 9, erroMedicacao: 11 },
  { mes: "Mai", flebite: 18, queda: 9, lesaoPressao: 16, reacaoAdversa: 14, erroMedicacao: 8 },
  { mes: "Jun", flebite: 25, queda: 18, lesaoPressao: 22, reacaoAdversa: 12, erroMedicacao: 15 },
];

const tendenciaIncidentes = [
  { dia: "1", total: 45 },
  { dia: "2", total: 52 },
  { dia: "3", total: 48 },
  { dia: "4", total: 61 },
  { dia: "5", total: 55 },
  { dia: "6", total: 67 },
  { dia: "7", total: 59 },
  { dia: "8", total: 72 },
  { dia: "9", total: 65 },
  { dia: "10", total: 78 },
  { dia: "11", total: 71 },
  { dia: "12", total: 85 },
  { dia: "13", total: 79 },
  { dia: "14", total: 92 },
  { dia: "15", total: 88 },
];

const distribuicaoTipos = [
  { name: "Flebite", value: 111, color: "#8884d8" },
  { name: "Queda", value: 89, color: "#82ca9d" },
  { name: "Lesão por pressão", value: 103, color: "#ffc658" },
  { name: "Reação adversa", value: 60, color: "#ff7c7c" },
  { name: "Erro de medicação", value: 63, color: "#8dd1e1" },
];

const setoresAfetados = [
  { setor: "UTI", incidentes: 85, fill: "#8884d8" },
  { setor: "Emergência", incidentes: 72, fill: "#82ca9d" },
  { setor: "Clínica Médica", incidentes: 68, fill: "#ffc658" },
  { setor: "Clínica Cirúrgica", incidentes: 45, fill: "#ff7c7c" },
  { setor: "Pediatria", incidentes: 32, fill: "#8dd1e1" },
  { setor: "Centro Cirúrgico", incidentes: 28, fill: "#d084d0" },
];

const statusResolucao = [
  { status: "Resolvido", quantidade: 245, percentage: 68 },
  { status: "Em andamento", quantidade: 87, percentage: 24 },
  { status: "Pendente", quantidade: 29, percentage: 8 },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const totalIncidentes = distribuicaoTipos.reduce((sum, item) => sum + item.value, 0);
  const incidentesResolvidos = statusResolucao.find(s => s.status === "Resolvido")?.quantidade || 0;
  const taxaResolucao = Math.round((incidentesResolvidos / totalIncidentes) * 100);

  const handleChangeProfile = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <HealthWatchSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Dashboard Administrativo</h1>
            <span className="text-sm text-muted-foreground">- Visão geral dos indicadores</span>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={handleChangeProfile}>
              <LogOut className="mr-2 h-4 w-4" />
              Trocar Perfil
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral dos indicadores de segurança do paciente
          </p>
        </div>

        {/* Cards de métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Incidentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidentes}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxaResolucao}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidentes Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio Resolução</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 dias</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -0.3 dias desde o mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principais */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Gráfico de barras - Incidentes por mês */}
          <Card>
            <CardHeader>
              <CardTitle>Incidentes por Mês e Tipo</CardTitle>
              <CardDescription>
                Distribuição dos tipos de incidentes nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentesUltimoMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="flebite" stackId="a" fill="#8884d8" name="Flebite" />
                  <Bar dataKey="queda" stackId="a" fill="#82ca9d" name="Queda" />
                  <Bar dataKey="lesaoPressao" stackId="a" fill="#ffc658" name="Lesão por pressão" />
                  <Bar dataKey="reacaoAdversa" stackId="a" fill="#ff7c7c" name="Reação adversa" />
                  <Bar dataKey="erroMedicacao" stackId="a" fill="#8dd1e1" name="Erro de medicação" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de linha - Tendência */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Incidentes</CardTitle>
              <CardDescription>
                Total de incidentes reportados nos últimos 15 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={tendenciaIncidentes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos secundários */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Gráfico de pizza - Distribuição por tipo */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
              <CardDescription>
                Proporção dos tipos de incidentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={distribuicaoTipos}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distribuicaoTipos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico radial - Setores afetados */}
          <Card>
            <CardHeader>
              <CardTitle>Setores Afetados</CardTitle>
              <CardDescription>
                Incidentes por setor hospitalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  data={setoresAfetados}
                >
                  <RadialBar dataKey="incidentes" cornerRadius={3} />
                  <Tooltip />
                  <Legend />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status de resolução */}
          <Card>
            <CardHeader>
              <CardTitle>Status de Resolução</CardTitle>
              <CardDescription>
                Estado atual dos incidentes reportados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statusResolucao.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        status.status === "Resolvido" ? "bg-green-500" :
                        status.status === "Em andamento" ? "bg-yellow-500" : "bg-red-500"
                      }`} 
                    />
                    <span className="text-sm font-medium">{status.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{status.quantidade}</Badge>
                    <span className="text-xs text-muted-foreground">{status.percentage}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de resumo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Modalidade</CardTitle>
            <CardDescription>
              Detalhamento dos incidentes por tipo nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Modalidade</th>
                    <th className="text-right py-2">Total</th>
                    <th className="text-right py-2">Resolvidos</th>
                    <th className="text-right py-2">Pendentes</th>
                    <th className="text-right py-2">Taxa Resolução</th>
                    <th className="text-right py-2">Tempo Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {distribuicaoTipos.map((tipo) => {
                    const resolvidos = Math.floor(tipo.value * 0.68);
                    const pendentes = tipo.value - resolvidos;
                    const taxa = Math.round((resolvidos / tipo.value) * 100);
                    const tempo = (Math.random() * 3 + 1).toFixed(1);
                    
                    return (
                      <tr key={tipo.name} className="border-b hover:bg-accent/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: tipo.color }}
                            />
                            {tipo.name}
                          </div>
                        </td>
                        <td className="text-right py-3 font-medium">{tipo.value}</td>
                        <td className="text-right py-3 text-green-600">{resolvidos}</td>
                        <td className="text-right py-3 text-amber-600">{pendentes}</td>
                        <td className="text-right py-3">
                          <Badge variant={taxa >= 70 ? "default" : "secondary"}>
                            {taxa}%
                          </Badge>
                        </td>
                        <td className="text-right py-3 text-muted-foreground">{tempo} dias</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
          </div>
        </main>
      </div>
    </div>
  );
}