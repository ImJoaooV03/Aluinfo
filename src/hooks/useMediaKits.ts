import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MediaKit {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export const useMediaKits = () => {
  return useQuery({
    queryKey: ["media-kits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_kits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MediaKit[];
    },
  });
};

export const useCreateMediaKit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaKit: Omit<MediaKit, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("media_kits")
        .insert([mediaKit])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-kits"] });
      toast.success("Mídia kit criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar mídia kit.");
    },
  });
};

export const useUpdateMediaKit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MediaKit> & { id: string }) => {
      const { data, error } = await supabase
        .from("media_kits")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-kits"] });
      toast.success("Mídia kit atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar mídia kit.");
    },
  });
};

export const useDeleteMediaKit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("media_kits")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-kits"] });
      toast.success("Mídia kit excluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir mídia kit.");
    },
  });
};

// Hook para obter o mídia kit ativo (para uso público)
export const useActiveMediaKit = () => {
  return useQuery({
    queryKey: ["active-media-kit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_kits")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as MediaKit | null;
    },
  });
};