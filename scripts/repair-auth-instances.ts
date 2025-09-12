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

  const countRes = await client.query<{ count: string }>(`select count(*)::int as count from auth.instances`)
  const count = Number(countRes.rows[0]?.count ?? 0)
  if (count === 0) {
    // Criar instância padrão esperada pelo GoTrue
    await client.query(`insert into auth.instances (id, uuid, raw_base_config, created_at, updated_at)
                        values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), '{}', now(), now())`)
    console.log('auth.instances: instância padrão criada')
  } else {
    console.log('auth.instances: já existe registro, nada a fazer')
  }

  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


