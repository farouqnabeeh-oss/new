const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('addon_groups').select('*').limit(1);
  if (data && data.length > 0) {
    console.log("Columns in addon_groups:", Object.keys(data[0]));
  } else {
    console.log("No data in addon_groups, trying to guess or user older way.");
  }
}
check();
