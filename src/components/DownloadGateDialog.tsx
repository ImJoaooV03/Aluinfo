import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { enforceHttps } from "@/utils/httpsUtils";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email deve ter um formato válido"),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos"),
});

type FormValues = z.infer<typeof formSchema>;

interface DownloadGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: "technical_materials" | "ebooks";
  contentId: string;
  fileUrl: string;
  title: string;
  onDownloadComplete?: () => void;
}

export const DownloadGateDialog = ({
  open,
  onOpenChange,
  contentType,
  contentId,
  fileUrl,
  title,
  onDownloadComplete,
}: DownloadGateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleDownload = async (url: string) => {
    try {
      const secureUrl = enforceHttps(url);
      
      // Adicionar parâmetro download para forçar download
      const filename = title.replace(/[^a-zA-Z0-9.-]/g, '_');
      const downloadUrl = `${secureUrl}${secureUrl.includes('?') ? '&' : '?'}download=${filename}`;
      
      // Método 1: Fetch + blob para contornar bloqueios
      try {
        const response = await fetch(downloadUrl);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Limpar URL do blob
          window.URL.revokeObjectURL(blobUrl);
          
          toast({
            title: "Download iniciado",
            description: `O arquivo "${title}" está sendo baixado.`,
          });
          return;
        }
      } catch (fetchError) {
        console.log('Fetch download falhou, tentando fallback:', fetchError);
      }

      // Método 2: Fallback com elemento <a>
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      
      try {
        link.click();
        toast({
          title: "Download iniciado",
          description: `O arquivo "${title}" está sendo baixado.`,
        });
      } catch (e) {
        console.log('Link click falhou, usando location.href');
        // Método 3: Último recurso - abrir na mesma aba
        window.location.href = downloadUrl;
      } finally {
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível processar o download. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Iniciar o download imediatamente para evitar bloqueio de pop-ups
      handleDownload(fileUrl);
      
      // Sanitizar telefone (apenas números)
      const cleanPhone = values.phone.replace(/\D/g, '');
      
      // Registrar lead em background (não bloqueia o download)
      Promise.all([
        // Inserir na newsletter_subscribers
        supabase.from('newsletter_subscribers').insert({
          email: values.email,
          name: values.name,
          preferences: {
            source: 'download',
            phone: cleanPhone,
            content_type: contentType,
            content_id: contentId,
          },
        }),
        // Registrar analytics
        supabase.from('analytics_views').insert({
          content_type: contentType,
          content_id: contentId,
          user_id: null,
          ip_address: null,
          user_agent: window.navigator.userAgent,
          referer: window.location.href,
        }),
      ]).catch((error) => {
        console.error('Erro ao registrar dados:', error);
        // Não mostrar erro para o usuário, o download já foi iniciado
      });

      toast({
        title: "Obrigado!",
        description: "Suas informações foram salvas e o download foi iniciado.",
      });

      // Fechar modal e chamar callback
      onOpenChange(false);
      onDownloadComplete?.();
      
      // Reset do form
      form.reset();
      
    } catch (error) {
      console.error('Erro no processo:', error);
      toast({
        title: "Erro",
        description: "Houve um problema. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesse o conteúdo</DialogTitle>
          <DialogDescription>
            Para baixar "{title}", preencha seus dados abaixo. O download será iniciado automaticamente.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(11) 99999-9999" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Enviar e baixar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};