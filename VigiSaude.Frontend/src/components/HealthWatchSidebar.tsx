import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Pill,
  Stethoscope,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Microscope,
  Sparkles,
  Droplet,
  ChevronDown,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Identificação do Notificador", url: "/notificador", icon: Users },
  { title: "Farmacovigilância", url: "/farmacovigilancia", icon: Pill },
  { title: "Tecnovigilância", url: "/tecnovigilancia", icon: Stethoscope },
  { title: "Hemovigilância", url: "/hemovigilancia", icon: Droplets },
];

const processoCuidadoItems = [
  { title: "Erros de Medicação", url: "/processo-cuidado/erros-medicacao", icon: AlertTriangle },
  { title: "Flebite", url: "/processo-cuidado/flebite", icon: Activity },
  { title: "Lesão por Pressão", url: "/processo-cuidado/lesao-pressao", icon: ShieldCheck },
  { title: "Úlcera de Córnea", url: "/processo-cuidado/ulcera-cornea", icon: Heart },
  { title: "Queda", url: "/processo-cuidado/queda", icon: AlertTriangle },
  { title: "Broncoaspiração", url: "/processo-cuidado/broncoaspiracao", icon: Activity },
];

const outrosItems = [
  { title: "Biovigilância", url: "/outros/biovigilancia", icon: Microscope },
  { title: "Cosmetovigilância", url: "/outros/cosmetovigilancia", icon: Sparkles },
  { title: "Vigilância de Saneantes", url: "/outros/saneantes", icon: Droplet },
];

export function HealthWatchSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [processoCuidadoOpen, setProcessoCuidadoOpen] = useState(
    processoCuidadoItems.some(item => currentPath.startsWith(item.url))
  );
  const [outrosOpen, setOutrosOpen] = useState(
    outrosItems.some(item => currentPath.startsWith(item.url))
  );

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: typeof processoCuidadoItems) => 
    items.some(item => currentPath.startsWith(item.url));

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
                <h2 className="font-semibold text-sm">HealthWatch</h2>
                <p className="text-xs text-muted-foreground">Vigilância Sanitária</p>
              </div>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Processo de Cuidado */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className={cn(
              "flex items-center justify-between cursor-pointer",
              isGroupActive(processoCuidadoItems) && "text-primary"
            )}
            onClick={() => setProcessoCuidadoOpen(!processoCuidadoOpen)}
          >
            <span>Processo de Cuidado</span>
            {!collapsed && (
              <ChevronDown 
                className={cn(
                  "w-4 h-4 transition-transform",
                  processoCuidadoOpen && "rotate-180"
                )}
              />
            )}
          </SidebarGroupLabel>
          {(processoCuidadoOpen || collapsed) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {processoCuidadoItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => getNavClassName(isActive)}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-xs">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Outros */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className={cn(
              "flex items-center justify-between cursor-pointer",
              isGroupActive(outrosItems) && "text-primary"
            )}
            onClick={() => setOutrosOpen(!outrosOpen)}
          >
            <span>Outros</span>
            {!collapsed && (
              <ChevronDown 
                className={cn(
                  "w-4 h-4 transition-transform",
                  outrosOpen && "rotate-180"
                )}
              />
            )}
          </SidebarGroupLabel>
          {(outrosOpen || collapsed) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {outrosItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => getNavClassName(isActive)}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-xs">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}