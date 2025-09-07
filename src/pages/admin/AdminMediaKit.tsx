import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, FileText, Download, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  useMediaKits, 
  useCreateMediaKit, 
  useUpdateMediaKit, 
  useDeleteMediaKit,
  type MediaKit 
} from "@/hooks/useMediaKits";

const AdminMediaKit = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [editingMediaKit, setEditingMediaKit] = useState<MediaKit | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    status: "published" as "draft" | "published"
  });

  const { data: mediaKits = [], isLoading } = useMediaKits();
  const createMediaKit = useCreateMediaKit();
  const updateMediaKit = useUpdateMediaKit();
  const deleteMediaKit = useDeleteMediaKit();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('media_kits')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media_kits')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, file_url: data.publicUrl }));
      toast.success("Arquivo enviado com sucesso!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erro ao enviar arquivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file_url) {
      toast.error("Título e arquivo são obrigatórios.");
      return;
    }

    try {
      if (editingMediaKit) {
        await updateMediaKit.mutateAsync({
          id: editingMediaKit.id,
          ...formData
        });
        setEditingMediaKit(null);
      } else {
        await createMediaKit.mutateAsync(formData);
      }
      
      setFormData({
        title: "",
        description: "",
        file_url: "",
        status: "published"
      });
    } catch (error) {
      console.error("Error saving media kit:", error);
    }
  };

  const handleEdit = (mediaKit: MediaKit) => {
    setEditingMediaKit(mediaKit);
    setFormData({
      title: mediaKit.title,
      description: mediaKit.description || "",
      file_url: mediaKit.file_url,
      status: mediaKit.status
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este mídia kit?")) {
      await deleteMediaKit.mutateAsync(id);
    }
  };

  const cancelEdit = () => {
    setEditingMediaKit(null);
    setFormData({
      title: "",
      description: "",
      file_url: "",
      status: "published"
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Mídia Kit</h1>
        <p className="text-muted-foreground">
          Adicione e gerencie os mídia kits disponíveis para download.
        </p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingMediaKit ? "Editar Mídia Kit" : "Novo Mídia Kit"}
          </CardTitle>
          <CardDescription>
            {editingMediaKit 
              ? "Atualize as informações do mídia kit" 
              : "Adicione um novo mídia kit para download"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Mídia Kit Portal Aluinfo 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do mídia kit..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Arquivo PDF*</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={isUploading}
                />
                {isUploading && <span className="text-sm text-muted-foreground">Enviando...</span>}
              </div>
              {formData.file_url && (
                <p className="text-sm text-green-600">✓ Arquivo carregado com sucesso</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={createMediaKit.isPending || updateMediaKit.isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                {editingMediaKit ? "Atualizar" : "Salvar"} Mídia Kit
              </Button>
              
              {editingMediaKit && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Mídia Kits */}
      <Card>
        <CardHeader>
          <CardTitle>Mídia Kits Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os mídia kits disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mediaKits.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum mídia kit cadastrado ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {mediaKits.map((mediaKit) => (
                <div key={mediaKit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{mediaKit.title}</h3>
                      {mediaKit.description && (
                        <p className="text-sm text-muted-foreground">{mediaKit.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={mediaKit.status === 'published' ? 'default' : 'secondary'}>
                          {mediaKit.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(mediaKit.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(mediaKit.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(mediaKit)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(mediaKit.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMediaKit;