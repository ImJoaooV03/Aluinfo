
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import NoticiaIndividual from "./pages/NoticiaIndividual";
import ArtigosTecnicos from "./pages/ArtigosTecnicos";
import Ebooks from "./pages/Ebooks";
import Fornecedores from "./pages/Fornecedores";
import Fundicoes from "./pages/Fundicoes";
import LME from "./pages/LME";
import Patrocinadas from "./pages/Patrocinadas";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminMateriais from "./pages/admin/AdminMateriais";
import AdminEbooks from "./pages/admin/AdminEbooks";
import AdminEventos from "./pages/admin/AdminEventos";
import AdminFornecedores from "./pages/admin/AdminFornecedores";
import AdminFundicoes from "./pages/admin/AdminFundicoes";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminLME from "./pages/admin/AdminLME";
import AdminDownloads from "./pages/admin/AdminDownloads";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminAuth from "./pages/AdminAuth";
import CreateAdmin from "./pages/CreateAdmin";
import EditarBanners from "./pages/EditarBanners";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:slug" element={<NoticiaIndividual />} />
            <Route path="/artigos-tecnicos" element={<ArtigosTecnicos />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/fundicoes" element={<Fundicoes />} />
            <Route path="/lme" element={<LME />} />
            <Route path="/patrocinadas" element={<Patrocinadas />} />
            <Route path="/editar-banners" element={<EditarBanners />} />

            {/* Rotas administrativas */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/create-admin" element={<CreateAdmin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/noticias" element={<AdminNoticias />} />
            <Route path="/admin/materiais" element={<AdminMateriais />} />
            <Route path="/admin/ebooks" element={<AdminEbooks />} />
            <Route path="/admin/eventos" element={<AdminEventos />} />
            <Route path="/admin/fornecedores" element={<AdminFornecedores />} />
            <Route path="/admin/fundicoes" element={<AdminFundicoes />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/lme" element={<AdminLME />} />
            <Route path="/admin/downloads" element={<AdminDownloads />} />
            <Route path="/admin/newsletter" element={<AdminNewsletter />} />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
