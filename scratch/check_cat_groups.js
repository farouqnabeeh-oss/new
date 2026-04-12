const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('addon_groups')
    .select('id, name_ar, name_en, product_id, category_id')
    .eq('category_id', 1)
    .is('product_id', null);
  console.log("Category-level groups for Burgers (ID 1):");
  console.log(JSON.stringify(data, null, 2));
}
check();
