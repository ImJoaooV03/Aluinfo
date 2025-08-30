import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload, Download, FileText, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";

interface TechnicalMaterial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  download_count: number;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

const AdminMateriais = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechnicalMaterial | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  const { categories, refetch: refetchCategories } = useCategories();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['admin-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TechnicalMaterial[];
    }
  });

  // Configurar atualização em tempo real para contadores de download
  useEffect(() => {
    const channel = supabase
      .channel('technical-materials-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'technical_materials'
        },
        (payload) => {
          console.log('Technical material updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-materials'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for technical materials admin');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const mapFileTypeToEnum = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    // Map video types
    if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
      return 'video';
    }
    
    // Map presentation types
    if (['ppt', 'pptx'].includes(extension || '') || mimeType.includes('presentation')) {
      return 'presentation';
    }
    
    // Map manual types (documents)
    if (['doc', 'docx', 'rtf', 'txt'].includes(extension || '') || mimeType.includes('document')) {
      return 'manual';
    }
    
    // Map guide types (spreadsheets)
    if (['xls', 'xlsx', 'csv'].includes(extension || '') || mimeType.includes('spreadsheet')) {
      return 'guide';
    }
    
    // Default to pdf for PDFs and other files
    return 'pdf';
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `materials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      let fileUrl = '';
      let fileSize = null;
      let fileType = null;

      if (file) {
        setUploading(true);
        fileUrl = await uploadFile(file);
        fileSize = file.size;
        fileType = mapFileTypeToEnum(file);
      }

      const slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { error } = await supabase
        .from('technical_materials')
        .insert({
          title: data.title,
          slug,
          description: data.description,
          file_url: fileUrl,
          file_size: fileSize,
          file_type: fileType,
          status: data.status
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-materials'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Material técnico criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar material técnico",
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
        status: data.status
      };

      if (file) {
        setUploading(true);
        updateData.file_url = await uploadFile(file);
        updateData.file_size = file.size;
        updateData.file_type = mapFileTypeToEnum(file);
      }

      const { error } = await supabase
        .from('technical_materials')
        .update(updateData)
        .eq('id', editingItem!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-materials'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Material técnico atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar material técnico",
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
        .from('technical_materials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-materials'] });
      toast({ title: "Material técnico excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir material técnico",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', category_id: '', status: 'draft' });
    setFile(null);
    setEditingItem(null);
  };

  const handleEdit = (material: TechnicalMaterial) => {
    setEditingItem(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      category_id: material.category_id || '',
      status: material.status
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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return <div className="p-6">Carregando materiais técnicos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Materiais Técnicos</h1>
          <p className="text-muted-foreground">Gerencie documentos e arquivos técnicos</p>
        </div>
      </div>

      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Materiais ({materials.length})</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Material Técnico' : 'Novo Material Técnico'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Arquivo</label>
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                      required={!editingItem}
                    />
                    {editingItem && !file && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Deixe em branco para manter o arquivo atual
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => (
              <Card key={material.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        {material.file_type && (
                          <Badge variant="outline" className="text-xs">
                            {material.file_type.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={
                      material.status === 'published' ? 'default' : 
                      material.status === 'draft' ? 'secondary' : 'outline'
                    }>
                      {material.status === 'published' ? 'Publicado' : 
                       material.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {material.description && (
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <HardDrive className="h-4 w-4 mr-2" />
                      {formatFileSize(material.file_size)}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Download className="h-4 w-4 mr-2" />
                      {material.download_count || 0} downloads
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <div className="text-xs text-muted-foreground">
                      {new Date(material.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(material.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este material?')) {
                            deleteMutation.mutate(material.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categorias ({categories.length})</h2>
            <Button onClick={() => refetchCategories()}>
              <Plus className="h-4 w-4 mr-2" />
              Gerenciar Categorias
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">{category.slug}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {category.description || "Sem descrição"}
                  </p>
                  
                  <div className="flex justify-between items-center pt-3">
                    <div className="text-xs text-muted-foreground">
                      {new Date(category.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMateriais;
