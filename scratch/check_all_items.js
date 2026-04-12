const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('addon_group_items').select('name_ar, price').limit(100);
  const names = [...new Set(data.map(i => i.name_ar))];
  console.log("Distinct Item Names in DB:");
  console.log(names);
}
check();
