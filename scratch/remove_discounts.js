const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log('Removing all discounts from the system...');

    // Remove branch-level discounts
    await s.from('branches').update({ discount_percent: 0 }).neq('discount_percent', 0);
    
    // Remove product-level discounts
    await s.from('products').update({ discount: 0 }).neq('discount', 0);

    // Some systems have a "promotions" table or active offer flags, let's just make sure the fields are 0
    console.log('All discounts have been successfully removed from the database!');
}
run();
