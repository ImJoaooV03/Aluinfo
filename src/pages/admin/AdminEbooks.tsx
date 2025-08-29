
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  Star,
  Download
} from "lucide-react";
import { Ebook } from "@/hooks/useEbooks";

const AdminEbooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category_id: "",
    price: "",
    pages_count: "",
    reading_time: "",
    status: "published"
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [ebookFile, setEbookFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEbooks();
    fetchCategories();
  }, []);

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ebookFile && !editingEbook) {
      toast({
        title: "Erro",
        description: "Selecione o arquivo do e-book",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      let coverImageUrl = editingEbook?.cover_image_url || null;
      let fileUrl = editingEbook?.file_url || "";

      // Upload da capa se fornecida
      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile, 'ebooks');
      }

      // Upload do arquivo do e-book se fornecido
      if (ebookFile) {
        fileUrl = await uploadFile(ebookFile, 'ebooks');
      }

      const slug = generateSlug(formData.title);
      
      const ebookData = {
        title: formData.title,
        slug,
        author: formData.author,
        description: formData.description || null,
        cover_image_url: coverImageUrl,
        file_url: fileUrl,
        category_id: formData.category_id || null,
        price: formData.price ? parseFloat(formData.price) : null,
        pages_count: formData.pages_count ? parseInt(formData.pages_count) : null,
        reading_time: formData.reading_time ? parseInt(formData.reading_time) : null,
        status: formData.status
      };

      let result;
      if (editingEbook) {
        result = await supabase
          .from('ebooks')
          .update(ebookData)
          .eq('id', editingEbook.id);
      } else {
        result = await supabase
          .from('ebooks')
          .insert([ebookData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Sucesso",
        description: `E-book ${editingEbook ? 'atualizado' : 'criado'} com sucesso!`,
      });

      setDialogOpen(false);
      resetForm();
      fetchEbooks();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    setEditingEbook(ebook);
    setFormData({
      title: ebook.title,
      author: ebook.author,
      description: ebook.description || "",
      category_id: ebook.category_id || "",
      price: ebook.price?.toString() || "",
      pages_count: ebook.pages_count?.toString() || "",
      reading_time: ebook.reading_time?.toString() || "",
      status: ebook.status
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este e-book?')) return;

    try {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "E-book excluído com sucesso!",
      });

      fetchEbooks();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category_id: "",
      price: "",
      pages_count: "",
      reading_time: "",
      status: "published"
    });
    setCoverFile(null);
    setEbookFile(null);
    setEditingEbook(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      archived: "outline"
    } as const;

    const labels = {
      published: "Publicado",
      draft: "Rascunho", 
      archived: "Arquivado"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar E-books</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo E-book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEbook ? 'Editar E-book' : 'Criar Novo E-book'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({...prev, author: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({...prev, category_id: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    placeholder="0.00 (gratuito)"
                  />
                </div>
                <div>
                  <Label htmlFor="pages">Páginas</Label>
                  <Input
                    id="pages"
                    type="number"
                    min="1"
                    value={formData.pages_count}
                    onChange={(e) => setFormData(prev => ({...prev, pages_count: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="reading_time">Tempo de Leitura (min)</Label>
                  <Input
                    id="reading_time"
                    type="number"
                    min="1"
                    value={formData.reading_time}
                    onChange={(e) => setFormData(prev => ({...prev, reading_time: e.target.value}))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cover">Capa do E-book</Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                  {editingEbook?.cover_image_url && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Capa atual: {editingEbook.cover_image_url.split('/').pop()}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="file">Arquivo do E-book *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.epub,.mobi"
                    onChange={(e) => setEbookFile(e.target.files?.[0] || null)}
                    required={!editingEbook}
                  />
                  {editingEbook?.file_url && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Arquivo atual: {editingEbook.file_url.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      {editingEbook ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    editingEbook ? 'Atualizar E-book' : 'Criar E-book'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de E-books</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ebooks.map((ebook) => (
                <TableRow key={ebook.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {ebook.cover_image_url ? (
                        <img 
                          src={ebook.cover_image_url} 
                          alt={ebook.title}
                          className="w-8 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-8 h-10 bg-muted rounded flex items-center justify-center">
                          <FileText className="h-4 w-4" />
                        </div>
                      )}
                      <span>{ebook.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{ebook.author}</TableCell>
                  <TableCell>{getStatusBadge(ebook.status)}</TableCell>
                  <TableCell>
                    {ebook.price ? `R$ ${ebook.price.toFixed(2)}` : 'Gratuito'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{ebook.download_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{ebook.rating || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ebook)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(ebook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {ebooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum e-book encontrado. Crie o primeiro e-book para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEbooks;
