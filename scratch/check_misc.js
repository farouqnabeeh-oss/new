const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkMiscellaneousAddons() {
  const { data: burgers } = await supabase.from('products').select('id, name_ar').eq('category_id', 1);
  const burgerIds = burgers.map(b => b.id);

  const { data: groups } = await supabase.from('addon_groups')
    .select('id, name_ar, name_en, product_id')
    .in('product_id', burgerIds)
    .not('name_en', 'in', '("Inside Adds","Side Adds","Without","Type","Swap Fries","Swap Drink")');
  
  console.log("Miscellaneous Addon Groups found for Burgers:");
  console.log(JSON.stringify(groups, null, 2));
}
checkMiscellaneousAddons();
