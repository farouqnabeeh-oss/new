const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateSpecificProducts() {
  console.log("--- Updating Wings & Classic Cheese Burger ---");

  // 1. Wings Update
  const wingProducts = [
    { id: 17, name: 'أجنحة مقلية مقرمشة', prices: { '10 قطع': 30, '20 قطعة': 58 } },
    { id: 18, name: 'أجنحة كلاسيك', prices: { '10 قطع': 28, '20 قطعة': 54 } } // Checking if 18 is classic
  ];

  // We'll also check for any product named 'أجنحة كلاسيك' if ID 18 is not it.
  
  // 2. Classic Cheese Burger (ID 87)
  const burgerId = 87;
  const burgerSizes = [
    { nameAr: '120 غم (قطعة)', nameEn: '120g (1 pc)', price: 32 },
    { nameAr: '150 غم (قطعة)', nameEn: '150g (1 pc)', price: 34 },
    { nameAr: '240 غم (قطعتين)', nameEn: '240g (2 pcs)', price: 44 },
    { nameAr: '300 غم (قطعتين)', nameEn: '300g (2 pcs)', price: 49 }
  ];

  // --- Wings Logic ---
  for (const wing of wingProducts) {
    // Update base price to the smallest one
    const minPrice = Math.min(...Object.values(wing.prices));
    await supabase.from('products').update({ base_price: minPrice }).eq('id', wing.id);

    // Add Sizes
    // First, clear existing sizes
    await supabase.from('product_sizes').delete().eq('product_id', wing.id);
    await supabase.from('product_sizes').insert(
      Object.entries(wing.prices).map(([name, price]) => ({
        product_id: wing.id,
        name_ar: name,
        name_en: name === '10 قطع' ? '10 Pieces' : '20 Pieces',
        price: price
      }))
    );

    // Add Sauces for Crispy Wings (ID 17)
    if (wing.id === 17) {
      const { data: sauceGroup } = await supabase.from('addon_groups').upsert({
        product_id: 17,
        name_ar: 'الصوص / Sauces',
        name_en: 'Sauces',
        group_type: 'addons',
        is_active: true,
        is_required: true
      }, { onConflict: 'product_id, name_en' }).select().single();

      if (sauceGroup) {
        await supabase.from('addon_group_items').delete().eq('addon_group_id', sauceGroup.id);
        await supabase.from('addon_group_items').insert([
          { addon_group_id: sauceGroup.id, name_ar: 'باربيكيو', name_en: 'Barbecue', price: 0 },
          { addon_group_id: sauceGroup.id, name_ar: 'بافلو', name_en: 'Buffalo', price: 0 },
          { addon_group_id: sauceGroup.id, name_ar: 'ترياكي', name_en: 'Teriyaki', price: 0 },
          { addon_group_id: sauceGroup.id, name_ar: 'رانش', name_en: 'Ranch', price: 0 },
          { addon_group_id: sauceGroup.id, name_ar: 'سويت شيلي', name_en: 'Sweet Chili', price: 0 }
        ]);
      }
    }
  }

  // --- Burger Logic ---
  console.log("Updating Burger ID 87...");
  await supabase.from('products').update({ 
    base_price: 32,
    description_ar: 'خس، جبنة شيدر، بندورة، مخلل بصل، صوص اب تاون تشمل بطاطا وكولا'
  }).eq('id', burgerId);

  // Sizes for burger
  await supabase.from('product_sizes').delete().eq('product_id', burgerId);
  await supabase.from('product_sizes').insert(
    burgerSizes.map(s => ({
      product_id: burgerId,
      name_ar: s.nameAr,
      name_en: s.nameEn,
      price: s.price
    }))
  );

  // Helper to add/refresh addon group
  async function setupGroup(pId, ar, en, type, items, required = false) {
    const { data: g } = await supabase.from('addon_groups').upsert({
      product_id: pId, name_ar: ar, name_en: en, group_type: type, is_active: true, is_required: required
    }, { onConflict: 'product_id, name_en' }).select().single();
    if (g) {
      await supabase.from('addon_group_items').delete().eq('addon_group_id', g.id);
      await supabase.from('addon_group_items').insert(items.map(it => ({ addon_group_id: g.id, ...it })));
    }
  }

  // Fries Swap
  await setupGroup(burgerId, '🍟 تبديل البطاطا / Swap Fries', 'Swap Fries', 'MealFries', [
    { name_ar: 'بطاطا ودجيز', name_en: 'Wedges', price: 5 },
    { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 },
    { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 },
    { name_ar: 'كيرلي فرايز', name_en: 'Curly Fries', price: 5 }
  ]);

  // Drink Swap
  await setupGroup(burgerId, '🥤 تبديل المشروب / Swap Drink', 'Swap Drink', 'MealDrinkUpgrade', [
    { name_ar: 'XL', name_en: 'XL', price: 4 },
    { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 },
    { name_ar: 'صودا', name_en: 'Soda', price: 4 }
  ]);

  // Inside Additions
  await setupGroup(burgerId, '➕ إضافة داخل البرغر / Inside Adds', 'Inside Adds', 'addons', [
    { name_ar: 'إضافة 150 غم', name_en: 'Add 150g', price: 15 },
    { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 },
    { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
    { name_ar: 'جبنة شيدر', name_en: 'Extra Cheese', price: 3 },
    { name_ar: 'شرائح ريب اي ستيك', name_en: 'Ribeye Strips', price: 15 },
    { name_ar: 'شرائح فيليه ستيك', name_en: 'Fillet Strips', price: 12 },
    { name_ar: 'مشروم', name_en: 'Mushroom', price: 3 },
    { name_ar: 'مشروم وايت', name_en: 'Mushroom White', price: 5 },
    { name_ar: 'هلابينو', name_en: 'Jalapeno', price: 3 }
  ]);

  // Side Additions
  await setupGroup(burgerId, '🥗 إضافة على جنب / Side Adds', 'Side Adds', 'addons', [
    { name_ar: 'أفوكادو (جنب)', name_en: 'Side Avocado', price: 5 },
    { name_ar: 'جبنة (جنب)', name_en: 'Side Cheese', price: 5 },
    { name_ar: 'مشروم وايت (جنب)', name_en: 'Side Mushroom White', price: 5 },
    { name_ar: 'هلابينو (جنب)', name_en: 'Side Jalapeno', price: 3 }
  ]);

  // Without Options
  await setupGroup(burgerId, '🚫 بدون / Without', 'Without', 'Without', [
    { name_ar: 'بدون بصل', name_en: 'No Onion', price: 0 },
    { name_ar: 'بدون بندورة', name_en: 'No Tomato', price: 0 },
    { name_ar: 'بدون جبنة', name_en: 'No Cheese', price: 0 },
    { name_ar: 'بدون خس', name_en: 'No Lettuce', price: 0 },
    { name_ar: 'بدون صوص', name_en: 'No Sauce', price: 0 },
    { name_ar: 'بدون مخلل', name_en: 'No Pickles', price: 0 }
  ]);

  console.log("--- Update Complete ---");
}

updateSpecificProducts();
