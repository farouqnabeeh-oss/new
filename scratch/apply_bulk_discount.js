const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applyDiscount() {
  console.log("Applying 10% discount excluding Family Meals...");

  // 1. Find Family Meals Category
  const { data: categories } = await supabase.from('categories').select('id, name_ar');
  const familyCat = categories.find(c => (c.name_ar || '').includes('عائلية'));
  
  if (!familyCat) {
    console.error("Could not find Family Meals category. Applying to ALL as safety fallback? No, better be sure.");
    // Log available to help debug
    console.log("Available categories:", categories);
    return;
  }

  console.log(`Excluding Category ID: ${familyCat.id} (${familyCat.name_ar})`);

  // 2. Update all products EXCEPT this category
  const { data, error } = await supabase
    .from('products')
    .update({ discount: 10 })
    .not('category_id', 'eq', familyCat.id);

  if (error) {
    console.error("Error updating discounts:", error);
  } else {
    console.log("Success! 10% discount applied to all other products.");
  }
}

applyDiscount();
