const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findPreExistingAddons() {
  const { data: groups } = await supabase.from('addon_groups')
    .select('id, name_ar, product_id, is_active')
    .ilike('name_ar', '%إضافات%'); // Looking for anything with additions in name
  
  console.log("Groups with 'إضافات':");
  console.log(JSON.stringify(groups, null, 2));
}
findPreExistingAddons();
