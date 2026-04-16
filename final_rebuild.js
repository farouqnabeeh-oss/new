
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function finalRebuild() {
    console.log('--- FINAL DEFINITIVE ADDON REBUILD ---');

    // 1. Get Categories and Products
    const { data: cats } = await supabase.from('categories').select('id, name_en, name_ar');
    const { data: prods } = await supabase.from('products').select('id, name_en, name_ar, category_id');

    const findCat = (val) => cats.find(c => c.name_en === val || c.name_ar === val)?.id;
    const findProd = (val) => prods.find(p => p.name_en === val || p.name_ar === val);

    // 2. Clean Wipe
    console.log('Cleaning existing addon data...');
    const { data: groups } = await supabase.from('addon_groups').select('id');
    if (groups && groups.length > 0) {
        const ids = groups.map(g => g.id);
        await supabase.from('addon_group_items').delete().in('addon_group_id', ids);
        await supabase.from('addon_groups').delete().in('id', ids);
    }

    // 3. Helper
    async function addGrp(grp, items) {
        const { data, error } = await supabase.from('addon_groups').insert([{ ...grp, is_active: true }]).select();
        if (error || !data?.[0]) { console.error('Error adding group:', grp.name_ar, error); return; }
        const gid = data[0].id;
        if (items?.length > 0) {
           const finalItems = items.map((it, idx) => ({ ...it, addon_group_id: gid, sort_order: idx + 1, is_active: true }));
           await supabase.from('addon_group_items').insert(finalItems);
        }
        console.log(`✅ Added: ${grp.name_ar} (${items?.length || 0} items)`);
    }

    // --- BURGERS ---
    const bId = findCat('Burgers');
    if (bId) {
        await addGrp({ name_ar: 'النوع', name_en: 'Type', category_id: bId, group_type: 'types', is_required: true }, [
            { name_ar: 'بيرجر', name_en: 'Burger', price: 0 },
            { name_ar: 'وجبة (بطاطا ومشروب)', name_en: 'Meal', price: 9 }
        ]);
        await addGrp({ name_ar: 'إضافات داخل البرجر', name_en: 'Inside Addons', category_id: bId, group_type: 'addons' }, [
            { name_ar: 'لحمة 120غ', price: 12 }, { name_ar: 'لحمة 150غ', price: 15 }, { name_ar: 'ريب آي', price: 15 },
            { name_ar: 'فيليه', price: 12 }, { name_ar: 'جبنة إضافية', price: 3 }, { name_ar: 'بصل مكرمل', price: 3 },
            { name_ar: 'ماشروم', price: 3 }, { name_ar: 'خبز جلوتين فري', price: 5 }, { name_ar: 'أفوكادو', price: 5 },
            { name_ar: 'هالبينو', price: 3 }, { name_ar: '2 موزاريلا', price: 8 }, { name_ar: '3 حلقات بصل', price: 5 },
            { name_ar: 'وايت صوص', price: 5 }
        ]);
        await addGrp({ name_ar: 'إضافة على جنب', name_en: 'Side Addons', category_id: bId, group_type: 'side_addons' }, [
            { name_ar: 'حلقات بصل (8)', price: 10 }, { name_ar: 'موزاريلا (3)', price: 12 },
            { name_ar: 'بوب كورن دجاج', price: 12 }, { name_ar: 'هالبينو', price: 8 }, { name_ar: 'علبة جبنة', price: 5 }
        ]);
        await addGrp({ name_ar: 'بدون', name_en: 'Without', category_id: bId, group_type: 'without' }, [
            { name_ar: 'مخلل' }, { name_ar: 'بندورة' }, { name_ar: 'بصل' }, { name_ar: 'جبنة' }, { name_ar: 'خس' }, { name_ar: 'صوص' }
        ]);
        await addGrp({ name_ar: 'اختر المشروب', name_en: 'Select Drink', category_id: bId, group_type: 'MealDrink', is_required: true }, [
            { name_ar: 'كولا' }, { name_ar: 'كولا زيرو' }, { name_ar: 'فانتا' }, { name_ar: 'سبرايت' }, { name_ar: 'ماء' }, { name_ar: 'كابي' }
        ]);
        await addGrp({ name_ar: 'تبديل المشروب', name_en: 'Upgrade Drink', category_id: bId, group_type: 'MealDrinkUpgrade' }, [
            { name_ar: 'XL', price: 4 }, { name_ar: 'بافاريا', price: 4 }, { name_ar: 'صودا', price: 4 }
        ]);
        await addGrp({ name_ar: 'تبديل البطاطا', name_en: 'Change Fries', category_id: bId, group_type: 'MealFries' }, [
            { name_ar: 'كيرلي', price: 5 }, { name_ar: 'ويدجز', price: 5 }, { name_ar: 'بطاطا حلوة', price: 5 }, { name_ar: 'كرات بطاطا', price: 5 }
        ]);
    }

    // --- SANDWICHES ---
    const sId = findCat('Sandwiches');
    if (sId) {
        await addGrp({ name_ar: 'النوع', name_en: 'Type', category_id: sId, group_type: 'types', is_required: true }, [
            { name_ar: 'ساندويش', price: 0 }, { name_ar: 'وجبة (بطاطا ومشروب)', price: 9 }
        ]);
        await addGrp({ name_ar: 'إضافات', name_en: 'Addons', category_id: sId, group_type: 'addons' }, [
            { name_ar: 'لحمة 120غ', price: 12 }, { name_ar: 'لحمة 150غ', price: 15 }, { name_ar: 'جبنة', price: 3 }, { name_ar: 'هالبينو', price: 3 }
        ]);
        await addGrp({ name_ar: 'بدون', name_en: 'Without', category_id: sId, group_type: 'without' }, [
            { name_ar: 'مخلل' }, { name_ar: 'بندورة' }, { name_ar: 'بصل' }, { name_ar: 'خس' }, { name_ar: 'صوص' }
        ]);
        await addGrp({ name_ar: 'اختر المشروب', name_en: 'Select Drink', category_id: sId, group_type: 'MealDrink', is_required: true }, [
            { name_ar: 'كولا' }, { name_ar: 'كولا زيرو' }, { name_ar: 'فانتا' }, { name_ar: 'سبرايت' }, { name_ar: 'ماء' }
        ]);
    }

    // --- MAIN MEALS ---
    const mId = findCat('Main Meals');
    if (mId) {
        await addGrp({ name_ar: 'إضافات', name_en: 'Addons', category_id: mId, group_type: 'addons' }, [ { name_ar: 'صحن أرز إضافي', price: 10 } ]);
        await addGrp({ name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: mId, group_type: 'Doneness', is_required: true }, [
            { name_ar: 'ميديوم' }, { name_ar: 'ميديوم ويل' }, { name_ar: 'ويل دون' }
        ]);
        const gcs = findProd('Grilled Chicken Steak');
        if (gcs) {
            await addGrp({ name_ar: 'النوع', name_en: 'Type', product_id: gcs.id, group_type: 'types', is_required: true }, [
                { name_ar: 'ثوم وليمون' }, { name_ar: 'وايت صوص' }
            ]);
        }
    }

    // --- WINGS ---
    const wId = findCat('Wings');
    if (wId) {
        await addGrp({ name_ar: 'الحجم', name_en: 'Size', category_id: wId, group_type: 'sizes', is_required: true }, [
            { name_ar: '10 قطع', price: 13 }, { name_ar: '20 قطعة', price: 25 }
        ]);
        await addGrp({ name_ar: 'الصوص', name_en: 'Sauce', category_id: wId, group_type: 'types' }, [
            { name_ar: 'بافلو' }, { name_ar: 'باربيكيو' }, { name_ar: 'ثوم وليمون' }, { name_ar: 'تيراكي' }
        ]);
    }

    // --- MILKSHAKE / SMOOTHIE ---
    const msId = findCat('Milkshake');
    if (msId) await addGrp({ name_ar: 'النوع', name_en: 'Flavor', category_id: msId, group_type: 'flavors', is_required: true }, [
        { name_ar: 'فراولة' }, { name_ar: 'فانيلا' }, { name_ar: 'اوريو' }, { name_ar: 'لوتس' }, { name_ar: 'تشوكليت' }
    ]);
    const smId = findCat('Natural Smoothie');
    if (smId) await addGrp({ name_ar: 'النوع', name_en: 'Flavor', category_id: smId, group_type: 'flavors', is_required: true }, [
        { name_ar: 'فراولة' }, { name_ar: 'مانجا' }, { name_ar: 'اناناس' }, { name_ar: 'مانجا واناناس' }
    ]);

    // --- PASTA ---
    const pId = findCat('Pasta');
    if (pId) await addGrp({ name_ar: 'إضافات', name_en: 'Addons', category_id: pId, group_type: 'addons' }, [
        { name_ar: 'دجاج إضافي', price: 8 }, { name_ar: 'جبنة بارميزان', price: 4 }, { name_ar: 'مشروم', price: 4 }
    ]);

    console.log('--- FINAL REBUILD COMPLETE ---');
    process.exit(0);
}

finalRebuild();
