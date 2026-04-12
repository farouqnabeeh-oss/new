const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- CHECKING CATEGORIES ---');
  const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
  cats.forEach(c => console.log(`[${c.id}] ${c.name_ar} (sort=${c.sort_order}, branch=${c.branch_id})`));

  console.log('\n--- CHECKING BURGER SIZE GROUPS ---');
  // Category 1 is usually Burgers in these lists
  const { data: groups } = await supabase.from('addon_groups').select('*').eq('name_en', 'Size');
  groups.forEach(g => {
    console.log(`AddonGroup ID=${g.id}, name_ar=${g.name_ar}, category_id=${g.category_id}, product_id=${g.product_id}`);
  });

  console.log('\n--- CHECKING PRODUCTS IN CATEGORY 1 (Burgers) ---');
  // First, find which ID is Burgers
  const burgerCat = cats.find(c => c.name_ar === 'بيرجر');
  if (burgerCat) {
    const { data: prods } = await supabase.from('products').select('*').eq('category_id', burgerCat.id);
    prods.forEach(p => console.log(`ID=${p.id}, name_ar=${p.name_ar}, base=${p.base_price}, disc=${p.discount}`));
  } else {
    console.log('Burger category not found by name "بيرجر"');
  }
}

check();
