const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDoneness() {
  const { data: groups } = await supabase.from('addon_groups').select('id, name_ar, product_id, group_type').eq('group_type', 'Doneness');
  console.log("Doneness Groups:");
  console.log(JSON.stringify(groups, null, 2));

  const { data: prods } = await supabase.from('products').select('id, name_ar').eq('has_doneness_option', true);
  console.log("Products with Doneness Option enabled:");
  console.log(JSON.stringify(prods, null, 2));
}
checkDoneness();
