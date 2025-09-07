export interface BannerSlot {
  id: number;
  label: string;
  key: string;
  description: string;
}

export const BANNER_SLOTS: BannerSlot[] = [
  // Home hero slider
  { id: 0, label: "0 — Home Slider", key: "home-slider", description: "Slider principal da página inicial" },
  
  // Sidebar banners (1-4)
  { id: 1, label: "1 — Sidebar 1", key: "sidebar-1", description: "Primeiro banner da sidebar" },
  { id: 2, label: "2 — Sidebar 2", key: "sidebar-2", description: "Segundo banner da sidebar" },
  { id: 3, label: "3 — Sidebar 3", key: "sidebar-3", description: "Terceiro banner da sidebar" },
  { id: 4, label: "4 — Sidebar 4", key: "sidebar-4", description: "Quarto banner da sidebar" },
  
  // Main content banners (5-9)
  { id: 5, label: "5 — Conteúdo Grande 1", key: "content-1", description: "Primeiro banner grande do conteúdo principal" },
  { id: 6, label: "6 — Conteúdo Grande 2", key: "content-2", description: "Segundo banner grande do conteúdo principal" },
  { id: 7, label: "7 — Conteúdo Grande 3", key: "content-3", description: "Terceiro banner grande do conteúdo principal" },
  { id: 8, label: "8 — Conteúdo Grande 4", key: "content-4", description: "Quarto banner grande do conteúdo principal" },
  { id: 9, label: "9 — Conteúdo Grande 5", key: "content-5", description: "Quinto banner grande do conteúdo principal" },
  
  // Page-specific banners (10-17)
  { id: 10, label: "10 — E-books Topo", key: "ebooks-top", description: "Banner topo da página de E-books" },
  { id: 11, label: "11 — Fornecedores Topo", key: "fornecedores-top", description: "Banner topo da página de Fornecedores" },
  { id: 12, label: "12 — Fundições Topo", key: "fundicoes-top", description: "Banner topo da página de Fundições" },
  { id: 13, label: "13 — Materiais Técnicos Topo", key: "materiais-top", description: "Banner topo da página de Materiais Técnicos" },
  { id: 14, label: "14 — Notícia Topo", key: "noticia-top", description: "Banner topo da página de notícia individual" },
  { id: 15, label: "15 — Notícia Meio", key: "noticia-middle", description: "Banner meio da página de notícia individual" },
  { id: 16, label: "16 — Notícia Final", key: "noticia-bottom", description: "Banner final da página de notícia individual" },
  { id: 17, label: "17 — Notícias Topo", key: "noticias-top", description: "Banner topo da página de Notícias" },
];

export const getBannerSlotByKey = (key: string): BannerSlot | undefined => {
  return BANNER_SLOTS.find(slot => slot.key === key);
};

export const getBannerSlotById = (id: number): BannerSlot | undefined => {
  return BANNER_SLOTS.find(slot => slot.id === id);
};