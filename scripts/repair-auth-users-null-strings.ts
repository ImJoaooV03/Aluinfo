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
  -- Alguns builds do GoTrue falham ao escanear NULL em colunas string
  -- Ajustar defaults e backfill para strings vazias
  begin
    alter table auth.users alter column email_change set default '';
  exception when others then null; end;
  update auth.users set email_change = '' where email_change is null;

  begin
    alter table auth.users alter column email_change_token_new set default '';
  exception when others then null; end;
  update auth.users set email_change_token_new = '' where email_change_token_new is null;

  begin
    alter table auth.users alter column confirmation_token set default '';
  exception when others then null; end;
  update auth.users set confirmation_token = '' where confirmation_token is null;

  begin
    alter table auth.users alter column recovery_token set default '';
  exception when others then null; end;
  update auth.users set recovery_token = '' where recovery_token is null;
end $$;`

  await client.query(sql)
  await client.end()
  console.log('Colunas string em auth.users normalizadas para evitar NULL')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


