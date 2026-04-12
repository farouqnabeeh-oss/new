const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // ============================
  // 1. FIX CATEGORY ORDER + Pasta for al-tira only + Family Meals after Sandwiches
  // ============================
  // User wants: بيرجر → سندويشات → وجبات عائلية → وجبات رئيسية → أجنحة → وجبات اطفال → سلطات → مقبلات → باستا → حلويات → مشروبات باردة → قهوة باردة → سموذي طبيعي → ميلك شيك → مشروبات ساخنة → اراجيل

  console.log('--- Fetching categories ---');
  const { data: cats, error: catErr } = await supabase.from('categories').select('*').order('id');
  if (catErr) { console.error('Error fetching categories:', catErr); return; }

  console.log('Current categories:');
  cats.forEach(c => console.log(`  id=${c.id} name_ar=${c.name_ar} name_en=${c.name_en} sort_order=${c.sort_order} branch_id=${c.branch_id}`));

  // Map name_en to desired sort_order
  const orderMap = {
    'Burgers': 1,
    'Sandwiches': 2,
    'Family Meals': 3,
    'Main Meals': 4,
    'Wings': 5,
    'Kids Meals': 6,
    'Salads': 7,
    'Appetizers': 8,
    'Pasta': 9,
    'Desserts': 10,
    'Cold Drinks': 11,
    'Cold Coffee': 12,
    'Natural Smoothie': 13,
    'Milkshake': 14,
    'Hot Drinks': 15,
    'Hookah': 16,
  };

  for (const cat of cats) {
    const newOrder = orderMap[cat.name_en];
    if (newOrder !== undefined) {
      const updates = { sort_order: newOrder };
      // Pasta: al-tira only (branch_id = 2)
      if (cat.name_en === 'Pasta') {
        updates.branch_id = 2;
      }
      const { error } = await supabase.from('categories').update(updates).eq('id', cat.id);
      if (error) console.error(`Error updating ${cat.name_en}:`, error);
      else console.log(`Updated ${cat.name_en} → sort_order=${newOrder}${cat.name_en === 'Pasta' ? ' (al-tira only)' : ''}`);
    }
  }

  // Check if Family Meals category exists, if not create it
  const familyMeals = cats.find(c => c.name_en === 'Family Meals');
  if (!familyMeals) {
    console.log('\nCreating Family Meals category...');
    const { data: newCat, error: newCatErr } = await supabase.from('categories').insert({
      name_ar: 'وجبات عائلية',
      name_en: 'Family Meals',
      sort_order: 3,
      icon_class: '👨‍👩‍👧‍👦',
      is_active: true,
      branch_id: null
    }).select().single();
    if (newCatErr) console.error('Error creating Family Meals:', newCatErr);
    else console.log('Created Family Meals category with id:', newCat.id);
  }

  // ============================
  // 2. FIX PRICES: basePrice should result in correct final price after 10% discount
  // ============================
  console.log('\n--- Fixing product prices ---');

  function calcBasePrice(listedPrice) {
    for (let bp = listedPrice; bp <= listedPrice * 2; bp++) {
      if (Math.round(bp * 0.9) === listedPrice) return bp;
    }
    return listedPrice;
  }

  const priceMap = {
    "أجنحة مقلية مقرمشة": 30,
    "سبانش لاتيه": 17, // cold version
    "كولا": 5, "شاي": 8, "ميلك شيك": 17, "سموذي طبيعي": 17,
    "وافل مع آيس كريم": 22, "أرجيلة": 30,
    "كيدز بيرجر لحمة": 23, "كلاسيك تشيز بيرجر": 23,
    "ستيك دجاج مشوي": 45,
    "ساندويش دجاج مقلي مقرمش (كريسبي)": 25, "ساندويتش دجاج مقلي مقرمش (كريسبي)": 25,
    "بينا أرابيتا": 30, "بينا أرابياتا": 30,
    "كولا زيرو": 5, "كولا تشات": 5, "كولا تشات زيرو": 5,
    "سبرايت دايت": 5, "كابي": 5,
    "تشيكن اند فرايز": 30,
    "سلطة سيزر": 25, "أصابع دجاج 5 قطع": 22, "أصابع دجاج": 22,
    "سلطة يونانية": 30,
    "أجنحة بصوص البافلو": 28, "أجنحة بصوص البافالو": 28,
    "آيس كابتشينو": 17,
    "سبرايت": 5, "اسبريسو": 8, "اسبرسو": 8,
    "كريب مع شوكولاتة": 22,
    "كيدز بيرجر دجاج": 23,
    "سماش بيرجر": 35, "سماشد بيرجر": 35,
    "ريب أي ستيك": 90,
    "ساندويش دجاج مشوي": 25,
    "بينا بيستو": 30,
    "بوب كورن دجاج": 22,
    "سلطة جرجير": 25,
    "أجنحة بصوص الباربيكيو": 28,
    "آيس لاتيه": 17,
    "فانتا": 5, "قهوة عربية": 12,
    "سوفليه مع بوظة": 22, "سوفليه": 22,
    "بوب كورن دجاج (أطفال)": 23,
    "باربيكيو بيرجر": 25,
    "فيليه ستيك": 70,
    "ساندويش دجاج إيطالي": 25,
    "بينا الفريدو": 30,
    "أصابع موزاريلا": 12, "أصابع موزاريلا 3 قطع": 12,
    "سلطة حلومي": 35,
    "أجنحة بصوص التيراكي": 28, "أجنحة بصوص الترياكي": 28,
    "آيس كوفي": 17,
    "ماء صغير": 4, "أمريكانو": 12,
    "آيس كريم": 15,
    "سويس مشروم بيرجر": 30, "سويس ماشروم بيرجر": 30,
    "دجاج فاهيتا مع أرز": 45,
    "ساندويش مسحب فاهيتا": 25,
    "بينا روزيه": 30,
    "حلقات بصل": 10, "حلقات بصل 8 قطع": 10,
    "سلطة كينوا": 30,
    "أجنحة بصوص وثوم وليمون وبارميزان": 28, "أجنحة بصوص ثوم وليمون وبارميزان": 28,
    "آيس كارميل لاتيه": 19, "آيس كارمل لاتيه": 19,
    "بفاريا": 8, "بافاريا": 8,
    "موكا": 15,
    "سان سباستيان تشيز كيك": 30,
    "مشروم بيرجر": 30, "ماشروم بيرجر": 30,
    "ستروجانوف دجاج مع أرز": 45,
    "ساندويش حلومي": 25,
    "ماك اند تشيز": 25,
    "بطاطا مقلية": 7,
    "سلطة فتوش": 30,
    "أجنحة بصوص الثومة والليمون": 28, "أجنحة بصوص الثوم والليمون": 28,
    "آيس أمريكانو": 15,
    "صودا": 8, "وايت موكا": 15,
    "بلوبيري تشيز كيك": 22,
    "مشروم وايت صوص بيرجر": 30, "ماشروم وايت صوص بيرجر": 30,
    "ستروجانوف لحمة مع أرز": 60,
    "ساندويش أسايدو": 36,
    "فيتوتشيني الفريدو": 30,
    "علبة جبنة": 5,
    "أجنحة بصوص السويت شيلي": 28,
    "فرابتشينو": 17,
    "XL": 8, "كابتشينو": 15,
    "لوتس تشيز كيك": 22,
    "مكسيكانو بيرجر": 30,
    "فوتوتشيني مع دجاج": 45,
    "سباجيتي ريد صوص": 30, "سباغيتي ريد صوص": 30,
    "بطاطا": 12,
    "آيس موكا": 17, "آيس فانيلا": 17,
    "لاتيه": 15, "تيراميسو": 22,
    "أسايدو بيرجر": 36,
    "سباجيتي روزيه": 30, "سباغيتي روزيه": 30,
    "آيس وايت موكا": 17, "آيس تي": 17,
    "شاي لاتيه": 15, "فرينش فانيلا": 15,
    "تشوكليت كيك": 22,
    "ريب أي بيرجر": 45,
    "آيس تشوكليت": 17, "بندق": 15,
    "أرابيكا بيرجر": 30,
    "فيليه تشيز ستيك": 36,
    "موميتو": 17, "موهيتو": 17,
    "هوت تشوكليت": 15,
    "بلو تشيز بيرجر": 30,
    "تورتيلا دجاج مقلي مقرمش": 18,
    "عصير": 15, "إيطاليان تشوكليت": 15,
    "فرايد ايغ بيرجر": 30,
    "مكس أعشاب": 10,
    "كوكتيل مع بوظة": 22,
    "ستيك بيرجر": 36,
    "سبانش لاتيه (ساخن)": 15,
    "دجاج كريسبي بيرجر": 25,
    "نسكافيه": 12,
    "دجاج مشوي بيرجر": 25,
    "نباتي بيرجر": 30,
    "بصل مكرمل بيرجر": 30,
    "هاواين بيرجر": 30,
  };

  // Fetch all products
  const { data: products, error: prodErr } = await supabase.from('products').select('id, name_ar, base_price, discount');
  if (prodErr) { console.error('Error fetching products:', prodErr); return; }

  let priceUpdated = 0;
  let discUpdated = 0;
  for (const p of products) {
    const listedPrice = priceMap[p.name_ar];
    const updates = {};

    if (listedPrice !== undefined) {
      const correctBase = calcBasePrice(listedPrice);
      if (p.base_price !== correctBase) {
        updates.base_price = correctBase;
      }
    }

    // Ensure all products have discount: 10
    if (p.discount !== 10) {
      updates.discount = 10;
      discUpdated++;
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('products').update(updates).eq('id', p.id);
      if (error) console.error(`Error updating ${p.name_ar}:`, error);
      else {
        if (updates.base_price) priceUpdated++;
      }
    }
  }
  console.log(`Updated ${priceUpdated} product prices, ${discUpdated} discount fixes`);

  // ============================
  // 3. BURGER SIZES: Only Classic Cheeseburger
  // ============================
  console.log('\n--- Fixing burger sizes ---');
  // Find the Classic Cheeseburger product
  const classic = products.find(p => p.name_ar === 'كلاسيك تشيز بيرجر');
  if (classic) {
    // Find burger category
    const burgerCat = cats.find(c => c.name_en === 'Burgers');
    if (burgerCat) {
      // Find the size addon group for burgers
      const { data: addonGroups } = await supabase
        .from('addon_groups')
        .select('*')
        .eq('category_id', burgerCat.id)
        .eq('group_type', 'sizes');

      if (addonGroups && addonGroups.length > 0) {
        for (const g of addonGroups) {
          if (g.product_id === null) {
            // Change from category-wide to specific product
            const { error } = await supabase.from('addon_groups').update({ product_id: classic.id }).eq('id', g.id);
            if (error) console.error('Error fixing size group:', error);
            else console.log(`Fixed size group ${g.id}: now only for Classic Cheeseburger (id ${classic.id})`);
          }
        }
      } else {
        console.log('No burger size addon groups found');
      }
    }
  }

  // ============================
  // FINAL VERIFICATION
  // ============================
  console.log('\n--- Final Verification ---');
  const { data: finalCats } = await supabase.from('categories').select('*').order('sort_order');
  console.log('Category order:');
  finalCats.forEach((c, i) => console.log(`  ${i + 1}. ${c.name_ar} (sort_order=${c.sort_order}, branch=${c.branch_id || 'all'})`));

  console.log('\nDone!');
}

main().catch(console.error);
