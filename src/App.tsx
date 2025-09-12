
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminLayout } from "@/components/AdminLayout";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import NoticiaIndividual from "./pages/NoticiaIndividual";
import ArtigosTecnicos from "./pages/ArtigosTecnicos";
import Ebooks from "./pages/Ebooks";
import Eventos from "./pages/Eventos";
import Fornecedores from "./pages/Fornecedores";
import FornecedorIndividual from "./pages/FornecedorIndividual";
import Fundicoes from "./pages/Fundicoes";
import FundicaoIndividual from "./pages/FundicaoIndividual";
import LME from "./pages/LME";
import Patrocinadas from "./pages/Patrocinadas";
import Anuncie from "./pages/Anuncie";
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
import AdminMediaKit from "./pages/admin/AdminMediaKit";
import AdminAuth from "./pages/AdminAuth";
import SupplierPageEditor from "./pages/admin/SupplierPageEditor";
import FoundryPageEditor from "./pages/admin/FoundryPageEditor";

import EditarBanners from "./pages/EditarBanners";

const queryClient = new QueryClient();

// AdminLayoutWrapper component to wrap admin routes
function AdminLayoutWrapper() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

// Component to redirect old language URLs to clean URLs
function LangStripRedirect() {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if URL starts with language prefix
  const match = pathname.match(/^\/(pt|es|en)(\/.*|$)/);
  if (match) {
    const newPath = match[2] || '/';
    return <Navigate to={newPath + location.search + location.hash} replace />;
  }
  
  return <Navigate to="/404" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
            {/* Main routes without language prefix */}
            <Route path="/" element={<Index />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:slug" element={<NoticiaIndividual />} />
            {/* Compatibility route for old singular URLs */}
            <Route path="/noticia/:slug" element={<NoticiaIndividual />} />
            <Route path="/artigos-tecnicos" element={<ArtigosTecnicos />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/fornecedores/:slug" element={<FornecedorIndividual />} />
            <Route path="/fundicoes" element={<Fundicoes />} />
            <Route path="/fundicoes/:slug" element={<FundicaoIndividual />} />
            <Route path="/lme" element={<LME />} />
            <Route path="/patrocinadas" element={<Patrocinadas />} />
            <Route path="/anuncie" element={<Anuncie />} />
            <Route path="/editar-banners" element={<EditarBanners />} />
            
            {/* Administrative routes without layout */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            
            {/* Administrative routes with layout */}
            <Route path="/admin" element={<AdminLayoutWrapper />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="noticias" element={<AdminNoticias />} />
              <Route path="materiais" element={<AdminMateriais />} />
              <Route path="ebooks" element={<AdminEbooks />} />
              <Route path="eventos" element={<AdminEventos />} />
              <Route path="fornecedores" element={<AdminFornecedores />} />
              <Route path="fornecedores/:slug/pagina" element={<SupplierPageEditor />} />
              <Route path="fundicoes/:slug/pagina" element={<FoundryPageEditor />} />
              <Route path="fundicoes" element={<AdminFundicoes />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="lme" element={<AdminLME />} />
              <Route path="downloads" element={<AdminDownloads />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="media-kit" element={<AdminMediaKit />} />
            </Route>

            {/* Language-prefixed routes redirect to clean URLs */}
            <Route path="/pt/*" element={<LangStripRedirect />} />
            <Route path="/es/*" element={<LangStripRedirect />} />
            <Route path="/en/*" element={<LangStripRedirect />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
