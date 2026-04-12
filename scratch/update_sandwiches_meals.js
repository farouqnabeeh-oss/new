const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateMeals() {
  console.log("--- Updating Sandwiches & Meals ---");

  // 1. Base Prices Mapping (Sandwich only)
  const basePrices = [
    { id: 103, price: 30 }, // البصل المكرمل
    { id: 102, price: 30 }, // نباتي
    { id: 96, price: 30 },  // ارابيكا
    { id: 101, price: 25 }, // دجاج مشوي برجر
    { id: 88, price: 35 },  // سماشد
    { id: 90, price: 30 },  // سويس مشروم
    { id: 89, price: 25 },  // باربيكيو
    { id: 92, price: 30 },  // مشروم وايت صوص
    { id: 91, price: 30 },  // مشروم
    { id: 97, price: 30 },  // بلو تشيز
    { id: 93, price: 30 },  // مكسيكانو
    { id: 94, price: 36 },  // اسادو برجر (36 as per user request)
    { id: 99, price: 36 },  // ستيك برجر (36 as per user request)
    { id: 98, price: 30 },  // فرايد ايغ
    { id: 104, price: 30 }, // هاواين
    { id: 1,   price: 25 }, // دجاج كرسبي ساندويش
    { id: 2,   price: 25 }, // ساندويش دجاج مشوي
    { id: 3,   price: 25 }, // ساندويش دجاج ايطالي
    { id: 4,   price: 25 }, // ساندويش مسحب فاهيتا
    { id: 116, price: 18 }, // تورتيلا
    { id: 354, price: 18 }, // تشكن راب (Assuming this ID, will match by name if not)
    { id: 6,   price: 25 }, // حلومي ساندويش
    { id: 115, price: 36 }  // فيلي تشيز ستيك ساندويش (Surcharge for meal brings it to 45)
  ];

  for (const item of basePrices) {
    const { error } = await supabase.from('products').update({ base_price: item.price, discount: 0 }).eq('id', item.id);
    if (error) console.error(`Error updating product ${item.id}:`, error);
    else console.log(`Product ${item.id} base price updated to ${item.price}`);

    // Create Type group with "Sandwich" and "Meal"
    const { data: group, error: gErr } = await supabase.from('addon_groups').upsert({
      product_id: item.id,
      name_ar: 'النوع / Type',
      name_en: 'Type',
      group_type: 'types',
      is_active: true
    }, { onConflict: 'product_id, name_en' }).select().single();

    if (group) {
       // Clear old items first to be clean
       await supabase.from('addon_group_items').delete().eq('addon_group_id', group.id);
       
       // Add Sandwich (0) and Meal (9)
       // For Tortilla/Wrap surcharge is 9 (27-18=9), for others user implied 34 vs 25 is also 9. Asado/Steak 45 vs 36 is also 9.
       await supabase.from('addon_group_items').insert([
         { addon_group_id: group.id, name_ar: 'ساندويش', name_en: 'Sandwich', price: 0 },
         { addon_group_id: group.id, name_ar: 'وجبة', name_en: 'Meal', price: 9 }
       ]);
    }
  }

  // 2. Fries Branding (Swap Fries)
  // We'll create a global group for fries swap that can be linked or added to these products
  console.log("Adding Fries Options...");
  const friesOptions = [
    { ar: 'بطاطا حلوة', en: 'Sweet Potato', price: 5 },
    { ar: 'كرات بطاطا', en: 'Potato Balls', price: 5 },
    { ar: 'كريلي فرايز', en: 'Crilly Fries', price: 5 },
    { ar: 'ودجيز', en: 'Wedges', price: 5 }
  ];

  for (const item of basePrices) {
    const { data: fGroup } = await supabase.from('addon_groups').upsert({
      product_id: item.id,
      name_ar: '🍟 تبديل البطاطا / Swap Fries',
      name_en: 'Swap Fries',
      group_type: 'addons',
      is_active: true
    }, { onConflict: 'product_id, name_en' }).select().single();

    if (fGroup) {
      await supabase.from('addon_group_items').delete().eq('addon_group_id', fGroup.id);
      await supabase.from('addon_group_items').insert(
        friesOptions.map(f => ({ addon_group_id: fGroup.id, name_ar: f.ar, name_en: f.en, price: f.price }))
      );
    }
  }

  console.log("--- Update Complete ---");
}

updateMeals();
