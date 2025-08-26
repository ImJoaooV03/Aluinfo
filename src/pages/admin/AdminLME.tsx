
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LMEIndicator {
  id: string;
  metal_name: string;
  metal_symbol: string;
  price: number;
  currency: string;
  unit: string;
  change_amount: number | null;
  change_percent: number | null;
  timestamp: string;
  created_at: string;
}

const AdminLME = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LMEIndicator | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    metal_name: '',
    metal_symbol: '',
    price: '',
    currency: 'USD',
    unit: 'tonne',
    change_amount: '',
    change_percent: ''
  });

  const { data: indicators = [], isLoading } = useQuery({
    queryKey: ['admin-lme'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lme_indicators')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as LMEIndicator[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('lme_indicators')
        .insert({
          metal_name: data.metal_name,
          metal_symbol: data.metal_symbol.toUpperCase(),
          price: parseFloat(data.price),
          currency: data.currency,
          unit: data.unit,
          change_amount: data.change_amount ? parseFloat(data.change_amount) : null,
          change_percent: data.change_percent ? parseFloat(data.change_percent) : null,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lme'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Indicador LME criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('lme_indicators')
        .update({
          metal_name: data.metal_name,
          metal_symbol: data.metal_symbol.toUpperCase(),
          price: parseFloat(data.price),
          currency: data.currency,
          unit: data.unit,
          change_amount: data.change_amount ? parseFloat(data.change_amount) : null,
          change_percent: data.change_percent ? parseFloat(data.change_percent) : null,
          timestamp: new Date().toISOString()
        })
        .eq('id', editingItem!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lme'] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Indicador LME atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lme_indicators')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lme'] });
      toast({ title: "Indicador LME excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      metal_name: '',
      metal_symbol: '',
      price: '',
      currency: 'USD',
      unit: 'tonne',
      change_amount: '',
      change_percent: ''
    });
    setEditingItem(null);
  };

  const handleEdit = (indicator: LMEIndicator) => {
    setEditingItem(indicator);
    setFormData({
      metal_name: indicator.metal_name,
      metal_symbol: indicator.metal_symbol,
      price: indicator.price.toString(),
      currency: indicator.currency,
      unit: indicator.unit,
      change_amount: indicator.change_amount?.toString() || '',
      change_percent: indicator.change_percent?.toString() || ''
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

  const renderChangeIndicator = (changePercent: number | null) => {
    if (!changePercent) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    if (changePercent > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (changePercent < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(price);
  };

  if (isLoading) {
    return <div className="p-6">Carregando indicadores LME...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Indicadores LME</h1>
          <p className="text-muted-foreground">Gerencie cotações e indicadores de metais</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Indicador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Indicador LME' : 'Novo Indicador LME'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Metal</label>
                  <Input
                    value={formData.metal_name}
                    onChange={(e) => setFormData({ ...formData, metal_name: e.target.value })}
                    placeholder="Alumínio"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Símbolo</label>
                  <Input
                    value={formData.metal_symbol}
                    onChange={(e) => setFormData({ ...formData, metal_symbol: e.target.value.toUpperCase() })}
                    placeholder="AL"
                    maxLength={5}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Preço</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Moeda</label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="BRL">BRL</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Unidade</label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tonne">Tonelada</SelectItem>
                      <SelectItem value="kg">Quilograma</SelectItem>
                      <SelectItem value="lb">Libra</SelectItem>
                      <SelectItem value="oz">Onça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Variação (Valor)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.change_amount}
                    onChange={(e) => setFormData({ ...formData, change_amount: e.target.value })}
                    placeholder="+25.50 ou -15.30"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Variação (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.change_percent}
                    onChange={(e) => setFormData({ ...formData, change_percent: e.target.value })}
                    placeholder="+2.5 ou -1.8"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingItem ? 'Atualizar' : 'Criar'}
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
          <CardTitle>Cotações Atuais ({indicators.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metal</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Variação %</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indicators.map((indicator) => (
                <TableRow key={indicator.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{indicator.metal_name}</div>
                      <Badge variant="outline" className="text-xs">
                        {indicator.metal_symbol}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatPrice(indicator.price, indicator.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      por {indicator.unit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {renderChangeIndicator(indicator.change_percent)}
                      <span className={
                        !indicator.change_amount ? 'text-muted-foreground' :
                        indicator.change_amount > 0 ? 'text-green-600' : 'text-red-600'
                      }>
                        {indicator.change_amount ? 
                          `${indicator.change_amount > 0 ? '+' : ''}${indicator.change_amount.toFixed(2)}` 
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={
                      !indicator.change_percent ? 'text-muted-foreground' :
                      indicator.change_percent > 0 ? 'text-green-600' : 'text-red-600'
                    }>
                      {indicator.change_percent ? 
                        `${indicator.change_percent > 0 ? '+' : ''}${indicator.change_percent.toFixed(2)}%` 
                        : 'N/A'
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(indicator.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(indicator)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este indicador?')) {
                            deleteMutation.mutate(indicator.id);
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

export default AdminLME;
