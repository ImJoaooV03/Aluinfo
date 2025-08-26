import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Função para mascarar email no frontend
export const maskEmail = (email: string | null): string => {
  if (!email) return '';
  
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return '***';
  
  const username = email.substring(0, atIndex);
  const domain = email.substring(atIndex);
  
  return username.charAt(0) + '***' + domain;
};

// Função para mascarar telefone no frontend
export const maskPhone = (phone: string | null): string => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 4) return '***';
  
  return '*'.repeat(cleanPhone.length - 4) + cleanPhone.slice(-4);
};

// Hook para verificar se usuário está autenticado
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { isAuthenticated, loading };
};

// Hook para obter dados de fornecedores com mascaramento baseado em autenticação
export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('status', 'published')
          .order('name');

        if (error) throw error;

        // Aplicar mascaramento se usuário não estiver autenticado
        const processedData = data?.map(supplier => ({
          ...supplier,
          email: isAuthenticated ? supplier.email : maskEmail(supplier.email),
          phone: isAuthenticated ? supplier.phone : maskPhone(supplier.phone)
        })) || [];

        setSuppliers(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [isAuthenticated]);

  return { suppliers, loading, error };
};

// Hook para obter dados de fundições com mascaramento baseado em autenticação
export const useFoundries = () => {
  const [foundries, setFoundries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFoundries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('foundries')
          .select('*')
          .eq('status', 'published')
          .order('name');

        if (error) throw error;

        // Aplicar mascaramento se usuário não estiver autenticado
        const processedData = data?.map(foundry => ({
          ...foundry,
          email: isAuthenticated ? foundry.email : maskEmail(foundry.email),
          phone: isAuthenticated ? foundry.phone : maskPhone(foundry.phone)
        })) || [];

        setFoundries(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoundries();
  }, [isAuthenticated]);

  return { foundries, loading, error };
};