import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Pill, 
  Stethoscope, 
  Droplets, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";
import { CreateNotificationDialog } from "@/components/notifications/CreateNotificationDialog";
import { NotifierDialog } from "@/components/notifier/NotifierDialog";
import { Notifier } from "@/components/notifier/NotifierForm";
import { NotificationRecord } from "@/components/notifications/NotificationModule";
import { 
  NotificationsByTypeChart, 
  TrendsChart, 
  SeverityAnalysisChart,
  HeatmapChart,
  GaugeChart,
  TimelineChart
} from "@/components/charts";

const dashboardStats = [
  {
    title: "Total de Notificações",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Activity,
    description: "Últimos 30 dias"
  },
  {
    title: "Farmacovigilância",
    value: "1,243",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Pill,
    description: "Reações adversas"
  },
  {
    title: "Tecnovigilância",
    value: "485",
    change: "-3.1%",
    changeType: "negative" as const,
    icon: Stethoscope,
    description: "Eventos técnicos"
  },
  {
    title: "Hemovigilância",
    value: "156",
    change: "+5.7%",
    changeType: "positive" as const,
    icon: Droplets,
    description: "Eventos hemotransfusionais"
  }
];

const recentNotifications = [
  {
    id: 1,
    type: "Farmacovigilância",
    description: "Reação adversa a Dipirona - Paciente 12345",
    time: "2 min atrás",
    severity: "high",
    status: "pending"
  },
  {
    id: 2,
    type: "Tecnovigilância",
    description: "Falha em bomba de infusão - UTI Setor A",
    time: "15 min atrás",
    severity: "medium",
    status: "investigating"
  },
  {
    id: 3,
    type: "Processo de Cuidado",
    description: "Queda de paciente - Enfermaria 3º andar",
    time: "32 min atrás",
    severity: "high",
    status: "resolved"
  },
  {
    id: 4,
    type: "Hemovigilância",
    description: "Reação transfusional leve - Centro Cirúrgico",
    time: "1 hora atrás",
    severity: "low",
    status: "pending"
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive' as const;
    case 'medium':
      return 'secondary' as const;
    case 'low':
      return 'secondary' as const;
    default:
      return 'secondary' as const;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'resolved':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'investigating':
      return <Clock className="w-4 h-4 text-warning" />;
    case 'pending':
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

export function AdminDashboard() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openNotifier, setOpenNotifier] = useState(false);
  const [createTipo, setCreateTipo] = useState<string>("Farmacovigilância");
  const [pendingCreate, setPendingCreate] = useState(false);

  const getSavedNotifier = (): Notifier | null => {
    try {
      const raw = localStorage.getItem("notifier");
      return raw ? (JSON.parse(raw) as Notifier) : null;
    } catch {
      return null;
    }
  };

  const openCreateWithTipo = (tipo: string) => {
    const hasNotifier = !!getSavedNotifier();
    if (!hasNotifier) {
      setPendingCreate(true);
      setCreateTipo(tipo);
      setOpenNotifier(true);
      return;
    }
    setCreateTipo(tipo);
    setOpenCreate(true);
  };
  const handleCreate = (rec: NotificationRecord) => {
    console.log("created", rec);
  };
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de vigilância sanitária
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span
                  className={`inline-flex items-center ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                  }`}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Trends Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tendência de Notificações</CardTitle>
            <CardDescription>
              Volume de notificações por módulo nos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendsChart />
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notificações Recentes</CardTitle>
            <CardDescription>
              Últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(notification.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={getSeverityColor(notification.severity)}
                        className="text-xs"
                      >
                        {notification.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Section */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Distribution by Type */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Proporção de notificações por modalidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationsByTypeChart />
          </CardContent>
        </Card>

        {/* Severity Analysis */}
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Análise de Gravidade</CardTitle>
            <CardDescription>
              Distribuição de casos por nível de gravidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeverityAnalysisChart />
          </CardContent>
        </Card>

        {/* Performance Gauge */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Índice de resolução de casos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GaugeChart 
              value={78} 
              title="Resolução" 
              unit="%" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Heatmap and Timeline Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Calor</CardTitle>
            <CardDescription>
              Distribuição de notificações por setor e horário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Casos</CardTitle>
            <CardDescription>
              Acompanhamento de casos em investigação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimelineChart />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso direto aos módulos mais utilizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => { openCreateWithTipo("Farmacovigilância"); }}>
              <Activity className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Nova Notificação</h3>
              <p className="text-xs text-muted-foreground">Criar registro rápido</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => setOpenNotifier(true)}>
              <Users className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Notificador</h3>
              <p className="text-xs text-muted-foreground">Identificar notificador</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => { openCreateWithTipo("Farmacovigilância"); }}>
              <Pill className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Farmacovigilância</h3>
              <p className="text-xs text-muted-foreground">Nova reação adversa</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => { openCreateWithTipo("Tecnovigilância"); }}>
              <Stethoscope className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Tecnovigilância</h3>
              <p className="text-xs text-muted-foreground">Evento técnico</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => { openCreateWithTipo("Erros de Medicação"); }}>
              <AlertTriangle className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Processo Cuidado</h3>
              <p className="text-xs text-muted-foreground">Evento assistencial</p>
            </div>
          </div>
        </CardContent>
      </Card>
  <CreateNotificationDialog open={openCreate} onOpenChange={setOpenCreate} onSubmit={handleCreate} allowChooseTipo defaultTipo={createTipo} />
  <NotifierDialog 
    open={openNotifier}
    onOpenChange={(v) => {
      setOpenNotifier(v);
      if (!v && pendingCreate) {
        const hasNotifier = !!getSavedNotifier();
        if (hasNotifier) {
          setOpenCreate(true);
        }
        setPendingCreate(false);
      }
    }}
  />
    </div>
  );
}