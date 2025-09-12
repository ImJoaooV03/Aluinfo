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

  // Descobrir colunas de auth.users
  const colsRes = await client.query<{ column_name: string }>(
    "select column_name from information_schema.columns where table_schema = 'auth' and table_name = 'users'"
  )
  const hasInstanceId = colsRes.rows.some((r) => r.column_name === 'instance_id')
  const hasEmailConfirmedAt = colsRes.rows.some((r) => r.column_name === 'email_confirmed_at')
  const hasUpdatedAt = colsRes.rows.some((r) => r.column_name === 'updated_at')
  const hasAud = colsRes.rows.some((r) => r.column_name === 'aud')
  const hasRole = colsRes.rows.some((r) => r.column_name === 'role')

  // Pegar instance_id válido
  let instanceId: string | null = null
  if (hasInstanceId) {
    const instRes = await client.query<{ id: string }>('select id from auth.instances limit 1')
    instanceId = instRes.rows[0]?.id ?? null
  }

  // Atualizar o usuário alvo
  const updates: string[] = []
  if (hasInstanceId && instanceId) updates.push(`instance_id = '${instanceId}'`)
  if (hasEmailConfirmedAt) updates.push('email_confirmed_at = now()')
  if (hasUpdatedAt) updates.push('updated_at = now()')
  if (hasAud) updates.push("aud = 'authenticated'")
  if (hasRole) updates.push("role = 'authenticated'")

  const setClause = updates.length ? 'set ' + updates.join(', ') : ''
  if (setClause) {
    await client.query(`update auth.users ${setClause} where lower(email) = lower('admin@aluinfo.com')`)
  }

  await client.end()
  console.log('Reparo de auth.users concluído para admin@aluinfo.com')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


