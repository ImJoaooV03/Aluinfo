import { useState } from "react";
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
import { Plus, Edit, Trash2, Upload, Calendar, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  venue: string | null;
  event_date: string;
  price: number | null;
  max_attendees: number | null;
  website_url: string | null;
  registration_url: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

const AdminEventos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    venue: '',
    event_date: '',
    price: '',
    max_attendees: '',
    website_url: '',
    registration_url: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  const { categories, refetch: refetchCategories } = useCategories();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      return data as Event[];
    }
  });

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `events/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      let imageUrl = null;

      if (file) {
        setUploading(true);
        imageUrl = await uploadFile(file);
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
        .from('events')
        .insert({
          title: data.title,
          slug,
          description: data.description,
          image_url: imageUrl,
          location: data.location,
          venue: data.venue,
          event_date: data.event_date,
          price: data.price ? parseFloat(data.price) : null,
          max_attendees: data.max_attendees ? parseInt(data.max_attendees) : null,
          website_url: data.website_url,
          registration_url: data.registration_url,
          status: data.status
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Evento criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar evento",
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
        location: data.location,
        venue: data.venue,
        event_date: data.event_date,
        price: data.price ? parseFloat(data.price) : null,
        max_attendees: data.max_attendees ? parseInt(data.max_attendees) : null,
        website_url: data.website_url,
        registration_url: data.registration_url,
        status: data.status
      };

      if (file) {
        setUploading(true);
        updateData.image_url = await uploadFile(file);
      }

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', editingItem!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Evento atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar evento",
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
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: "Evento excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      venue: '',
      event_date: '',
      price: '',
      max_attendees: '',
      website_url: '',
      registration_url: '',
      category_id: '',
      status: 'draft'
    });
    setFile(null);
    setEditingItem(null);
  };

  const handleEdit = (event: Event) => {
    setEditingItem(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      venue: event.venue || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      price: event.price?.toString() || '',
      max_attendees: event.max_attendees?.toString() || '',
      website_url: event.website_url || '',
      registration_url: event.registration_url || '',
      category_id: '',
      status: event.status
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

  if (isLoading) {
    return <div className="p-6">Carregando eventos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Eventos</h1>
          <p className="text-muted-foreground">Gerencie eventos e conferências</p>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Eventos ({events.length})</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Evento' : 'Novo Evento'}
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
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Local</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="São Paulo, SP"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Venue</label>
                      <Input
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        placeholder="Centro de Convenções"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Data e Hora</label>
                      <Input
                        type="datetime-local"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Preço (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Max. Participantes</label>
                      <Input
                        type="number"
                        value={formData.max_attendees}
                        onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Site do Evento</label>
                      <Input
                        type="url"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        placeholder="https://exemplo.com"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">URL de Inscrição</label>
                      <Input
                        type="url"
                        value={formData.registration_url}
                        onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                        placeholder="https://inscricoes.exemplo.com"
                      />
                    </div>
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
                    <label className="text-sm font-medium">Imagem do Evento</label>
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept="image/*"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {event.image_url && (
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        {event.venue && (
                          <p className="text-sm text-muted-foreground">{event.venue}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={
                      event.status === 'published' ? 'default' : 
                      event.status === 'draft' ? 'secondary' : 'outline'
                    }>
                      {event.status === 'published' ? 'Publicado' : 
                       event.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.event_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {event.price ? `R$ ${event.price.toFixed(2)}` : 'Gratuito'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este evento?')) {
                            deleteMutation.mutate(event.id);
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

export default AdminEventos;