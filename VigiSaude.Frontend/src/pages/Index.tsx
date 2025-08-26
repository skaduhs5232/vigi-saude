import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HealthWatchSidebar } from "@/components/HealthWatchSidebar";
import { ProfileSelector } from "@/components/ProfileSelector";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserDashboard } from "@/components/UserDashboard";
const Index = () => {
  const [selectedProfile, setSelectedProfile] = useState<'admin' | 'user' | null>(null);
  if (!selectedProfile) {
    return <ProfileSelector onSelectProfile={setSelectedProfile} />;
  }
  return <div className="min-h-screen w-full flex bg-background">
      {selectedProfile === 'admin' && <HealthWatchSidebar />}
      
      <div className="flex-1 flex flex-col">
  <header className="h-14 flex items-center border-b bg-card px-4">
          
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">HealthWatch</h1>
            <span className="text-sm text-muted-foreground">
              - {selectedProfile === 'admin' ? 'Administrador' : 'Usuário Padrão'}
            </span>
          </div>
          <div className="ml-auto">
            <button onClick={() => setSelectedProfile(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Trocar Perfil
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {selectedProfile === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </main>
      </div>
    </div>;
};
export default Index;