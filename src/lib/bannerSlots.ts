export interface BannerSlot {
  id: number;
  label: string;
  key: string;
  description: string;
}

export const BANNER_SLOTS: BannerSlot[] = [
  // Home hero slider
  { id: 0, label: "0 — Home Slider (Desktop)", key: "home-slider", description: "Slider principal da página inicial (Desktop)" },
  { id: 37, label: "37 — Home Slider (Mobile)", key: "home-slider-mobile", description: "Slider principal da página inicial (Mobile)" },
  
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
  
  // Eventos (topo + prefixo de sidebar exclusivo)
  { id: 18, label: "18 — Eventos Topo", key: "eventos-top", description: "Banner topo da página de Eventos" },

  // Fornecedores (lista): topo + sidebars exclusivos
  { id: 19, label: "19 — Fornecedores Sidebar 1", key: "fornecedores-sidebar-1", description: "Primeiro banner da sidebar (lista de fornecedores)" },
  { id: 20, label: "20 — Fornecedores Sidebar 2", key: "fornecedores-sidebar-2", description: "Segundo banner da sidebar (lista de fornecedores)" },
  { id: 21, label: "21 — Fornecedores Sidebar 3", key: "fornecedores-sidebar-3", description: "Terceiro banner da sidebar (lista de fornecedores)" },
  { id: 22, label: "22 — Fornecedores Sidebar 4", key: "fornecedores-sidebar-4", description: "Quarto banner da sidebar (lista de fornecedores)" },

  // Fornecedor individual: topo, meio, final + sidebars exclusivos
  { id: 23, label: "23 — Fornecedor Topo", key: "fornecedor-top", description: "Banner topo da página do fornecedor" },
  { id: 24, label: "24 — Fornecedor Meio", key: "fornecedor-middle", description: "Banner no meio do conteúdo da página do fornecedor" },
  { id: 25, label: "25 — Fornecedor Final", key: "fornecedor-bottom", description: "Banner final da página do fornecedor" },
  { id: 26, label: "26 — Fornecedor Sidebar 1", key: "fornecedor-sidebar-1", description: "Primeiro banner da sidebar (página do fornecedor)" },
  { id: 27, label: "27 — Fornecedor Sidebar 2", key: "fornecedor-sidebar-2", description: "Segundo banner da sidebar (página do fornecedor)" },
  { id: 28, label: "28 — Fornecedor Sidebar 3", key: "fornecedor-sidebar-3", description: "Terceiro banner da sidebar (página do fornecedor)" },
  { id: 29, label: "29 — Fornecedor Sidebar 4", key: "fornecedor-sidebar-4", description: "Quarto banner da sidebar (página do fornecedor)" },

  // Fundição individual: topo, meio, final + sidebars exclusivos
  { id: 30, label: "30 — Fundição Topo", key: "fundicao-top", description: "Banner topo da página da fundição" },
  { id: 31, label: "31 — Fundição Meio", key: "fundicao-middle", description: "Banner no meio do conteúdo da página da fundição" },
  { id: 32, label: "32 — Fundição Final", key: "fundicao-bottom", description: "Banner final da página da fundição" },
  { id: 33, label: "33 — Fundição Sidebar 1", key: "fundicao-sidebar-1", description: "Primeiro banner da sidebar (página da fundição)" },
  { id: 34, label: "34 — Fundição Sidebar 2", key: "fundicao-sidebar-2", description: "Segundo banner da sidebar (página da fundição)" },
  { id: 35, label: "35 — Fundição Sidebar 3", key: "fundicao-sidebar-3", description: "Terceiro banner da sidebar (página da fundição)" },
  { id: 36, label: "36 — Fundição Sidebar 4", key: "fundicao-sidebar-4", description: "Quarto banner da sidebar (página da fundição)" },
];

export const getBannerSlotByKey = (key: string): BannerSlot | undefined => {
  return BANNER_SLOTS.find(slot => slot.key === key);
};

export const getBannerSlotById = (id: number): BannerSlot | undefined => {
  return BANNER_SLOTS.find(slot => slot.id === id);
};