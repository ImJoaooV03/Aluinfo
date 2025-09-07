
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getLanguageFromPath, supportedLanguages, type SupportedLanguage } from "@/utils/i18nUtils";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminLayout } from "@/components/AdminLayout";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import NoticiaIndividual from "./pages/NoticiaIndividual";
import ArtigosTecnicos from "./pages/ArtigosTecnicos";
import Ebooks from "./pages/Ebooks";
import Eventos from "./pages/Eventos";
import Fornecedores from "./pages/Fornecedores";
import Fundicoes from "./pages/Fundicoes";
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

// Language wrapper component to handle i18n
function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const currentLang = lang as SupportedLanguage;
    if (currentLang && supportedLanguages.includes(currentLang)) {
      if (i18n.language !== currentLang) {
        i18n.changeLanguage(currentLang);
      }
    }
  }, [lang, i18n]);
  
  return <>{children}</>;
}

// Redirect component for root path
function RootRedirect() {
  const savedLang = localStorage.getItem('i18nextLng') as SupportedLanguage;
  const defaultLang = savedLang && supportedLanguages.includes(savedLang) ? savedLang : 'pt';
  return <Navigate to={`/${defaultLang}`} replace />;
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
            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Language-prefixed routes */}
            <Route path="/:lang" element={<LanguageWrapper><Outlet /></LanguageWrapper>}>
              {/* Rotas públicas */}
              <Route index element={<Index />} />
              <Route path="noticias" element={<Noticias />} />
              <Route path="noticias/:slug" element={<NoticiaIndividual />} />
              {/* Compatibility route for old singular URLs */}
              <Route path="noticia/:slug" element={<NoticiaIndividual />} />
              <Route path="artigos-tecnicos" element={<ArtigosTecnicos />} />
              <Route path="ebooks" element={<Ebooks />} />
              <Route path="eventos" element={<Eventos />} />
              <Route path="fornecedores" element={<Fornecedores />} />
              <Route path="fundicoes" element={<Fundicoes />} />
              <Route path="lme" element={<LME />} />
              <Route path="patrocinadas" element={<Patrocinadas />} />
              <Route path="anuncie" element={<Anuncie />} />
              <Route path="editar-banners" element={<EditarBanners />} />
              
              {/* Rotas administrativas sem layout */}
              <Route path="admin/auth" element={<AdminAuth />} />
              
              {/* Rotas administrativas com layout */}
              <Route path="admin" element={<AdminLayoutWrapper />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="noticias" element={<AdminNoticias />} />
                <Route path="materiais" element={<AdminMateriais />} />
                <Route path="ebooks" element={<AdminEbooks />} />
                <Route path="eventos" element={<AdminEventos />} />
                <Route path="fornecedores" element={<AdminFornecedores />} />
                <Route path="fundicoes" element={<AdminFundicoes />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="lme" element={<AdminLME />} />
                <Route path="downloads" element={<AdminDownloads />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="media-kit" element={<AdminMediaKit />} />
              </Route>
            </Route>

            {/* Legacy routes without language prefix - redirect to /pt/path */}
            <Route path="/noticias" element={<Navigate to="/pt/noticias" replace />} />
            <Route path="/noticias/:slug" element={<Navigate to={`/pt/noticias/${window.location.pathname.split('/')[2]}`} replace />} />
            <Route path="/artigos-tecnicos" element={<Navigate to="/pt/artigos-tecnicos" replace />} />
            <Route path="/ebooks" element={<Navigate to="/pt/ebooks" replace />} />
            <Route path="/eventos" element={<Navigate to="/pt/eventos" replace />} />
            <Route path="/fornecedores" element={<Navigate to="/pt/fornecedores" replace />} />
            <Route path="/fundicoes" element={<Navigate to="/pt/fundicoes" replace />} />
            <Route path="/lme" element={<Navigate to="/pt/lme" replace />} />
            <Route path="/patrocinadas" element={<Navigate to="/pt/patrocinadas" replace />} />
            <Route path="/anuncie" element={<Navigate to="/pt/anuncie" replace />} />
            <Route path="/admin/auth" element={<Navigate to="/pt/admin/auth" replace />} />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
