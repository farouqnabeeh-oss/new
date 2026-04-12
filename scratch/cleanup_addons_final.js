const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log("--- Starting Final Addon Cleanup (Fixing Column Names) ---");

  // Names standard
  const NAMES = {
    SIZE: { ar: 'الحجم / Size', en: 'Size', type: 'sizes' },
    TYPE: { ar: 'النوع / Type', en: 'Type', type: 'types' },
    ADDONS: { ar: '➕ الإضافات / Addons', en: 'Addons', type: 'addons' },
    WITHOUT: { ar: '🚫 بدون / Without', en: 'Without', type: 'without' },
    DRINK: { ar: '🥤 اختر المشروب (مطلوب – للوجبة فقط) / Select Drink', en: 'Select Drink', type: 'addons' },
    SWAP_DRINK: { ar: '🔄 تبديل المشروب / Swap Drink', en: 'Swap Drink', type: 'addons' },
    SWAP_FRIES: { ar: '🍟 تبديل البطاطا / Swap Fries', en: 'Swap Fries', type: 'addons' },
    DONE_NESS: { ar: 'درجة الاستواء / Doneness', en: 'Doneness', type: 'Doneness' },
    SIDE_DISHES: { ar: 'إضافات الطعام / Side Dishes', en: 'Side Dishes', type: 'addons' }
  };

  // Load all current groups
  const { data: groups } = await supabase.from('addon_groups').select('*');
  console.log(`Found ${groups?.length || 0} groups.`);

  // Function to find or create a master group
  async function ensureMaster(catId, nameObj) {
    const existing = groups.find(g => g.category_id === catId && (g.name_en === nameObj.en || g.name_ar === nameObj.ar));
    if (existing) return existing.id;

    const { data: newGroup, error } = await supabase.from('addon_groups').insert({
      name_ar: nameObj.ar,
      name_en: nameObj.en,
      group_type: nameObj.type,
      category_id: catId,
      is_active: true
    }).select().single();
    
    if (error) {
       console.error(`Error creating master ${nameObj.en} for cat ${catId}:`, error);
       return null;
    }
    console.log(`Created Master: ${nameObj.en} for Category ${catId}`);
    groups.push(newGroup);
    return newGroup.id;
  }

  const burg=1, sand=2, pasta=3, dess=11, main=15, fam=16;

  // Ensure Masters exist
  const masters = {
    [burg]: {
      SIZE: await ensureMaster(burg, NAMES.SIZE),
      TYPE: await ensureMaster(burg, NAMES.TYPE),
      ADDONS: await ensureMaster(burg, NAMES.ADDONS),
      WITHOUT: await ensureMaster(burg, NAMES.WITHOUT),
      DRINK: await ensureMaster(burg, NAMES.DRINK),
      SWAP_DRINK: await ensureMaster(burg, NAMES.SWAP_DRINK),
      SWAP_FRIES: await ensureMaster(burg, NAMES.SWAP_FRIES)
    },
    [sand]: {
      TYPE: await ensureMaster(sand, NAMES.TYPE),
      ADDONS: await ensureMaster(sand, NAMES.ADDONS),
      WITHOUT: await ensureMaster(sand, NAMES.WITHOUT),
      DRINK: await ensureMaster(sand, NAMES.DRINK),
      SWAP_DRINK: await ensureMaster(sand, NAMES.SWAP_DRINK),
      SWAP_FRIES: await ensureMaster(sand, NAMES.SWAP_FRIES)
    },
    [pasta]: { ADDONS: await ensureMaster(pasta, NAMES.ADDONS) },
    [dess]: { ADDONS: await ensureMaster(dess, NAMES.ADDONS) },
    [main]: {
      ADDONS: await ensureMaster(main, NAMES.ADDONS),
      DONE_NESS: await ensureMaster(main, NAMES.DONE_NESS),
      SIDE_DISHES: await ensureMaster(main, NAMES.SIDE_DISHES)
    },
    [fam]: {
      DRINK: await ensureMaster(fam, { ar: 'اختيار المشروب / Select Drink', en: 'Select Drink', type: 'addons' }),
      ADDONS: await ensureMaster(fam, { ar: 'إضافات الطعام / Food Additions', en: 'Food Additions', type: 'addons' })
    }
  };

  console.log("3. Merging items into masters...");
  const { data: allGroups } = await supabase.from('addon_groups').select('*');

  for (const group of allGroups) {
    let targetId = null;
    const n = (group.name_en || "").toLowerCase();
    const na = (group.name_ar || "");
    
    let cid = group.category_id;
    if (!cid && group.product_id) {
       const { data: p } = await supabase.from('products').select('category_id').eq('id', group.product_id).single();
       if (p) cid = p.category_id;
    }
    
    if (!cid || !masters[cid]) continue;

    if (n.includes('size') || na.includes('حجم')) targetId = masters[cid].SIZE;
    else if (n.includes('type') || na.includes('نوع')) targetId = masters[cid].TYPE;
    else if (n.includes('addon') || n.includes('إضافات') || na.includes('إضافة')) targetId = masters[cid].ADDONS;
    else if (n.includes('without') || na.includes('بدون')) targetId = masters[cid].WITHOUT;
    else if (n.includes('drink') || na.includes('مشروب')) targetId = masters[cid].DRINK;
    else if (n.includes('fry') || n.includes('fries') || na.includes('بطاطا')) targetId = masters[cid].SWAP_FRIES;
    else if (n.includes('swap') && n.includes('drink')) targetId = masters[cid].SWAP_DRINK;
    else if (n.includes('done') || na.includes('استواء')) targetId = masters[cid].DONE_NESS;

    if (targetId && targetId !== group.id) {
       console.log(`-> Merging ${group.id} into ${targetId}`);
       await supabase.from('addon_group_items').update({ addon_group_id: targetId }).eq('addon_group_id', group.id);
       await supabase.from('addon_groups').delete().eq('id', group.id);
    }
  }

  // 4. Delete Orphans (Those named Unknown or unlinked)
  await supabase.from('addon_groups').delete().or('name_ar.ilike.%Unknown%,name_en.ilike.%Unknown%');

  console.log("--- Cleanup Done ---");
}

cleanup();
