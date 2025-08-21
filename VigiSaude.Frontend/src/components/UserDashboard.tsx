import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { CreateNotificationDialog } from "@/components/notifications/CreateNotificationDialog";
import { NotifierDialog } from "@/components/notifier/NotifierDialog";
import { NotificationRecord } from "@/components/notifications/NotificationModule";
import { Notifier } from "@/components/notifier/NotifierForm";
import NotificationCenter, { NotificationItem } from "@/components/notifications/NotificationCenter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type QuickAction =
  | { title: string; description: string; icon: LucideIcon; color: "primary" | "secondary"; action: "create" }
  | { title: string; description: string; icon: LucideIcon; color: "primary" | "secondary"; action: "notifier" }
  | { title: string; description: string; icon: LucideIcon; color: "primary" | "secondary"; action: "create-type"; tipo: string };

const quickActions: QuickAction[] = [
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
    action: "notifier"
  },
  {
    title: "Farmacovigilância",
    description: "Reação adversa a medicamento",
    icon: Pill,
    color: "secondary",
    action: "create-type",
    tipo: "Farmacovigilância"
  },
  {
    title: "Tecnovigilância",
    description: "Problema com equipamento",
    icon: Stethoscope,
    color: "secondary",
    action: "create-type",
    tipo: "Tecnovigilância"
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
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [openNotifier, setOpenNotifier] = useState(false);
  const [createTipo, setCreateTipo] = useState<string>("Farmacovigilância");
  const [pendingCreate, setPendingCreate] = useState(false);
  const [openCenter, setOpenCenter] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [openTypes, setOpenTypes] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

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
    // Aqui poderíamos enviar para API; por hora, apenas feedback
    console.log("created", rec);
  };
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
          <Button variant="outline" size="sm" onClick={() => setOpenCenter(true)}>
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
                onClick={() => {
                  switch (action.action) {
                    case 'create':
                      openCreateWithTipo("Farmacovigilância");
                      break;
                    case 'create-type':
                      openCreateWithTipo(action.tipo);
                      break;
                    case 'notifier':
                      setOpenNotifier(true);
                      break;
                  }
                }}
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
      <NotificationCenter
        open={openCenter}
        onOpenChange={setOpenCenter}
        items={recentNotifications as unknown as NotificationItem[]}
      />

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
            <Button variant="outline" className="h-auto py-4 flex-col hover:border-primary/60 hover:bg-accent/30" onClick={() => setOpenGuide(true)}>
              <Users className="w-6 h-6 mb-2" />
              <span className="font-medium">Guia do Usuário</span>
              <span className="text-xs text-muted-foreground">Como usar o sistema</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col hover:border-primary/60 hover:bg-accent/30" onClick={() => setOpenTypes(true)}>
              <Activity className="w-6 h-6 mb-2" />
              <span className="font-medium">Tipos de Notificação</span>
              <span className="text-xs text-muted-foreground">Saiba quando notificar</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col hover:border-primary/60 hover:bg-accent/30" onClick={() => setOpenSupport(true)}>
              <Bell className="w-6 h-6 mb-2" />
              <span className="font-medium">Suporte</span>
              <span className="text-xs text-muted-foreground">Entre em contato</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Dialog: Guia do Usuário */}
      <Dialog open={openGuide} onOpenChange={setOpenGuide}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Guia do Usuário</DialogTitle>
            <DialogDescription>Passos rápidos para usar o VigiSaúde</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <p className="font-medium">1. Cadastre o Notificador</p>
              <p className="text-muted-foreground">Acesse “Identificar Notificador” no painel ou no menu lateral.</p>
            </div>
            <div>
              <p className="font-medium">2. Crie sua Notificação</p>
              <p className="text-muted-foreground">Abra “Nova Notificação” pelo painel ou dentro do módulo correspondente.</p>
            </div>
            <div>
              <p className="font-medium">3. Acompanhe pelo Centro de Notificações</p>
              <p className="text-muted-foreground">Clique no sino do topo para ver pendências e status.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Tipos de Notificação */}
      <Dialog open={openTypes} onOpenChange={setOpenTypes}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tipos de Notificação</DialogTitle>
            <DialogDescription>Quando e onde notificar</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border bg-card">
              <p className="font-medium">Farmacovigilância</p>
              <p className="text-muted-foreground">Reações adversas a medicamentos.</p>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <p className="font-medium">Tecnovigilância</p>
              <p className="text-muted-foreground">Falhas/dispositivos e tecnologias em saúde.</p>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <p className="font-medium">Hemovigilância</p>
              <p className="text-muted-foreground">Eventos hemotransfusionais.</p>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <p className="font-medium">Processo de Cuidado</p>
              <p className="text-muted-foreground">Queda, flebite, LPP, úlcera de córnea, etc.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Suporte */}
      <Dialog open={openSupport} onOpenChange={setOpenSupport}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Suporte</DialogTitle>
            <DialogDescription>Entre em contato com nossa equipe</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <span>Email</span>
              <a className="text-primary hover:underline" href="mailto:suporte@vigisaude.local">suporte@vigisaude.local</a>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <span>Telefone</span>
              <a className="text-primary hover:underline" href="tel:+55000000000">(00) 0000-0000</a>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <span>Central de Ajuda</span>
              <a className="text-primary hover:underline" href="#">Abrir artigos</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}