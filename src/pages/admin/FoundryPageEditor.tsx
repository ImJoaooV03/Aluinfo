import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export default function FoundryPageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [foundryId, setFoundryId] = useState<string>('')
  const [form, setForm] = useState({ title: '', slug: '', content: '' })

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      setLoading(true)
      try {
        const { data: foundry } = await supabase.from('foundries').select('id, name, slug').eq('slug', slug).single()
        if (!foundry) return
        setFoundryId(foundry.id)
        const { data: page } = await supabase
          .from('foundry_pages')
          .select('*')
          .eq('foundry_id', foundry.id)
          .maybeSingle()
        if (page) {
          setForm({ title: page.title, slug: page.slug, content: page.content || '' })
        } else {
          setForm({ title: foundry.name, slug: foundry.slug, content: '' })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const handleSave = async () => {
    if (!foundryId) return
    const payload = { foundry_id: foundryId, title: form.title, slug: form.slug, content: form.content, status: 'published' as any }
    const { data: exists } = await supabase.from('foundry_pages').select('id').eq('foundry_id', foundryId).maybeSingle()
    if (exists?.id) {
      await supabase.from('foundry_pages').update(payload).eq('foundry_id', foundryId)
    } else {
      await supabase.from('foundry_pages').insert(payload)
    }
    navigate('/admin/fundicoes')
  }

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar Página da Fundição</CardTitle>
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
            <RichTextEditor 
              value={form.content} 
              onChange={(content) => setForm({ ...form, content })} 
              placeholder="Digite o conteúdo da página da fundição..."
            />
            <p className="text-sm text-muted-foreground">
              Dica: use o botão de imagem para inserir URLs públicas; arquivos locais podem ser enviados antes para o bucket "banners" ou "ebooks".
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
