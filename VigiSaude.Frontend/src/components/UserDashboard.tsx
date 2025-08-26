import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Syringe, ArrowDownCircle, Bandage, Pill, AlertTriangle } from "lucide-react";

export function UserDashboard() {
  const navigate = useNavigate();

  const modalities = [
  { key: "flebite", label: "Flebite", icon: Syringe, to: "/form/flebite" },
  { key: "queda", label: "Queda", icon: ArrowDownCircle, to: "/form/queda" },
  { key: "lesao-pressao", label: "Lesão por pressão", icon: Bandage, to: "/form/lesao-pressao" },
  { key: "reacao-medicamento", label: "Reação adversa a medicamento", icon: Pill, to: "/form/farmacovigilancia" },
  { key: "erro-medicacao", label: "Erro de medicação", icon: AlertTriangle, to: "/form/erros-medicacao" },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-56px)] w-full flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl">
            escolha a modalidade da notificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {modalities.map((m) => (
              <div
                key={m.key}
                role="button"
                tabIndex={0}
                onClick={() => navigate(m.to)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(m.to);
                }}
                className="aspect-square border rounded-xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer bg-card hover:bg-accent/50 hover:border-primary/60 transition-colors"
              >
                <m.icon className="w-8 h-8" />
                <span className="text-sm font-medium px-2">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}