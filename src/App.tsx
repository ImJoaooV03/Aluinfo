
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import NoticiaIndividual from "./pages/NoticiaIndividual";
import Ebooks from "./pages/Ebooks";
import ArtigosTecnicos from "./pages/ArtigosTecnicos";
import LME from "./pages/LME";
import Fundicoes from "./pages/Fundicoes";
import Fornecedores from "./pages/Fornecedores";
import Patrocinadas from "./pages/Patrocinadas";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/AdminAuth";
import CreateAdmin from "./pages/CreateAdmin";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminMateriais from "./pages/admin/AdminMateriais";
import AdminEbooks from "./pages/admin/AdminEbooks";
import AdminEventos from "./pages/admin/AdminEventos";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminLME from "./pages/admin/AdminLME";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
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
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticia/:slug" element={<NoticiaIndividual />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/artigos-tecnicos" element={<ArtigosTecnicos />} />
            <Route path="/materiais-tecnicos" element={<ArtigosTecnicos />} />
            <Route path="/lme" element={<LME />} />
            <Route path="/fundicoes" element={<Fundicoes />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/patrocinadas" element={<Patrocinadas />} />
            <Route path="/editar-banners" element={<EditarBanners />} />
            
            {/* Admin Auth Routes */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin/create" element={<CreateAdmin />} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/noticias" element={<AdminLayout><AdminNoticias /></AdminLayout>} />
            <Route path="/admin/materiais" element={<AdminLayout><AdminMateriais /></AdminLayout>} />
            <Route path="/admin/ebooks" element={<AdminLayout><AdminEbooks /></AdminLayout>} />
            <Route path="/admin/eventos" element={<AdminLayout><AdminEventos /></AdminLayout>} />
            <Route path="/admin/banners" element={<AdminLayout><AdminBanners /></AdminLayout>} />
            <Route path="/admin/lme" element={<AdminLayout><AdminLME /></AdminLayout>} />
            <Route path="/admin/newsletter" element={<AdminLayout><AdminNewsletter /></AdminLayout>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
