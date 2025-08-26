
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Upload, Image, ExternalLink, MousePointer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  position: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  impression_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

const AdminBanners = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link_url: '',
    position: 'sidebar',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Banner[];
    }
  });

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('banners')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      let imageUrl = '';

      if (file) {
        setUploading(true);
        imageUrl = await uploadFile(file);
      }

      const { error } = await supabase
        .from('banners')
        .insert({
          title: data.title,
          description: data.description,
          image_url: imageUrl,
          link_url: data.link_url,
          position: data.position,
          is_active: data.is_active,
          start_date: data.start_date || null,
          end_date: data.end_date || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Banner criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar banner",
        description: error.message,
        variant: "destructive"
      });
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      let updateData: any = {
        title: data.title,
        description: data.description,
        link_url: data.link_url,
        position: data.position,
        is_active: data.is_active,
        start_date: data.start_date || null,
        end_date: data.end_date || null
      };

      if (file) {
        setUploading(true);
        updateData.image_url = await uploadFile(file);
      }

      const { error } = await supabase
        .from('banners')
        .update(updateData)
        .eq('id', editingItem!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Banner atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar banner",
        description: error.message,
        variant: "destructive"
      });
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast({ title: "Banner excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir banner",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('banners')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link_url: '',
      position: 'sidebar',
      is_active: true,
      start_date: '',
      end_date: ''
    });
    setFile(null);
    setEditingItem(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingItem(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      link_url: banner.link_url || '',
      position: banner.position,
      is_active: banner.is_active,
      start_date: banner.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : '',
      end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return '0%';
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
  };

  if (isLoading) {
    return <div className="p-6">Carregando banners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners Publicitários</h1>
          <p className="text-muted-foreground">Gerencie banners e campanhas publicitárias</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Banner' : 'Novo Banner'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Posição</label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="content">Conteúdo</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL do Link</label>
                <Input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de Início</label>
                  <Input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Data de Fim</label>
                  <Input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <label className="text-sm font-medium">Banner ativo</label>
              </div>

              <div>
                <label className="text-sm font-medium">Imagem do Banner</label>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept="image/*"
                  required={!editingItem}
                />
                {editingItem && !file && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para manter a imagem atual
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading || createMutation.isPending || updateMutation.isPending}>
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : editingItem ? (
                    'Atualizar'
                  ) : (
                    'Criar'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Banners ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Impressões</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={banner.image_url} 
                        alt={banner.title}
                        className="w-12 h-8 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{banner.title}</div>
                        {banner.link_url && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate max-w-32">{banner.link_url}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{banner.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={banner.is_active}
                        onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: banner.id, is_active: checked })}
                        size="sm"
                      />
                      <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                        {banner.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{banner.impression_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MousePointer className="h-4 w-4" />
                      <span>{banner.click_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>{calculateCTR(banner.click_count, banner.impression_count)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(banner.image_url, '_blank')}
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este banner?')) {
                            deleteMutation.mutate(banner.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBanners;
