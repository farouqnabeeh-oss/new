const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('--- Migrating Overlapping Product Types ---');
  
  // 1. Find products with both
  const { data: products } = await supabase.from('products').select('id, name_ar, category_id, product_types(*), addon_groups(*)');
  
  for (const p of products) {
    const tableTypes = p.product_types || [];
    const hasGroupTypes = p.addon_groups && p.addon_groups.some(g => g.group_type === 'Type' || g.group_type === 'types' || g.name_ar.includes('النوع'));
    
    if (tableTypes.length > 0 && hasGroupTypes) {
      console.log(`Product "${p.name_ar}" has overlap. Moving table types to specific addon group...`);
      
      // Check if there is already a PRODUCT-SPECIFIC Type group for this product
      let group = p.addon_groups.find(g => g.product_id === p.id && (g.group_type === 'Type' || g.group_type === 'types' || g.name_ar.includes('النوع')));
      
      if (!group) {
        console.log(`  Creating new specific 'النوع' group for product ${p.id}...`);
        const { data: newGroup, error: gError } = await supabase.from('addon_groups').insert({
          name_ar: 'النوع',
          name_en: 'Type',
          category_id: p.category_id,
          product_id: p.id,
          group_type: 'types',
          is_required: true,
          allow_multiple: false,
          sort_order: 0
        }).select().single();
        
        if (gError) {
          console.error(`  Error creating group:`, gError);
          continue;
        }
        group = newGroup;
      }

      // Add items if they don't exist
      const { data: existingItems } = await supabase.from('addon_group_items').select('name_ar').eq('addon_group_id', group.id);
      const existingNames = new Set(existingItems.map(i => i.name_ar));

      for (const t of tableTypes) {
        if (!existingNames.has(t.name_ar)) {
            console.log(`  Adding item: ${t.name_ar}`);
            await supabase.from('addon_group_items').insert({
                addon_group_id: group.id,
                name_ar: t.name_ar,
                name_en: t.name_en,
                price: t.price,
                sort_order: t.sort_order
            });
        }
      }

      // Finally delete from legacy table
      console.log(`  Deleting legacy types for product ${p.id}`);
      await supabase.from('product_types').delete().eq('product_id', p.id);
    }
  }

  console.log('--- Migration Finished ---');
}

migrate();
