const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateWings() {
  console.log("Updating Wings Category...");

  // 1. Update Crispy Wings (ID 17)
  const crispyId = 17;
  await supabase.from('product_sizes').delete().eq('product_id', crispyId);
  await supabase.from('product_sizes').insert([
    { product_id: crispyId, name_ar: '10 قطع', name_en: '10 Pieces', price: 30, sort_order: 1 },
    { product_id: crispyId, name_ar: '20 قطعة', name_en: '20 Pieces', price: 58, sort_order: 2 }
  ]);

  // Add sauce options for Crispy Wings
  const { data: sauceGroup } = await supabase.from('addon_groups').upsert({
    product_id: crispyId,
    name_ar: 'اختر الصوص / Select Sauce',
    name_en: 'Select Sauce',
    group_type: 'addons',
    is_active: true,
    is_required: true,
    allow_multiple: false
  }, { onConflict: 'product_id, name_en' }).select().single();

  if (sauceGroup) {
    await supabase.from('addon_group_items').delete().eq('addon_group_id', sauceGroup.id);
    await supabase.from('addon_group_items').insert([
      { addon_group_id: sauceGroup.id, name_ar: 'باربيكيو', name_en: 'BBQ', price: 0, sort_order: 1 },
      { addon_group_id: sauceGroup.id, name_ar: 'بافالو', name_en: 'Buffalo', price: 0, sort_order: 2 },
      { addon_group_id: sauceGroup.id, name_ar: 'تيراكي', name_en: 'Teriyaki', price: 0, sort_order: 3 },
      { addon_group_id: sauceGroup.id, name_ar: 'رانش', name_en: 'Ranch', price: 0, sort_order: 4 },
      { addon_group_id: sauceGroup.id, name_ar: 'سويت شيلي', name_en: 'Sweet Chili', price: 0, sort_order: 5 }
    ]);
  }

  // 2. Create or Update Classic Wings
  // Check if it exists
  const { data: classicWings } = await supabase.from('products').select('id').ilike('name_ar', '%كلاسيك%').eq('category_id', 4).maybeSingle();
  let classicId;
  if (classicWings) {
    classicId = classicWings.id;
    console.log(`Found existing Classic Wings (ID: ${classicId})`);
  } else {
    const { data: newClassic } = await supabase.from('products').insert({
      name_ar: 'أجنحة كلاسيك',
      name_en: 'Classic Wings',
      category_id: 4,
      is_active: true,
      base_price: 28, // Default base price for small size
      sort_order: 10
    }).select().single();
    classicId = newClassic.id;
    console.log(`Created new Classic Wings (ID: ${classicId})`);
  }

  await supabase.from('product_sizes').delete().eq('product_id', classicId);
  await supabase.from('product_sizes').insert([
    { product_id: classicId, name_ar: '10 قطع', name_en: '10 Pieces', price: 28, sort_order: 1 },
    { product_id: classicId, name_ar: '20 قطعة', name_en: '20 Pieces', price: 54, sort_order: 2 }
  ]);

  console.log("Wings category updated successfully.");
}

updateWings();
