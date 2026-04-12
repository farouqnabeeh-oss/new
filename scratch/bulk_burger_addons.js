const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applyAddonsToAllBurgers() {
  console.log("--- Applying Addons to All Burgers ---");

  // 1. Target Burgers Category ID 1 directly
  const burgerCatId = 1;
  console.log(`Targeting Burgers Category ID: ${burgerCatId}`);

  // 2. Find all products in this category
  const { data: burgers } = await supabase.from('products').select('id, name_ar').eq('category_id', burgerCatId);
  console.log(`Found ${burgers?.length} burger products.`);

  // Define Groups
  const insideAdds = [
    { name_ar: 'إضافة 150 غم', name_en: 'Add 150g', price: 15 },
    { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 },
    { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
    { name_ar: 'جبنة شيدر', name_en: 'Extra Cheese', price: 3 },
    { name_ar: 'شرائح ريب اي ستيك', name_en: 'Ribeye Strips', price: 15 },
    { name_ar: 'شرائح فيليه ستيك', name_en: 'Fillet Strips', price: 12 },
    { name_ar: 'مشروم', name_en: 'Mushroom', price: 3 },
    { name_ar: 'مشروم وايت', name_en: 'Mushroom White', price: 5 },
    { name_ar: 'هلابينو', name_en: 'Jalapeno', price: 3 }
  ];

  const sideAdds = [
    { name_ar: 'أفوكادو (جنب)', name_en: 'Side Avocado', price: 5 },
    { name_ar: 'جبنة (جنب)', name_en: 'Side Cheese', price: 5 },
    { name_ar: 'مشروم وايت (جنب)', name_en: 'Side Mushroom White', price: 5 },
    { name_ar: 'هلابينو (جنب)', name_en: 'Side Jalapeno', price: 3 }
  ];

  const withoutOpts = [
    { name_ar: 'بدون بصل', name_en: 'No Onion', price: 0 },
    { name_ar: 'بدون بندورة', name_en: 'No Tomato', price: 0 },
    { name_ar: 'بدون جبنة', name_en: 'No Cheese', price: 0 },
    { name_ar: 'بدون خس', name_en: 'No Lettuce', price: 0 },
    { name_ar: 'بدون صوص', name_en: 'No Sauce', price: 0 },
    { name_ar: 'بدون مخلل', name_en: 'No Pickles', price: 0 }
  ];

  for (const burger of burgers) {
    console.log(`Updating ${burger.name_ar} (ID: ${burger.id})...`);
    
    // Function to manually check and setup group and its items
    async function setupGroup(pId, ar, en, type, items) {
       console.log(`Setting up group ${en} for product ${pId}...`);
       
       // 1. Try to find the group
       let { data: g, error: findError } = await supabase.from('addon_groups')
         .select('id')
         .eq('product_id', pId)
         .eq('name_en', en)
         .maybeSingle();

       if (!g) {
         // 2. Create if not exists
         const { data: newG, error: createError } = await supabase.from('addon_groups')
           .insert({ product_id: pId, name_ar: ar, name_en: en, group_type: type, is_active: true })
           .select().single();
         
         if (createError) {
           console.error(`Error creating group ${en} for product ${pId}:`, createError);
           return;
         }
         g = newG;
       } else {
         // Update existing group metadata if needed
         await supabase.from('addon_groups').update({ name_ar: ar, group_type: type }).eq('id', g.id);
       }

       if (g) {
         // 3. Sync Items
         await supabase.from('addon_group_items').delete().eq('addon_group_id', g.id);
         const { error: iError } = await supabase.from('addon_group_items').insert(items.map(it => ({ addon_group_id: g.id, ...it })));
         if (iError) console.error(`Error inserting items for group ${g.id}:`, iError);
         else console.log(`Group ${en} (ID: ${g.id}) updated successfully with ${items.length} items.`);
       }
    }

    await setupGroup(burger.id, '➕ إضافة داخل البرغر / Inside Adds', 'Inside Adds', 'addons', insideAdds);
    await setupGroup(burger.id, '🥗 إضافة على جنب / Side Adds', 'Side Adds', 'addons', sideAdds);
    await setupGroup(burger.id, '🚫 بدون / Without', 'Without', 'Without', withoutOpts);
  }

  console.log("--- Bulk Addon Update Complete ---");
}

applyAddonsToAllBurgers();
