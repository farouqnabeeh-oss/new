const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAllAddons() {
  const { data: groups } = await supabase.from('addon_groups')
    .select('id, name_ar, product_id, sort_order')
    .eq('category_id', 1)
    .order('product_id');
  
  console.log("Current Addon Groups for Category 1 (Burgers):");
  groups.forEach(g => {
    console.log(`Product ${g.product_id}: [${g.sort_order}] ${g.name_ar}`);
  });
}
checkAllAddons();
