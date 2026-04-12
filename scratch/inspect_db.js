const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('--- Inspecting Addon Groups ---');
  const { data: groups } = await supabase.from('addon_groups').select('*');
  
  const grouped = {};
  groups.forEach(g => {
    const key = `${g.name_ar} (${g.name_en})`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(g);
  });

  for (const [name, list] of Object.entries(grouped)) {
    if (list.length > 1) {
      console.log(`Duplicate detected for: "${name}"`);
      list.forEach(g => {
        console.log(`  - ID: ${g.id}, Category: ${g.category_id}, Product: ${g.product_id}, Type: ${g.group_type}`);
      });
    }
  }

  console.log('\n--- Inspecting Product Types ---');
  const { data: types } = await supabase.from('product_types').select('*, products(name_ar)');
  const typeCounts = {};
  types.forEach(t => {
      const pName = t.products?.name_ar || 'Unknown';
      const key = `${pName} -> ${t.name_ar}`;
      if (!typeCounts[key]) typeCounts[key] = [];
      typeCounts[key].push(t);
  });

  for (const [key, list] of Object.entries(typeCounts)) {
      if (list.length > 1) {
          console.log(`Duplicate Type: "${key}"`);
          list.forEach(t => console.log(`  - ID: ${t.id}, Price: ${t.price}`));
      }
  }
}

inspect();
