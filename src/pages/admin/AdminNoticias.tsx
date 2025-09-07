import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateImageUrl, enforceHttps } from "@/utils/httpsUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Tags, Calendar, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNewsCategories } from "@/hooks/useNewsCategories";

interface CategoryDialogProps {
  onCategoryCreated: () => void;
}

const CategoryDialog = ({ onCategoryCreated }: CategoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = generateSlug(formData.name);
      
      // Check if slug already exists
      const { data: existing } = await supabase
        .from('news_categories')
        .select('id')
        .eq('slug', slug)
        .single();
        
      if (existing) {
        toast({
          title: "Erro",
          description: "Já existe uma categoria com esse nome",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('news_categories')
        .insert([{
          name: formData.name,
          slug,
          description: formData.description || null,
        }]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });

      setIsOpen(false);
      setFormData({ name: "", description: "" });
      onCategoryCreated();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tags className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria para organizar as notícias
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Tecnologia, Mercado, Sustentabilidade"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Descrição (opcional)</Label>
            <Textarea
              id="category-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição da categoria"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
  news_categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function AdminNoticias() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useNewsCategories();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    category_id: "",
    status: "draft" as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    loadNews();

    // Set up real-time subscription for news updates
    const channel = supabase
      .channel('admin-news-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        (payload) => {
          console.log('News change detected:', payload);
          loadNews(); // Reload news to get updated view counts
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for admin news');
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
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

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"? As notícias desta categoria ficarão sem categoria.`)) return;

    try {
      const { error } = await supabase
        .from('news_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
      
      refetchCategories();
      loadNews(); // Reload news to update category display
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize image URL
    let sanitizedImageUrl = formData.featured_image_url;
    if (sanitizedImageUrl) {
      const validatedUrl = validateImageUrl(sanitizedImageUrl);
      if (!validatedUrl) {
        toast({
          title: "Erro",
          description: "URL da imagem inválida ou insegura. Use apenas URLs HTTPS de fontes confiáveis.",
          variant: "destructive",
        });
        return;
      }
      sanitizedImageUrl = validatedUrl;
    }
    
    try {
      const slug = generateSlug(formData.title);
      const now = new Date().toISOString();
      
      const newsData = {
        ...formData,
        featured_image_url: sanitizedImageUrl,
        slug,
        published_at: formData.status === 'published' ? now : null,
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Notícia atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Notícia criada com sucesso!",
        });
      }

      setDialogOpen(false);
      resetForm();
      loadNews();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt || "",
      content: newsItem.content,
      featured_image_url: newsItem.featured_image_url || "",
      category_id: newsItem.category_id || "",
      status: newsItem.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Notícia excluída com sucesso!",
      });
      
      loadNews();
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
      excerpt: "",
      content: "",
      featured_image_url: "",
      category_id: "",
      status: "draft",
    });
    setEditingNews(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      published: "default",
      draft: "secondary",
      archived: "destructive",
    };
    
    const labels: Record<string, string> = {
      published: "Publicado",
      draft: "Rascunho", 
      archived: "Arquivado",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Notícias</h1>
          <p className="text-muted-foreground">
            Gerencie as notícias do portal
          </p>
        </div>
      </div>

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList>
          <TabsTrigger value="news">Notícias</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Notícias ({news.length})</h2>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Notícia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNews ? "Editar Notícia" : "Nova Notícia"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingNews 
                      ? "Atualize as informações da notícia" 
                      : "Preencha os dados para criar uma nova notícia"
                    }
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Digite o conteúdo da notícia..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featured_image">URL da Imagem</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image_url}
                      onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}
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

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingNews ? "Atualizar" : "Criar"} Notícia
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((newsItem) => (
              <Card key={newsItem.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {newsItem.featured_image_url ? (
                        <img 
                          src={newsItem.featured_image_url} 
                          alt={newsItem.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{newsItem.title}</CardTitle>
                        {newsItem.news_categories && (
                          <Badge variant="outline" className="text-xs">
                            {newsItem.news_categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(newsItem.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {newsItem.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{newsItem.excerpt}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-2" />
                      {newsItem.view_count || 0} visualizações
                    </div>
                    
                    {newsItem.published_at && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(newsItem.published_at).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <div className="text-xs text-muted-foreground">
                      {new Date(newsItem.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(newsItem)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(newsItem.id)}>
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
            <CategoryDialog onCategoryCreated={refetchCategories} />
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
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}