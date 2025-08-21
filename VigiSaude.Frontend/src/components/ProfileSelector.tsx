import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, User, ShieldCheck } from "lucide-react";

interface ProfileSelectorProps {
  onSelectProfile: (profile: 'admin' | 'user') => void;
}

export function ProfileSelector({ onSelectProfile }: ProfileSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">HealthWatch</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema de Vigilância Sanitária Hospitalar - Selecione seu perfil de acesso
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
                onClick={() => onSelectProfile('admin')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <UserCog className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Administrador</CardTitle>
              <CardDescription className="text-base">
                Acesso completo com dashboard analítico e métricas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Dashboard com gráficos e relatórios
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Visão geral de todos os módulos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Métricas de performance e indicadores
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Gestão completa do sistema
                </li>
              </ul>
              <Button className="w-full" variant="default">
                Acessar como Administrador
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
                onClick={() => onSelectProfile('user')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/80 transition-colors">
                <User className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">Usuário Padrão</CardTitle>
              <CardDescription className="text-base">
                Interface focada em ações rápidas e notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Ações rápidas de cadastro
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Notificações recentes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Interface simplificada
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Foco na operação diária
                </li>
              </ul>
              <Button className="w-full" variant="secondary">
                Acessar como Usuário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}