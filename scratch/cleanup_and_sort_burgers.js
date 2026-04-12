const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanupAndSortAddons() {
  console.log("--- Starting Cleanup and Sorting for Burgers ---");

  // 1. Get all burger products
  const { data: burgers } = await supabase.from('products').select('id, name_ar').eq('category_id', 1);
  
  if (!burgers || burgers.length === 0) {
    console.error("No burgers found.");
    return;
  }

  const orderMap = {
    'Size': 1,
    'الحجم': 1,
    'Type': 2,
    'النوع': 2,
    'Without': 3,
    'بدون': 3,
    'Inside Adds': 4,
    'إضافة داخل البرغر': 4,
    'Side Adds': 5,
    'إضافة على جنب': 5,
    'Swap Fries': 6,
    'تبديل البطاطا': 6,
    'Swap Drink': 7,
    'تبديل المشروب': 7
  };

  for (const burger of burgers) {
    console.log(`Processing ${burger.name_ar} (ID: ${burger.id})...`);

    // Fetch all addon groups for this product
    const { data: groups } = await supabase.from('addon_groups')
      .select('*')
      .eq('product_id', burger.id);

    if (!groups) continue;

    const seenNames = new Set();
    const sortedGroups = groups.map(g => {
        // Determine intended order
        let order = 99;
        for (const [key, val] of Object.entries(orderMap)) {
          if ((g.name_ar || '').includes(key) || (g.name_en || '').includes(key)) {
            order = val;
            break;
          }
        }
        return { ...g, internalOrder: order };
    }).sort((a,b) => a.internalOrder - b.internalOrder);

    // Track duplicates by a normalized name
    const toKeep = [];
    const toDelete = [];

    for (const g of sortedGroups) {
      const normName = (g.name_en || g.name_ar || '').toLowerCase().trim();
      // Heuristic: if name contains 'بدون' or 'without', it's a without group
      let typeTag = 'other';
      if (normName.includes('بدون') || normName.includes('without')) typeTag = 'without';
      if (normName.includes('type') || normName.includes('النوع')) typeTag = 'type';
      if (normName.includes('size') || normName.includes('الحجم')) typeTag = 'size';
      if (normName.includes('inside') || normName.includes('داخل')) typeTag = 'inside';
      if (normName.includes('side') || normName.includes('جنب')) typeTag = 'side';
      if (normName.includes('fries') || normName.includes('بطاطا')) typeTag = 'fries';
      if (normName.includes('drink') || normName.includes('مشروب')) typeTag = 'drink';

      if (seenNames.has(typeTag)) {
        toDelete.push(g.id);
      } else {
        seenNames.add(typeTag);
        toKeep.push(g);
      }
    }

    // Delete duplicates
    if (toDelete.length > 0) {
      console.log(`Deleting duplicates for ${burger.name_ar}:`, toDelete);
      await supabase.from('addon_groups').delete().in('id', toDelete);
    }

    // Update sort orders for kept ones
    for (let i = 0; i < toKeep.length; i++) {
        const g = toKeep[i];
        const newOrder = g.internalOrder !== 99 ? g.internalOrder : (i + 10);
        await supabase.from('addon_groups').update({ sort_order: newOrder }).eq('id', g.id);
    }
  }

  console.log("--- Cleanup and Sort Complete ---");
}

cleanupAndSortAddons();
