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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
