import { createClient } from '@supabase/supabase-js'

async function main() {
  const url = 'https://unvxhbgcoraoxfjhapja.supabase.co'
  const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudnhoYmdjb3Jhb3hmamhhcGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzYxNjIsImV4cCI6MjA3MTc1MjE2Mn0.UD5I6xuxqFr8jau7ZQ5mQCRcnOXieNup7iiuBwloLns'
  const supabase = createClient(url, anon, { auth: { persistSession: false } })
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@aluinfo.com',
    password: 'admin@aluinfo.com',
  })
  console.log('signIn data:', data)
  console.log('signIn error:', error)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


