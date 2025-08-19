import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        {/* Chart Placeholder */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tendência de Notificações</CardTitle>
            <CardDescription>
              Volume de notificações por módulo nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Gráfico de tendências seria exibido aqui</p>
                <p className="text-xs">Integração com biblioteca de gráficos</p>
              </div>
            </div>
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
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <Users className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Notificador</h3>
              <p className="text-xs text-muted-foreground">Identificar notificador</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <Pill className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Farmacovigilância</h3>
              <p className="text-xs text-muted-foreground">Nova reação adversa</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <Stethoscope className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Tecnovigilância</h3>
              <p className="text-xs text-muted-foreground">Evento técnico</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <AlertTriangle className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-medium">Processo Cuidado</h3>
              <p className="text-xs text-muted-foreground">Evento assistencial</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}