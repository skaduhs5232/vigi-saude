import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserDashboard } from "@/components/UserDashboard";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">VigiSaúde</h1>
            <span className="text-sm text-muted-foreground">- Usuário Padrão</span>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Trocar Perfil
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <UserDashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
