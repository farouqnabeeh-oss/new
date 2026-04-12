const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspectSandwiches() {
  const products = [1, 2, 3, 4, 116]; // كرسبي، مشوي، ايطالي، فاهيتا، تورتيلا
  
  for (const id of products) {
    const { data: p } = await supabase.from('products').select('name_ar, base_price').eq('id', id).single();
    const { data: groups } = await supabase.from('addon_groups').select('id, name_ar, group_type').eq('product_id', id);
    
    console.log(`Product: ${p.name_ar} (ID: ${id}) - Base Price: ${p.base_price}`);
    if (groups) {
      for (const g of groups) {
         const { data: items } = await supabase.from('addon_group_items').select('id, name_ar, price').eq('addon_group_id', g.id);
         console.log(`  Group: ${g.name_ar} (${g.group_type})`);
         if (items) {
           items.forEach(it => console.log(`    - Item: ${it.name_ar}, Price: ${it.price}`));
         }
      }
    }
    console.log('---');
  }
}

inspectSandwiches();
