
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
import LME from "./pages/LME";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminAuth from "./pages/AdminAuth";

import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminMateriais from "./pages/admin/AdminMateriais";
import AdminEventos from "./pages/admin/AdminEventos";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminLME from "./pages/admin/AdminLME";
import AdminNewsletter from "./pages/admin/AdminNewsletter";

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
          <Route path="/lme" element={<LME />} />
          <Route path="/editar-banners" element={<EditarBanners />} />
          
          {/* Admin routes */}
          <Route path="/admin/auth" element={<AdminAuth />} />
          
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/noticias" element={<AdminLayout><AdminNoticias /></AdminLayout>} />
          <Route path="/admin/materiais" element={<AdminLayout><AdminMateriais /></AdminLayout>} />
          <Route path="/admin/eventos" element={<AdminLayout><AdminEventos /></AdminLayout>} />
          <Route path="/admin/banners" element={<AdminLayout><AdminBanners /></AdminLayout>} />
          <Route path="/admin/lme" element={<AdminLayout><AdminLME /></AdminLayout>} />
          <Route path="/admin/newsletter" element={<AdminLayout><AdminNewsletter /></AdminLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
