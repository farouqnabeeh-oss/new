const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: prods } = await supabase.from('products').select('id, name_ar, category_id').in('id', [105, 106, 114]);
  console.log(JSON.stringify(prods, null, 2));
}
check();
