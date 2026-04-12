const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function restorePremiumFeatures() {
  console.log("Restoring Doneness for Premium Burgers...");
  const premiumBurgerIds = [95, 99, 94]; // Ribeye, Steak, Asado
  
  for (const id of premiumBurgerIds) {
    // Enable flag
    await supabase.from('products').update({ has_doneness_option: true }).eq('id', id);

    // Add Doneness Group
    const { data: g } = await supabase.from('addon_groups').upsert({
      product_id: id,
      name_ar: 'درجة الاستواء / Doneness',
      name_en: 'Doneness',
      group_type: 'Doneness',
      is_active: true,
      is_required: true,
      sort_order: 1 // Doneness usually comes first or after size
    }, { onConflict: 'product_id, name_en' }).select().single();

    if (g) {
      await supabase.from('addon_group_items').delete().eq('addon_group_id', g.id);
      await supabase.from('addon_group_items').insert([
        { addon_group_id: g.id, name_ar: 'ميديم رير', name_en: 'Medium Rare', price: 0, sort_order: 1 },
        { addon_group_id: g.id, name_ar: 'ميديم', name_en: 'Medium', price: 0, sort_order: 2 },
        { addon_group_id: g.id, name_ar: 'ميديم ويل', name_en: 'Medium Well', price: 0, sort_order: 3 },
        { addon_group_id: g.id, name_ar: 'ويل دان', name_en: 'Well Done', price: 0, sort_order: 4 }
      ]);
    }
  }
  console.log("Premium features restored.");
}
restorePremiumFeatures();
