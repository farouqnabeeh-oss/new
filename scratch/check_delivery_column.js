const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addColumn() {
  console.log("Checking and adding delivery_fee column...");
  
  // Using a trick: try to select the column, if it fails, try to add it.
  // Or better, use a raw SQL if RPC is enabled.
  
  // Since we might not have RPC 'exec_sql', let's just try to update a test value
  // and see if it fails with 'column does not exist'.
  try {
    const { error } = await supabase.from('site_settings').update({ delivery_fee: 0 }).eq('id', 1);
    
    if (error && error.message.includes('column "delivery_fee" does not exist')) {
       console.log("Column 'delivery_fee' doesn't exist. Please run this SQL in Supabase Dashboard:");
       console.log("ALTER TABLE public.site_settings ADD COLUMN delivery_fee NUMERIC DEFAULT 0;");
       console.log("ALTER TABLE public.orders ADD COLUMN delivery_fee NUMERIC DEFAULT 0;");
    } else if (!error) {
       console.log("Column 'delivery_fee' already exists.");
    } else {
       console.error("Error checking column:", error);
    }
  } catch (e) {
    console.error("Exception:", e);
  }
}

addColumn();
