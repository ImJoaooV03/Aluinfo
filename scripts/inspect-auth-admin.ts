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

  const user = await client.query(
    `select id, instance_id, email, email_confirmed_at, is_sso_user, banned_until,
            created_at, updated_at, confirmation_sent_at, recovery_sent_at,
            (encrypted_password is not null) as has_password,
            length(encrypted_password) as password_len,
            aud, role
       from auth.users where lower(email)=lower('admin@aluinfo.com')`
  )
  console.log('auth.users:', user.rows)

  const inst = await client.query('select id from auth.instances limit 1')
  console.log('auth.instances:', inst.rows)

  const cfg = await client.query('select * from auth.configs limit 1')
  console.log('auth.configs:', cfg.rows)

  const profile = await client.query(
    `select user_id, email, role, created_at, updated_at from public.profiles where lower(email)=lower('admin@aluinfo.com')`
  )
  console.log('public.profiles:', profile.rows)

  // Verificar tabela de migrações do auth
  try {
    const mig = await client.query('select count(*) from auth.schema_migrations')
    console.log('auth.schema_migrations count:', mig.rows)
  } catch (e) {
    console.error('auth.schema_migrations missing:', (e as Error).message)
  }

  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


