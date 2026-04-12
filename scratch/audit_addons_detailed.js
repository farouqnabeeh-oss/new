const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAllAddonsDetailed() {
  const { data: burgers } = await supabase.from('products').select('id, name_ar').eq('category_id', 1);
  
  for (const b of burgers) {
    const { data: groups } = await supabase.from('addon_groups').select('id, name_ar, sort_order').eq('product_id', b.id);
    console.log(`Burger ${b.id} (${b.name_ar}):`, groups.map(g => `[${g.sort_order}] ${g.name_ar}`));
  }
}
checkAllAddonsDetailed();
