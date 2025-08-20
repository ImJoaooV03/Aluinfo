import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import NoticiaIndividual from "./pages/NoticiaIndividual";
import MateriaisTecnicos from "./pages/MateriaisTecnicos";
import Ebooks from "./pages/Ebooks";
import Fornecedores from "./pages/Fornecedores";
import Fundicoes from "./pages/Fundicoes";
import Patrocinadas from "./pages/Patrocinadas";
import EditarBanners from "./pages/EditarBanners";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticia/:id" element={<NoticiaIndividual />} />
          <Route path="/materiais" element={<MateriaisTecnicos />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/fundicoes" element={<Fundicoes />} />
          <Route path="/patrocinadas" element={<Patrocinadas />} />
          <Route path="/editar-banners" element={<EditarBanners />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
