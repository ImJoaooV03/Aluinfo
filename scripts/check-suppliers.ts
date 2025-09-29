import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSuppliers() {
  console.log('Checking suppliers...');
  
  try {
    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select('id, name, slug, status')
      .limit(10);
      
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Suppliers found:', suppliers?.length || 0);
    suppliers?.forEach(supplier => {
      console.log(`- ${supplier.name} (${supplier.slug}) - Status: ${supplier.status}`);
    });
    
    // Check specific supplier
    const { data: specificSupplier, error: specificError } = await supabase
      .from('suppliers')
      .select('id, name, slug, status')
      .eq('slug', '2m3d')
      .maybeSingle();
      
    console.log('\nSpecific supplier (2m3d):', specificSupplier);
    console.log('Error:', specificError);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkSuppliers();
