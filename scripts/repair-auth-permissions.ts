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

  const sql = `
do $$ begin
  -- Garantir USAGE no schema auth para o papel do GoTrue
  begin
    execute 'grant usage on schema auth to supabase_auth_admin';
  exception when others then null; end;

  -- Garantir privilégios em tabelas, funções e sequências do schema auth
  begin
    execute 'grant select, insert, update, delete on all tables in schema auth to supabase_auth_admin';
  exception when others then null; end;

  begin
    execute 'grant usage, select on all sequences in schema auth to supabase_auth_admin';
  exception when others then null; end;

  begin
    execute 'grant execute on all functions in schema auth to supabase_auth_admin';
  exception when others then null; end;
end $$;
`

  await client.query(sql)
  await client.end()
  console.log('Permissões do schema auth revisadas para supabase_auth_admin')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


