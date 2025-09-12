import { Client } from 'pg'

async function main() {
  const dbPassword = process.env.DB_PWD
  if (!dbPassword) {
    console.error('Faltou DB_PWD no ambiente')
    process.exit(1)
  }

  const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.unvxhbgcoraoxfjhapja.supabase.co:5432/postgres`
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  await client.connect()

  const cats = await client.query("select id from public.foundry_categories order by name limit 1")
  const catId = cats.rows[0]?.id || null

  const upsert = `
insert into public.foundries (id, name, slug, specialty, description, country, state, city, address, website, rating, employees_count, category_id, status, created_at, updated_at)
values (
  gen_random_uuid(),
  'Fundição Exemplo',
  'fundicao-exemplo',
  'Alumínio',
  'Fundição de demonstração para testes.',
  'Brasil', 'SP', 'São Paulo', 'Rua Exemplo, 123', 'https://exemplo.com',
  4.5, 120,
  ${catId ? `'${catId}'` : 'NULL'},
  'published', now(), now()
)
on conflict (slug) do update set
  name = excluded.name,
  specialty = excluded.specialty,
  description = excluded.description,
  website = excluded.website,
  rating = excluded.rating,
  employees_count = excluded.employees_count,
  category_id = excluded.category_id,
  status = excluded.status,
  updated_at = now();
`

  await client.query(upsert)
  await client.end()
  console.log('Seed de uma fundição publicado com sucesso')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


