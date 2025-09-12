import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateImageUrl } from "@/utils/httpsUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Building, Star, MapPin, Users, Mail, Phone, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupplierCategories } from "@/hooks/useSupplierCategories";
import { SupplierCategoryDialog } from "@/components/admin/SupplierCategoryDialog";

interface Supplier {
  id: string;
  name: string;
  slug: string;
  specialty: string | null;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  rating: number | null;
  employees_count: number | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  supplier_categories?: { name: string };
  categories?: { category_id: string; supplier_categories?: { name: string } }[];
}

export default function AdminFornecedores() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { categories, refetch: refetchCategories } = useSupplierCategories();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    description: "",
    logo_url: "",
    country: "Brasil",
    state: "",
    city: "",
    address: "",
    website: "",
    email: "",
    phone: "",
    rating: "",
    employees_count: "",
    category_id: "",
    status: "published" as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          supplier_categories!suppliers_category_id_fkey(name),
          categories:supplier_category_links(
            category_id,
            supplier_categories(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
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

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Os fornecedores associados ficarão sem categoria.')) return;

    try {
      const { error } = await supabase
        .from('supplier_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
      
      refetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
    
    let sanitizedLogoUrl = formData.logo_url;
    if (sanitizedLogoUrl) {
      const validatedUrl = validateImageUrl(sanitizedLogoUrl);
      if (!validatedUrl) {
        toast({
          title: "Erro",
          description: "URL do logo inválida ou insegura. Use apenas URLs HTTPS de fontes confiáveis.",
          variant: "destructive",
        });
        return;
      }
      sanitizedLogoUrl = validatedUrl;
    }
    
    try {
      const slug = generateSlug(formData.name);
      
      const supplierData = {
        name: formData.name,
        slug,
        specialty: formData.specialty || null,
        description: formData.description || null,
        logo_url: sanitizedLogoUrl,
        country: formData.country,
        state: formData.state || null,
        city: formData.city || null,
        address: formData.address || null,
        website: formData.website || null,
        email: formData.email || null,
        phone: formData.phone || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        employees_count: formData.employees_count ? parseInt(formData.employees_count) : null,
        category_id: formData.category_id || null,
        status: formData.status,
      };

      if (editingSupplier) {
        const { error } = await supabase
          .from('suppliers')
          .update(supplierData)
          .eq('id', editingSupplier.id);

        if (error) throw error;
        // Atualizar vínculos N:N
        const ids = ((formData as any).category_ids || []) as string[];
        if (ids.length) {
          await supabase.from('supplier_category_links').delete().eq('supplier_id', editingSupplier.id);
          const rows = ids.map((category_id) => ({ supplier_id: editingSupplier.id, category_id }));
          await supabase.from('supplier_category_links').insert(rows);
        }
        
        toast({
          title: "Sucesso",
          description: "Fornecedor atualizado com sucesso!",
        });
      } else {
        const { data, error } = await supabase
          .from('suppliers')
          .insert([supplierData])
          .select('id')
          .single();

        if (error) throw error;
        // Criar vínculos N:N
        const supplierId = (data as any)?.id as string;
        const ids = ((formData as any).category_ids || []) as string[];
        if (supplierId && ids.length) {
          const rows = ids.map((category_id) => ({ supplier_id: supplierId, category_id }));
          await supabase.from('supplier_category_links').insert(rows);
        }
        
        toast({
          title: "Sucesso",
          description: "Fornecedor criado com sucesso!",
        });
      }

      setDialogOpen(false);
      resetForm();
      loadSuppliers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      specialty: supplier.specialty || "",
      description: supplier.description || "",
      logo_url: supplier.logo_url || "",
      country: supplier.country || "Brasil",
      state: supplier.state || "",
      city: supplier.city || "",
      address: supplier.address || "",
      website: supplier.website || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      rating: supplier.rating?.toString() || "",
      employees_count: supplier.employees_count?.toString() || "",
      category_id: supplier.category_id || "",
      status: supplier.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fornecedor excluído com sucesso!",
      });
      
      loadSuppliers();
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
      name: "",
      specialty: "",
      description: "",
      logo_url: "",
      country: "Brasil",
      state: "",
      city: "",
      address: "",
      website: "",
      email: "",
      phone: "",
      rating: "",
      employees_count: "",
      category_id: "",
      status: "published",
    });
    setEditingSupplier(null);
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
          <h1 className="text-3xl font-bold">Gestão de Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie os fornecedores do portal
          </p>
        </div>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fornecedores ({suppliers.length})</h2>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSupplier 
                      ? "Atualize as informações do fornecedor" 
                      : "Preencha os dados para cadastrar um novo fornecedor"
                    }
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Empresa *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        placeholder="Ex: Equipamentos industriais"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Descrição da empresa e seus produtos/serviços"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_url">URL do Logo</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://exemplo.com/logo.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Ex: SP, RJ, MG"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="www.empresa.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contato@empresa.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Telefone (DDI, DDD e número)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={(formData as any).phone_ddi || ''}
                          onChange={(e) => setFormData({ ...formData, ...( { phone_ddi: e.target.value } as any) })}
                          placeholder="55"
                        />
                        <Input
                          value={(formData as any).phone_ddd || ''}
                          onChange={(e) => setFormData({ ...formData, ...( { phone_ddd: e.target.value } as any) })}
                          placeholder="11"
                        />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="99999-9999"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Avaliação (0-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employees_count">Nº de Funcionários</Label>
                      <Input
                        id="employees_count"
                        type="number"
                        min="1"
                        value={formData.employees_count}
                        onChange={(e) => setFormData({ ...formData, employees_count: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Categorias (múltiplas)</Label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const ids = (formData as any).category_ids || [];
                          const selected = ids.includes(category.id);
                          return (
                            <Button
                              key={category.id}
                              type="button"
                              variant={selected ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => {
                                  const current = ((prev as any).category_ids || []) as string[];
                                  const next = selected ? current.filter((id) => id !== category.id) : [...current, category.id];
                                  return { ...(prev as any), category_ids: next, category_id: (prev as any).category_id || category.id } as any;
                                });
                              }}
                            >
                              {category.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'draft' | 'published' | 'archived') => 
                        setFormData({ ...formData, status: value })
                      }
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

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingSupplier ? "Atualizar" : "Criar"} Fornecedor
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {supplier.logo_url && (
                        <img 
                          src={supplier.logo_url} 
                          alt={supplier.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        {supplier.supplier_categories && (
                          <Badge variant="outline" className="text-xs">
                            {supplier.supplier_categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(supplier.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supplier.specialty && (
                    <p className="text-sm text-muted-foreground">{supplier.specialty}</p>
                  )}
                  
                  <div className="space-y-2">
                    {(supplier.city || supplier.state) && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {[supplier.city, supplier.state].filter(Boolean).join(', ')}
                      </div>
                    )}
                    
                    {supplier.employees_count && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {supplier.employees_count} funcionários
                      </div>
                    )}

                    {supplier.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {supplier.rating}/5
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <div className="text-xs text-muted-foreground">
                      {new Date(supplier.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(supplier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`/admin/fornecedores/${supplier.slug}/pagina`, '_self')} title="Editar Página">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(supplier.id)}>
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
            <SupplierCategoryDialog onCategoryCreated={refetchCategories} />
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
                      onClick={() => handleDeleteCategory(category.id)}
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