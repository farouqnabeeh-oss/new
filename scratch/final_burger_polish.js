const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function finalBurgerPolish() {
  console.log("--- Final Polish for All Burgers ---");
  const burgerCatId = 1;
  const { data: burgers } = await supabase.from('products').select('id, name_ar').eq('category_id', burgerCatId);

  async function setupGroup(pId, ar, en, type, items, order) {
       console.log(`Setting up ${en} (Order: ${order}) for Product ${pId}...`);
       let { data: g } = await supabase.from('addon_groups')
         .select('id')
         .eq('product_id', pId)
         .eq('name_en', en)
         .maybeSingle();

       if (!g) {
         const { data: newG } = await supabase.from('addon_groups')
           .insert({ product_id: pId, name_ar: ar, name_en: en, group_type: type, is_active: true, sort_order: order })
           .select().single();
         g = newG;
       } else {
         await supabase.from('addon_groups').update({ name_ar: ar, group_type: type, sort_order: order }).eq('id', g.id);
       }

       if (g) {
         await supabase.from('addon_group_items').delete().eq('addon_group_id', g.id);
         await supabase.from('addon_group_items').insert(items.map((it, idx) => ({ ...it, addon_group_id: g.id, sort_order: idx + 1 })));
       }
  }

  for (const burger of burgers) {
    // 1. Type (Order 2)
    await setupGroup(burger.id, '🍔 النوع / Type', 'Type', 'type', [
        { name_ar: 'ساندويش', name_en: 'Sandwich', price: 0 },
        { name_ar: 'وجبة (بطاطا وكولا)', name_en: 'Meal (Fries & Drink)', price: 9 }
    ], 2);

    // 2. Without (Order 3) - Ensuring sort order
    await setupGroup(burger.id, '🚫 بدون / Without', 'Without', 'Without', [
        { name_ar: 'بدون بصل', name_en: 'No Onion', price: 0 },
        { name_ar: 'بدون بندورة', name_en: 'No Tomato', price: 0 },
        { name_ar: 'بدون جبنة', name_en: 'No Cheese', price: 0 },
        { name_ar: 'بدون خس', name_en: 'No Lettuce', price: 0 },
        { name_ar: 'بدون صوص', name_en: 'No Sauce', price: 0 },
        { name_ar: 'بدون مخلل', name_en: 'No Pickles', price: 0 }
    ], 3);

    // 3. Inside Adds (Order 4)
    await setupGroup(burger.id, '➕ إضافة داخل البرغر / Inside Adds', 'Inside Adds', 'addons', [
        { name_ar: 'إضافة 150 غم', name_en: 'Add 150g', price: 15 },
        { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 },
        { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
        { name_ar: 'جبنة شيدر', name_en: 'Extra Cheese', price: 3 },
        { name_ar: 'شرائح ريب اي ستيك', name_en: 'Ribeye Strips', price: 15 },
        { name_ar: 'شرائح فيليه ستيك', name_en: 'Fillet Strips', price: 12 },
        { name_ar: 'مشروم', name_en: 'Mushroom', price: 3 },
        { name_ar: 'مشروم وايت', name_en: 'Mushroom White', price: 5 },
        { name_ar: 'هلابينو', name_en: 'Jalapeno', price: 3 }
    ], 4);

    // 4. Side Adds (Order 5)
    await setupGroup(burger.id, '🥗 إضافة على جنب / Side Adds', 'Side Adds', 'addons', [
        { name_ar: 'أفوكادو (جنب)', name_en: 'Side Avocado', price: 5 },
        { name_ar: 'جبنة (جنب)', name_en: 'Side Cheese', price: 5 },
        { name_ar: 'مشروم وايت (جنب)', name_en: 'Side Mushroom White', price: 5 },
        { name_ar: 'هلابينو (جنب)', name_en: 'Side Jalapeno', price: 3 }
    ], 5);

    // 5. Fries Swap (Order 6)
    await setupGroup(burger.id, '🍟 تبديل البطاطا / Swap Fries', 'Swap Fries', 'MealFries', [
        { name_ar: 'بطاطا ودجيز', name_en: 'Wedges', price: 5 },
        { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 },
        { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 },
        { name_ar: 'كيرلي فرايز', name_en: 'Curly Fries', price: 5 }
    ], 6);

    // 6. Drink Swap (Order 7)
    await setupGroup(burger.id, '🥤 تبديل المشروب / Swap Drink', 'Swap Drink', 'MealDrinkUpgrade', [
        { name_ar: 'XL', name_en: 'XL', price: 4 },
        { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 },
        { name_ar: 'صودا', name_en: 'Soda', price: 4 }
    ], 7);
  }
  console.log("--- Polish Complete ---");
}

finalBurgerPolish();
