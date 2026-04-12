const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- Fixing Images ---');
  const imageFixes = [
    { name: 'شاي', path: '/images/tea__68ipsqrolope9un.jpg' },
    { name: 'سموذي طبيعي', path: '/images/natural-smoothie__c9pnbwbvwhncuvs.jpg' },
    { name: 'ميلك شيك', path: '/images/milkshakes__pgt1ljcxf6qma9t.jpg' },
    { name: 'اسبريسو', path: '/images/espresso__e6jr0mu46qix1iw.jpg' }
  ];

  for (const fix of imageFixes) {
    const { error } = await supabase.from('products').update({ image_path: fix.path }).eq('name_ar', fix.name);
    if (error) console.error(`Error fixing image for ${fix.name}:`, error);
    else console.log(`Updated image for ${fix.name}`);
  }

  console.log('\n--- Ensuring Bilingual Addon Groups ---');
  // Update addon group names to be bilingual if they aren't
  const { data: groups } = await supabase.from('addon_groups').select('*');
  for (const g of groups) {
    if (g.name_ar === 'الحجم' && (!g.name_en || g.name_en === '')) {
      await supabase.from('addon_groups').update({ name_en: 'Size' }).eq('id', g.id);
    }
    if (g.name_ar === 'النوع' && (!g.name_en || g.name_en === '')) {
      await supabase.from('addon_groups').update({ name_en: 'Type' }).eq('id', g.id);
    }
    if (g.name_ar === '➕ الإضافات' && (!g.name_en || g.name_en === '')) {
      await supabase.from('addon_groups').update({ name_en: 'Extras' }).eq('id', g.id);
    }
    if (g.name_ar === '🚫 بدون' && (!g.name_en || g.name_en === '')) {
      await supabase.from('addon_groups').update({ name_en: 'Without' }).eq('id', g.id);
    }
  }

  console.log('\n--- Finalizing Translation Audit ---');
  // Just a quick check for products with "Asado" or "Burger" to ensure descriptions are bilingual
  const { data: products } = await supabase.from('products').select('*');
  let updatedDesc = 0;
  for (const p of products) {
    if (p.description_ar && (!p.description_en || p.description_en.length < 5)) {
      // Simple placeholder or generic translation if missing
      let enDesc = p.name_en;
      if (p.name_ar.includes('بيرجر')) enDesc = `Premium ${p.name_en} prepared with fresh ingredients.`;
      if (p.name_ar.includes('ساندويش')) enDesc = `Delicious ${p.name_en} served fresh.`;

      await supabase.from('products').update({ description_en: enDesc }).eq('id', p.id);
      updatedDesc++;
    }
  }
  console.log(`Updated ${updatedDesc} product descriptions with English support.`);

  console.log('\nDone!');
}

main().catch(console.error);
