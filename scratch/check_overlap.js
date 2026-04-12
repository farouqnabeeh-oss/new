const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOverlap() {
  const { data: products } = await supabase.from('products').select('id, name_ar, product_types(*), addon_groups(*)');
  
  for (const p of products) {
    const hasTableTypes = p.product_types && p.product_types.length > 0;
    const hasGroupTypes = p.addon_groups && p.addon_groups.some(g => g.group_type === 'Type' || g.group_type === 'types');
    
    if (hasTableTypes && hasGroupTypes) {
      console.log(`Product "${p.name_ar}" has BOTH product_types table entries AND an addon_group of type Type.`);
      console.log(`  Table Types:`, p.product_types.map(t => t.name_ar));
      console.log(`  Group Types:`, p.addon_groups.filter(g => g.group_type === 'Type' || g.group_type === 'types').map(g => g.name_ar));
    }
  }
}

checkOverlap();
