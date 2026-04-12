const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- Fixing Family Meals ---');
  // Category 31 = Family Meals
  const { data, error } = await supabase.from('products').update({ discount: 0 }).eq('category_id', 31);
  if (error) console.error('Error for cat 31:', error);
  else console.log('Removed discount from Family Meals');

  console.log('\n--- Final Size Verification ---');
  const catRes = await supabase.from('categories').select('id').eq('name_ar', 'بيرجر').single();
  const burgerCatId = catRes.data.id;
  const classicRes = await supabase.from('products').select('id').eq('name_ar', 'كلاسيك تشيز بيرجر').single();
  const classicId = classicRes.data.id;

  // Make sure ALL size groups for category 1 are bound to product 87
  const { data: groups } = await supabase.from('addon_groups').select('*').eq('category_id', burgerCatId);
  for (const g of groups) {
    if (g.name_ar === 'الحجم' || g.name_en === 'Size') {
      if (g.product_id !== classicId) {
        console.log(`Setting group ${g.id} to classic burger ${classicId}`);
        await supabase.from('addon_groups').update({ product_id: classicId }).eq('id', g.id);
      }
    }
  }

  console.log('\nDone!');
}

main();
