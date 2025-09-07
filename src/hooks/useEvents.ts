
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_date', { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || []);
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
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};
