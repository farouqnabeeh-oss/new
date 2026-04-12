const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanGroups() {
  console.log('--- Aggressive Addon Group Cleanup ---');
  
  // 1. Fetch all groups with their items
  const { data: groups } = await supabase.from('addon_groups').select('*, addon_group_items(*)');
  
  const seen = {}; // key -> primaryGroup
  const toDelete = [];

  for (const group of groups) {
    const key = `${group.category_id}-${group.product_id}-${(group.name_ar || '').trim()}`;
    
    if (seen[key]) {
      // We found a duplicate! 
      // Compare them. If the new one has more items, maybe we should keep it instead?
      const primary = seen[key];
      if ((group.addon_group_items?.length || 0) > (primary.addon_group_items?.length || 0)) {
        toDelete.push(primary.id);
        seen[key] = group;
      } else {
        toDelete.push(group.id);
      }
    } else {
      seen[key] = group;
    }
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate groups...`);
    await supabase.from('addon_groups').delete().in('id', toDelete);
  } else {
    console.log('No duplicate groups found.');
  }

  console.log('--- Cleanup Finished ---');
}

cleanGroups();
