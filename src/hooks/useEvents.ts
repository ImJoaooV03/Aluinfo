
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  event_date: string; // Legacy field, kept for compatibility
  venue: string | null;
  location: string | null;
  price: number | null;
  max_attendees: number | null;
  registration_url: string | null;
  website_url: string | null;
  image_url: string | null;
  status: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useEvents = () => {
  const { i18n } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = (i18n.language || 'pt') as 'pt' | 'es' | 'en';
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          events_translations!left (
            title,
            description,
            location,
            venue
          )
        `)
        .eq('status', 'published')
        .eq('events_translations.lang', currentLang)
        .order('start_date', { ascending: true });

      if (error) {
        throw error;
      }

      // Merge base data with translations, fallback to PT
      const eventsWithTranslations = await Promise.all((data || []).map(async (event: any) => {
        let translation = event.events_translations?.[0];
        
        if (!translation && currentLang !== 'pt') {
          const { data: ptData } = await supabase
            .from('events_translations')
            .select('title, description, venue, location')
            .eq('event_id', event.id)
            .eq('lang', 'pt' as 'pt' | 'es' | 'en')
            .single();
          translation = ptData;
        }
        
        return {
          ...event,
          title: translation?.title || event.title,
          description: translation?.description || event.description,
          location: translation?.location || event.location,
          venue: translation?.venue || event.venue,
          events_translations: undefined,
        };
      }));

      setEvents(eventsWithTranslations);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Events change detected:', payload);
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for events');
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};
