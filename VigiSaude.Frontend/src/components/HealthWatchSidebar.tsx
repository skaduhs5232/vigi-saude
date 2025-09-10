import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Somente os itens permitidos
const menuItems = [
  { title: "Flebite", url: "/processo-cuidado/flebite", icon: Activity },
  { title: "Queda", url: "/processo-cuidado/queda", icon: AlertTriangle },
  { title: "Lesão por pressão", url: "/processo-cuidado/lesao-pressao", icon: ShieldCheck },
  { title: "Reação adversa a medicamento", url: "/farmacovigilancia", icon: Pill },
  { title: "Erro de medicação", url: "/processo-cuidado/erros-medicacao", icon: AlertTriangle },
];

export function HealthWatchSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
      active
        ? "bg-primary text-primary-foreground font-medium"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

  return (
    <Sidebar 
      className={cn(
        "border-r bg-card transition-all duration-300",
        collapsed ? "w-14" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">vigi saúde</h2>
                <p className="text-xs text-muted-foreground">Vigilância Sanitária</p>
              </div>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>

        {/* Navegação reduzida */}
        <div className="mt-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={item.url} 
                    end
                    className={({ isActive }) => getNavClassName(isActive)}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}