
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Factory, Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useFoundries } from "@/hooks/useFoundries";
import { useFoundryCategories } from "@/hooks/useFoundryCategories";
import { useToast } from "@/hooks/use-toast";

const AdminFundicoes = () => {
  const { foundries, createFoundry, updateFoundry, deleteFoundry } = useFoundries();
  const { categories, createCategory, updateCategory, deleteCategory } = useFoundryCategories();
  const { toast } = useToast();

  // Estados para fundições
  const [isFoundryDialogOpen, setIsFoundryDialogOpen] = useState(false);
  const [editingFoundry, setEditingFoundry] = useState<any>(null);
  const [foundryForm, setFoundryForm] = useState({
    name: "",
    slug: "",
    description: "",
    specialty: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "Brasil",
    employees_count: "",
    rating: "",
    category_id: "",
    status: "published" as const,
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
      specialty: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "Brasil",
      employees_count: "",
      rating: "",
      category_id: "",
      status: "published",
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

  const handleFoundrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const foundryData = {
      ...foundryForm,
      employees_count: foundryForm.employees_count ? parseInt(foundryForm.employees_count) : null,
      rating: foundryForm.rating ? parseFloat(foundryForm.rating) : null,
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
      specialty: foundry.specialty || "",
      email: foundry.email || "",
      phone: foundry.phone || "",
      website: foundry.website || "",
      address: foundry.address || "",
      city: foundry.city || "",
      state: foundry.state || "",
      country: foundry.country || "Brasil",
      employees_count: foundry.employees_count?.toString() || "",
      rating: foundry.rating?.toString() || "",
      category_id: foundry.category_id || "",
      status: foundry.status || "published",
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
      const result = await deleteFoundry(id);
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Fundição excluída",
        description: "A fundição foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir fundição",
        variant: "destructive",
      });
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
    <AdminLayout>
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
                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                          id="slug"
                          value={foundryForm.slug}
                          onChange={(e) => setFoundryForm({ ...foundryForm, slug: e.target.value })}
                          required
                        />
                      </div>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specialty">Especialidade</Label>
                        <Input
                          id="specialty"
                          value={foundryForm.specialty}
                          onChange={(e) => setFoundryForm({ ...foundryForm, specialty: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={foundryForm.category_id} onValueChange={(value) => setFoundryForm({ ...foundryForm, category_id: value })}>
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
                          value={foundryForm.phone}
                          onChange={(e) => setFoundryForm({ ...foundryForm, phone: e.target.value })}
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

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={foundryForm.city}
                          onChange={(e) => setFoundryForm({ ...foundryForm, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={foundryForm.state}
                          onChange={(e) => setFoundryForm({ ...foundryForm, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">País</Label>
                        <Input
                          id="country"
                          value={foundryForm.country}
                          onChange={(e) => setFoundryForm({ ...foundryForm, country: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employees_count">Número de Funcionários</Label>
                        <Input
                          id="employees_count"
                          type="number"
                          value={foundryForm.employees_count}
                          onChange={(e) => setFoundryForm({ ...foundryForm, employees_count: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Avaliação (0-5)</Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={foundryForm.rating}
                          onChange={(e) => setFoundryForm({ ...foundryForm, rating: e.target.value })}
                        />
                      </div>
                    </div>

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
                      {foundry.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{foundry.phone}</span>
                        </div>
                      )}
                      {foundry.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{foundry.email}</span>
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
    </AdminLayout>
  );
};

export default AdminFundicoes;
