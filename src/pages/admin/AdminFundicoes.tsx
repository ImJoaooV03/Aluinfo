
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Factory, Star, MapPin, Phone, Mail, Globe, FileText } from "lucide-react";
import { useFoundries } from "@/hooks/useFoundries";
import { useFoundryCategories } from "@/hooks/useFoundryCategories";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

const AdminFundicoes = () => {
  const { foundries, createFoundry, updateFoundry, deleteFoundry } = useFoundries();
  const { categories, createCategory, updateCategory, deleteCategory, linkCategories } = useFoundryCategories();
  const { toast } = useToast();

  // Estados para fundições
  const [isFoundryDialogOpen, setIsFoundryDialogOpen] = useState(false);
  const [editingFoundry, setEditingFoundry] = useState<any>(null);
  const [foundryForm, setFoundryForm] = useState({
    name: "",
    slug: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    country: "Brasil",
    category_ids: [] as string[],
    status: "published" as const,
    logo_url: "",
  });

  // Estados para categorias
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const resetFoundryForm = () => {
    setFoundryForm({
      name: "",
      slug: "",
      description: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      country: "Brasil",
      category_ids: [],
      status: "published",
      logo_url: "",
    });
    setEditingFoundry(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
    });
    setEditingCategory(null);
  };

  const slugify = (s: string) => s
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const COUNTRIES = [
    { code: 'BR', name: 'Brasil', ddi: '55', emoji: '🇧🇷' },
    { code: 'AR', name: 'Argentina', ddi: '54', emoji: '🇦🇷' },
    { code: 'CL', name: 'Chile', ddi: '56', emoji: '🇨🇱' },
    { code: 'PY', name: 'Paraguai', ddi: '595', emoji: '🇵🇾' },
    { code: 'UY', name: 'Uruguai', ddi: '598', emoji: '🇺🇾' },
    { code: 'PT', name: 'Portugal', ddi: '351', emoji: '🇵🇹' },
    { code: 'ES', name: 'Espanha', ddi: '34', emoji: '🇪🇸' },
    { code: 'US', name: 'Estados Unidos', ddi: '1', emoji: '🇺🇸' },
    { code: 'MX', name: 'México', ddi: '52', emoji: '🇲🇽' },
    { code: 'DE', name: 'Alemanha', ddi: '49', emoji: '🇩🇪' },
    { code: 'IT', name: 'Itália', ddi: '39', emoji: '🇮🇹' },
    { code: 'FR', name: 'França', ddi: '33', emoji: '🇫🇷' },
    { code: 'CN', name: 'China', ddi: '86', emoji: '🇨🇳' },
    { code: 'JP', name: 'Japão', ddi: '81', emoji: '🇯🇵' },
    { code: 'IN', name: 'Índia', ddi: '91', emoji: '🇮🇳' },
    { code: 'CA', name: 'Canadá', ddi: '1', emoji: '🇨🇦' },
    { code: 'GB', name: 'Reino Unido', ddi: '44', emoji: '🇬🇧' },
  ];

  const countryToDDI = (name?: string) => {
    if (!name) return "55";
    const norm = name.toLowerCase().trim();
    const fromList = COUNTRIES.find(c => c.name.toLowerCase() === norm);
    if (fromList) return fromList.ddi;
    const alias: Record<string, string> = { 'brazil': '55', 'spain': '34', 'united states': '1', 'germany': '49', 'france': '33', 'italia': '39', 'japao': '81', 'india': '91', 'canada': '1', 'uk': '44', 'inglaterra': '44' };
    return alias[norm] || '55';
  };

  const formatPhone = (raw: string, country?: string) => {
    if (!raw) return "";
    const ddi = countryToDDI(country);
    const digits = raw.replace(/[^0-9]/g, "");
    let ddd = ""; let num = digits;
    if (digits.length >= 10) {
      ddd = digits.slice(-10, -8);
      num = digits.slice(-8);
    }
    if (num.length === 8) num = `${num.slice(0,4)}-${num.slice(4)}`;
    if (num.length === 9) num = `${num.slice(0,5)}-${num.slice(5)}`;
    return `+${ddi} ${ddd ? `(${ddd}) ` : ''}${num}`.trim();
  };

  const handleFoundrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const foundryData: any = {
      name: foundryForm.name,
      slug: foundryForm.slug || slugify(foundryForm.name),
      description: foundryForm.description || null,
      email: foundryForm.email || null,
      phone: foundryForm.phone || null,
      website: foundryForm.website || null,
      address: foundryForm.address || null,
      country: foundryForm.country || null,
      status: foundryForm.status,
      logo_url: foundryForm.logo_url || null,
    };

    try {
      let result;
      if (editingFoundry) {
        result = await updateFoundry(editingFoundry.id, foundryData);
      } else {
        result = await createFoundry(foundryData);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: editingFoundry ? "Fundição atualizada" : "Fundição criada",
        description: editingFoundry ? "A fundição foi atualizada com sucesso." : "A fundição foi criada com sucesso.",
      });

      // Salvar relações N:N
      const foundryId = (editingFoundry ? editingFoundry.id : result.data?.id) as string | undefined;
      if (foundryId) {
        await linkCategories(foundryId, foundryForm.category_ids);
      }

      setIsFoundryDialogOpen(false);
      resetFoundryForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar fundição",
        variant: "destructive",
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, categoryForm);
      } else {
        result = await createCategory(categoryForm);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: editingCategory ? "Categoria atualizada" : "Categoria criada",
        description: editingCategory ? "A categoria foi atualizada com sucesso." : "A categoria foi criada com sucesso.",
      });

      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar categoria",
        variant: "destructive",
      });
    }
  };

  const handleEditFoundry = (foundry: any) => {
    setFoundryForm({
      name: foundry.name,
      slug: foundry.slug,
      description: foundry.description || "",
      email: foundry.email || "",
      phone: foundry.phone || "",
      website: foundry.website || "",
      address: foundry.address || "",
      country: foundry.country || "Brasil",
      category_ids: (foundry.categories || []).map((c: any) => c.category_id),
      status: foundry.status || "published",
      logo_url: foundry.logo_url || "",
    });
    setEditingFoundry(foundry);
    setIsFoundryDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteFoundry = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta fundição?")) return;
    try {
      // Remove vínculos N:N primeiro para evitar bloqueios de RLS/consistência
      const { error: linksErr } = await supabase.from('foundry_category_links').delete().eq('foundry_id', id);
      if (linksErr) throw linksErr;
      const result = await deleteFoundry(id);
      if (result.error) throw new Error(result.error);
      toast({ title: "Fundição excluída", description: "A fundição foi excluída com sucesso." });
      // Otimização: remover imediatamente do estado local para refletir na UI
      // (o hook também vai refazer o fetch, garantindo consistência)
      // foundries é somente leitura aqui, então apenas aguardamos refetch implícito
    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Erro ao excluir fundição", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const result = await deleteCategory(id);
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir categoria",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Fundições</h2>
          <p className="text-muted-foreground">
            Gerencie fundições e suas categorias
          </p>
        </div>
      </div>

        <Tabs defaultValue="foundries" className="space-y-4">
          <TabsList>
            <TabsTrigger value="foundries">Fundições</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>

          <TabsContent value="foundries" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Fundições ({foundries.length})</h3>
              <Dialog open={isFoundryDialogOpen} onOpenChange={setIsFoundryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetFoundryForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Fundição
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingFoundry ? "Editar Fundição" : "Nova Fundição"}</DialogTitle>
                    <DialogDescription>
                      Preencha as informações da fundição.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleFoundrySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={foundryForm.name}
                        onChange={(e) => setFoundryForm({ ...foundryForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={foundryForm.description}
                        onChange={(e) => setFoundryForm({ ...foundryForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Campos removidos: Especialidade e Categoria única */}

                    <div>
                      <Label>Categorias adicionais (N:N)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((category) => {
                          const checked = foundryForm.category_ids.includes(category.id);
                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                setFoundryForm((prev) => ({
                                  ...prev,
                                  category_ids: checked
                                    ? prev.category_ids.filter((id) => id !== category.id)
                                    : [...prev.category_ids, category.id],
                                }));
                              }}
                              className={`px-2 py-1 rounded border text-xs ${checked ? 'bg-primary text-white border-primary' : 'bg-background'}`}
                            >
                              {category.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={foundryForm.email}
                          onChange={(e) => setFoundryForm({ ...foundryForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          placeholder="+55 (11) 99999-9999"
                          value={foundryForm.phone}
                          onChange={(e) => setFoundryForm({ ...foundryForm, phone: formatPhone(e.target.value, foundryForm.country) })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={foundryForm.website}
                        onChange={(e) => setFoundryForm({ ...foundryForm, website: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Endereço completo</Label>
                      <Input
                        id="address"
                        value={foundryForm.address}
                        onChange={(e) => setFoundryForm({ ...foundryForm, address: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>País</Label>
                      <Select
                        value={foundryForm.country}
                        onValueChange={(value) => setFoundryForm({ ...foundryForm, country: value, phone: formatPhone(foundryForm.phone, value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o país" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.name}>
                              {c.emoji} {c.name} (+{c.ddi})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Campos removidos: Número de Funcionários e Avaliação */}

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsFoundryDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingFoundry ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {foundries.map((foundry) => (
                <Card key={foundry.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Factory className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{foundry.specialty || 'Fundição'}</Badge>
                          {foundry.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{foundry.rating}</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-sm">{foundry.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs text-muted-foreground mb-3">
                      {foundry.city && foundry.state && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{foundry.city}, {foundry.state}</span>
                        </div>
                      )}
                      {foundry.contact_info?.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{foundry.contact_info.phone}</span>
                        </div>
                      )}
                      {foundry.contact_info?.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{foundry.contact_info.email}</span>
                        </div>
                      )}
                      {foundry.website && (
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{foundry.website}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(`/admin/fundicoes/${foundry.slug}/pagina`, '_self')} title="Editar Página">
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditFoundry(foundry)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteFoundry(foundry.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Categorias de Fundições ({categories.length})</h3>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetCategoryForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                    <DialogDescription>
                      Preencha as informações da categoria de fundição.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Nome *</Label>
                      <Input
                        id="category-name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category-slug">Slug *</Label>
                      <Input
                        id="category-slug"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category-description">Descrição</Label>
                      <Textarea
                        id="category-description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingCategory ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{category.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Slug: {category.slug}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-3 w-3" />
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
};

export default AdminFundicoes;
