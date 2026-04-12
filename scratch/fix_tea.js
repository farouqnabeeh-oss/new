const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  await supabase.from('products').update({ base_price: 15 }).eq('id', 52); // شاي لاتيه
  await supabase.from('products').update({ base_price: 8 }).eq('id', 44);  // شاي عادي
  console.log("Tea prices fixed.");
}
fix();
