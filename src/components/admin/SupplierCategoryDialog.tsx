
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tags, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SupplierCategory } from "@/hooks/useSupplierCategories";

interface SupplierCategoryDialogProps {
  onCategoryCreated: () => void;
  category?: SupplierCategory | null;
  trigger?: React.ReactNode;
}

export const SupplierCategoryDialog = ({ onCategoryCreated, category, trigger }: SupplierCategoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
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
      
      // Check if slug exists (only if creating new or changing name)
      if (!category || category.name !== formData.name) {
        const { data: existing } = await supabase
          .from('supplier_categories')
          .select('id')
          .eq('slug', slug)
          .single();
          
        if (existing && (!category || existing.id !== category.id)) {
          toast({
            title: "Erro",
            description: "Já existe uma categoria com esse nome",
            variant: "destructive",
          });
          return;
        }
      }

      const categoryData = {
        name: formData.name,
        slug,
        description: formData.description || null,
      };

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('supplier_categories')
          .update(categoryData)
          .eq('id', category.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from('supplier_categories')
          .insert([categoryData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso!",
        });
      }

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else if (!open) {
      setFormData({ name: "", description: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Tags className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {category 
              ? "Atualize as informações da categoria de fornecedores"
              : "Crie uma nova categoria para organizar os fornecedores"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Equipamentos, Materiais, Ferramentas"
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
              {category ? "Atualizar" : "Criar"} Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
