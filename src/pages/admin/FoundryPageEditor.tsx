import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Suspense, lazy } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FoundryPageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [foundryId, setFoundryId] = useState<string>('')
  const [form, setForm] = useState({ title: '', slug: '', content: '' })
  const quillRef = useRef<any>(null)

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

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.onchange = async () => {
      const file = (input.files && input.files[0]) as File | undefined
      if (!file || !foundryId) return
      try {
        const ext = file.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const path = `foundry-pages/${foundryId}/${fileName}`
        const { error: uploadError } = await supabase.storage.from('banners').upload(path, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('banners').getPublicUrl(path)
        const quill = quillRef.current?.getEditor?.()
        const range = quill?.getSelection(true)
        if (quill && range) {
          quill.insertEmbed(range.index, 'image', data.publicUrl, 'user')
          quill.setSelection(range.index + 1)
        }
      } catch (e) {
        console.error('Upload de imagem falhou:', e)
      }
    }
    input.click()
  }

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        [{ align: [] }],
        ['clean']
      ],
      handlers: { image: handleImageUpload }
    }
  }), [foundryId])

  const QuillLazy = typeof window !== 'undefined' ? lazy(() => import('react-quill')) : null

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
            <div className="prose max-w-none">
              {QuillLazy ? (
                <Suspense fallback={<div className="text-sm text-muted-foreground">Carregando editor…</div>}>
                  <QuillLazy ref={quillRef as any} theme="snow" value={form.content} onChange={(val: string) => setForm({ ...form, content: val })} modules={quillModules} />
                </Suspense>
              ) : (
                <Textarea rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Dica: use o botão de imagem para inserir URLs públicas; arquivos locais podem ser enviados antes para o bucket “banners” ou “ebooks”.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


