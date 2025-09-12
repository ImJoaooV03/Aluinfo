import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SupplierPageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [supplierId, setSupplierId] = useState<string>('')
  const [form, setForm] = useState({ title: '', slug: '', content: '' })

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      setLoading(true)
      try {
        const { data: supplier } = await supabase.from('suppliers').select('id, name, slug').eq('slug', slug).single()
        if (!supplier) return
        setSupplierId(supplier.id)
        const { data: page } = await supabase
          .from('supplier_pages')
          .select('*')
          .eq('supplier_id', supplier.id)
          .single()
        if (page) {
          setForm({ title: page.title, slug: page.slug, content: page.content || '' })
        } else {
          setForm({ title: supplier.name, slug: supplier.slug, content: '' })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const handleSave = async () => {
    if (!supplierId) return
    const payload = { supplier_id: supplierId, title: form.title, slug: form.slug, content: form.content, status: 'published' as any }
    const { data: exists } = await supabase.from('supplier_pages').select('id').eq('supplier_id', supplierId).maybeSingle()
    if (exists?.id) {
      await supabase.from('supplier_pages').update(payload).eq('supplier_id', supplierId)
    } else {
      await supabase.from('supplier_pages').insert(payload)
    }
    navigate('/admin/fornecedores')
  }

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar Página do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <Textarea rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


