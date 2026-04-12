const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function del() {
  const { error } = await supabase.from('addon_groups')
    .delete()
    .eq('category_id', 1)
    .is('product_id', null);
  if (error) console.error("Error deleting:", error);
  else console.log("Category-level groups for Category 1 deleted successfully.");
}
del();
