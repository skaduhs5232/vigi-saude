import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Farmacovigilancia from "@/pages/modules/Farmacovigilancia";
import Tecnovigilancia from "@/pages/modules/Tecnovigilancia";
import Hemovigilancia from "@/pages/modules/Hemovigilancia";
import Notificador from "@/pages/modules/Notificador";
import ErrosMedicacao from "@/pages/modules/processo-cuidado/ErrosMedicacao";
import Flebite from "@/pages/modules/processo-cuidado/Flebite";
import LesaoPressao from "@/pages/modules/processo-cuidado/LesaoPressao";
import UlceraCornea from "@/pages/modules/processo-cuidado/UlceraCornea";
import Queda from "@/pages/modules/processo-cuidado/Queda";
import Broncoaspiracao from "@/pages/modules/processo-cuidado/Broncoaspiracao";
import Biovigilancia from "@/pages/modules/outros/Biovigilancia";
import Cosmetovigilancia from "@/pages/modules/outros/Cosmetovigilancia";
import Saneantes from "@/pages/modules/outros/Saneantes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/notificador" element={<Notificador />} />
            <Route path="/farmacovigilancia" element={<Farmacovigilancia />} />
            <Route path="/tecnovigilancia" element={<Tecnovigilancia />} />
            <Route path="/hemovigilancia" element={<Hemovigilancia />} />
            {/* Processo de Cuidado */}
            <Route path="/processo-cuidado/erros-medicacao" element={<ErrosMedicacao />} />
            <Route path="/processo-cuidado/flebite" element={<Flebite />} />
            <Route path="/processo-cuidado/lesao-pressao" element={<LesaoPressao />} />
            <Route path="/processo-cuidado/ulcera-cornea" element={<UlceraCornea />} />
            <Route path="/processo-cuidado/queda" element={<Queda />} />
            <Route path="/processo-cuidado/broncoaspiracao" element={<Broncoaspiracao />} />
            {/* Outros */}
            <Route path="/outros/biovigilancia" element={<Biovigilancia />} />
            <Route path="/outros/cosmetovigilancia" element={<Cosmetovigilancia />} />
            <Route path="/outros/saneantes" element={<Saneantes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
