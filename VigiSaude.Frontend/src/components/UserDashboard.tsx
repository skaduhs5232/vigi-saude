import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Pill, 
  Stethoscope, 
  Droplets, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Bell,
  Activity
} from "lucide-react";

const quickActions = [
  {
    title: "Nova Notificação",
    description: "Registrar nova ocorrência",
    icon: Plus,
    color: "primary",
    action: "create"
  },
  {
    title: "Identificar Notificador",
    description: "Cadastrar dados do profissional",
    icon: Users,
    color: "secondary",
    route: "/notificador"
  },
  {
    title: "Farmacovigilância",
    description: "Reação adversa a medicamento",
    icon: Pill,
    color: "secondary",
    route: "/farmacovigilancia"
  },
  {
    title: "Tecnovigilância",
    description: "Problema com equipamento",
    icon: Stethoscope,
    color: "secondary",
    route: "/tecnovigilancia"
  }
];

const recentNotifications = [
  {
    id: 1,
    type: "Farmacovigilância",
    description: "Reação adversa registrada com sucesso",
    time: "Hoje às 14:30",
    status: "completed",
    priority: "medium"
  },
  {
    id: 2,
    type: "Tecnovigilância",
    description: "Falha em equipamento reportada",
    time: "Hoje às 12:15",
    status: "pending",
    priority: "high"
  },
  {
    id: 3,
    type: "Hemovigilância",
    description: "Evento transfusional documentado",
    time: "Ontem às 16:45",
    status: "investigating",
    priority: "low"
  },
  {
    id: 4,
    type: "Processo de Cuidado",
    description: "Protocolo de flebite registrado",
    time: "Ontem às 09:20",
    status: "completed",
    priority: "medium"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
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
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'investigating':
      return <Clock className="w-4 h-4 text-warning" />;
    case 'pending':
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

export function UserDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel do Usuário</h2>
          <p className="text-muted-foreground">
            Acesso rápido para registros e notificações
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Registre rapidamente suas notificações de vigilância
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group p-6 border rounded-lg hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card hover:bg-accent/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.color === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  {action.color === 'primary' && (
                    <Badge variant="default" className="text-xs">Novo</Badge>
                  )}
                </div>
                <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Suas últimas notificações e registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent/20 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(notification.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant={getPriorityColor(notification.priority)}
                        className="text-xs"
                      >
                        {notification.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Status Atual</CardTitle>
            <CardDescription>
              Resumo das suas atividades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">Concluídas</p>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </div>
              <span className="text-lg font-bold text-success">12</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">Em análise</p>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </div>
              <span className="text-lg font-bold text-warning">3</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">Pendentes</p>
                <p className="text-xs text-muted-foreground">Requer ação</p>
              </div>
              <span className="text-lg font-bold text-destructive">1</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Precisa de Ajuda?</CardTitle>
          <CardDescription>
            Recursos úteis para navegação no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span className="font-medium">Guia do Usuário</span>
              <span className="text-xs text-muted-foreground">Como usar o sistema</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Activity className="w-6 h-6 mb-2" />
              <span className="font-medium">Tipos de Notificação</span>
              <span className="text-xs text-muted-foreground">Saiba quando notificar</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Bell className="w-6 h-6 mb-2" />
              <span className="font-medium">Suporte</span>
              <span className="text-xs text-muted-foreground">Entre em contato</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}