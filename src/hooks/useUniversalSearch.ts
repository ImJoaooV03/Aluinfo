
import { useState, useEffect } from 'react';
import { useNews } from './useNews';
import { useTechnicalMaterials } from './useTechnicalMaterials';
import { useEbooks } from './useEbooks';
import { useEvents } from './useEvents';
import { useFoundries } from './useFoundries';
import { useSuppliers } from './useSuppliers';

export interface SearchResult {
  id: string;
  title: string;
  name?: string;
  summary: string;
  type: 'Notícia' | 'Material Técnico' | 'E-book' | 'Evento' | 'Fornecedor' | 'Fundição';
  category?: string;
  author?: string;
  date?: string;
  location?: string;
  specialty?: string;
  price?: string;
  downloads?: number;
  slug?: string;
  image?: string;
}

export const useUniversalSearch = (searchTerm: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const { news } = useNews();
  const { materials } = useTechnicalMaterials();
  const { ebooks } = useEbooks();
  const { events } = useEvents();
  const { foundries } = useFoundries();
  const { suppliers } = useSuppliers();

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchLower = searchTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search in news
    news.forEach(item => {
      if (
        item.title.toLowerCase().includes(searchLower) ||
        item.excerpt?.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: item.id,
          title: item.title,
          summary: item.excerpt || item.content.substring(0, 200) + '...',
          type: 'Notícia',
          date: item.published_at || item.created_at,
          slug: item.slug,
          image: item.featured_image_url || undefined
        });
      }
    });

    // Search in technical materials
    materials.forEach(item => {
      if (
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: item.id,
          title: item.title,
          summary: item.description || 'Material técnico disponível para download',
          type: 'Material Técnico',
          date: item.created_at,
          downloads: item.download_count || 0,
          slug: item.slug
        });
      }
    });

    // Search in ebooks
    ebooks.forEach(item => {
      if (
        item.title.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: item.id,
          title: item.title,
          summary: item.description || 'E-book disponível para download',
          type: 'E-book',
          author: item.author,
          price: item.price ? `R$ ${item.price.toFixed(2)}` : 'Gratuito',
          downloads: item.download_count || 0,
          slug: item.slug,
          image: item.cover_image_url || undefined
        });
      }
    });

    // Search in events
    events.forEach(item => {
      if (
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: item.id,
          title: item.title,
          summary: item.description || 'Evento do setor de fundição',
          type: 'Evento',
          date: item.event_date,
          location: item.location || item.venue,
          price: item.price ? `R$ ${item.price.toFixed(2)}` : undefined,
          slug: item.slug,
          image: item.image_url || undefined
        });
      }
    });

    // Search in suppliers
    suppliers.forEach(item => {
      if (
        item.name.toLowerCase().includes(searchLower) ||
        item.specialty?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: item.id,
          name: item.name,
          title: item.name,
          summary: item.description || item.specialty || 'Fornecedor do setor de fundição',
          type: 'Fornecedor',
          specialty: item.specialty || undefined,
          location: `${item.city || ''}, ${item.state || ''}`.trim().replace(/^,|,$/, ''),
          slug: item.slug
        });
      }
    });

    // Search in foundries
    foundries.forEach(item => {
      if (
        item.name.toLowerCase().includes(searchLower) ||
        item.specialty?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: item.id,
          name: item.name,
          title: item.name,
          summary: item.description || item.specialty || 'Fundição especializada',
          type: 'Fundição',
          specialty: item.specialty || undefined,
          location: `${item.city || ''}, ${item.state || ''}`.trim().replace(/^,|,$/, ''),
          slug: item.slug
        });
      }
    });

    setResults(searchResults);
    setLoading(false);
  }, [searchTerm, news, materials, ebooks, events, foundries, suppliers]);

  return {
    results,
    loading
  };
};
