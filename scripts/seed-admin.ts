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

  // Descobrir colunas existentes em auth.users
  const colsRes = await client.query<{
    column_name: string
  }>(
    "select column_name from information_schema.columns where table_schema = 'auth' and table_name = 'users'"
  )
  const existing = new Set(colsRes.rows.map((r) => r.column_name))

  // Campos base e valores
  const columnOrder = [
    'id',
    'instance_id',
    'email',
    'encrypted_password',
    'email_confirmed_at',
    'created_at',
    'updated_at',
    'aud',
    'role',
    'raw_app_meta_data',
    'raw_user_meta_data',
    'is_super_admin',
    'confirmation_token',
  ] as const

  const now = 'now()'
  const valuesMap: Record<string, string> = {
    id: 'gen_random_uuid()',
    instance_id: "'00000000-0000-0000-0000-000000000000'",
    email: "'admin@aluinfo.com'",
    encrypted_password: "crypt('admin@aluinfo.com', gen_salt('bf'))",
    email_confirmed_at: now,
    created_at: now,
    updated_at: now,
    aud: "'authenticated'",
    role: "'authenticated'",
    raw_app_meta_data: "'{" + '"provider":"email","providers":["email"]' + "}'",
    raw_user_meta_data: "'{}'",
    is_super_admin: 'false',
    confirmation_token: "''",
  }

  const insertableCols = columnOrder.filter((c) => existing.has(c))
  const insertValues = insertableCols.map((c) => valuesMap[c]).join(',\n      ')
  const insertCols = insertableCols.join(', ')

  const sql = `
do $$
declare
  v_user_id uuid;
begin
  begin
    perform 1 from pg_extension where extname = 'pgcrypto';
    if not found then
      create extension if not exists pgcrypto;
    end if;
  exception when others then null; end;

  select id into v_user_id from auth.users where email = 'admin@aluinfo.com' limit 1;

  if v_user_id is null then
    insert into auth.users (${insertCols})
    values (
      ${insertValues}
    ) returning id into v_user_id;
  else
    update auth.users
       set encrypted_password = crypt('admin@aluinfo.com', gen_salt('bf')),
           updated_at = now()
     where id = v_user_id;
  end if;

  insert into public.profiles (user_id, email, full_name, role)
  values (v_user_id, 'admin@aluinfo.com', 'Administrador', 'admin')
  on conflict (user_id) do nothing;

  if exists (select 1 from public.profiles where user_id = v_user_id and role != 'admin') then
    delete from public.profiles where user_id = v_user_id;
    insert into public.profiles (user_id, email, full_name, role)
    values (v_user_id, 'admin@aluinfo.com', 'Administrador', 'admin');
  end if;
end $$;`

  await client.query(sql)
  await client.end()
  console.log('Seed de admin executado com sucesso')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


