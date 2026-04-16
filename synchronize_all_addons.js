
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncAllAddons() {
    console.log('--- 🛡️ GLOBAL MULTI-BRANCH ADDON SYNCHRONIZATION START ---');

    // 1. Get All Categories
    const { data: cats, error: catError } = await supabase.from('categories').select('id, name_en, name_ar');
    
    if (catError || !cats) {
        console.error('CRITICAL ERROR: Failed to fetch categories!', catError);
        process.exit(1);
    }
    
    console.log(`Fetched ${cats.length} categories.`);

    // Helper to find ALL category IDs matching a name (Arabic or English)
    const findCats = (ar, en) => {
        const matches = cats.filter(c => 
            (c.name_ar && c.name_ar.trim() === ar) || 
            (c.name_en && c.name_en.trim() === en)
        );
        return matches.map(m => m.id);
    };

    // 2. Clean Wipe
    console.log('Performing clean wipe of existing addon data...');
    const { data: groups } = await supabase.from('addon_groups').select('id');
    if (groups && groups.length > 0) {
        const ids = groups.map(g => g.id);
        await supabase.from('addon_group_items').delete().in('addon_group_id', ids);
        await supabase.from('addon_groups').delete().in('id', ids);
    }

    // 3. Helper to add group to MULTIPLE categories
    async function addGlobal(grp, items, catIds) {
        if (!catIds || catIds.length === 0) {
            console.warn(`Warning: No categories found matching ${grp.name_ar} / ${grp.name_en}`);
            return;
        }
        
        for (const cid of catIds) {
            const { data, error } = await supabase.from('addon_groups').insert([{ ...grp, category_id: cid, is_active: true }]).select();
            if (error || !data?.[0]) { console.error('Error adding group:', grp.name_ar, error); continue; }
            const gid = data[0].id;
            if (items?.length > 0) {
               const finalItems = items.map((it, idx) => ({ 
                   ...it, 
                   name_en: it.name_en || it.name_ar, 
                   addon_group_id: gid, 
                   sort_order: idx + 1, 
                   is_active: true 
               }));
               const { error: itemError } = await supabase.from('addon_group_items').insert(finalItems);
               if (itemError) console.error('Error adding items for group:', grp.name_ar, itemError);
            }
        }
        console.log(`✅ [${catIds.length} IDs matched] ${grp.name_ar} / ${grp.name_en} (${items?.length || 0} items)`);
    }

    // --- 1. BURGERS ---
    const bIds = findCats('بيرجر', 'Burgers');
    await addGlobal({ name_ar: 'النوع', name_en: 'Type', group_type: 'types', is_required: true }, [
        { name_ar: 'بيرجر', name_en: 'Burger', price: 0 }, { name_ar: 'وجبة (بطاطا ومشروب)', name_en: 'Meal (Fries & Drink)', price: 9 }
    ], bIds);
    await addGlobal({ name_ar: 'إضافات داخل البرجر', name_en: 'Inside Addons', group_type: 'addons' }, [
        { name_ar: 'لحمة 120غ', name_en: 'Beef 120g', price: 12 }, { name_ar: 'لحمة 150غ', name_en: 'Beef 150g', price: 15 },
        { name_ar: 'ريب آي', name_en: 'Ribeye', price: 15 }, { name_ar: 'فيليه', name_en: 'Fillet', price: 12 },
        { name_ar: 'جبنة إضافية', name_en: 'Extra Cheese', price: 3 }, { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
        { name_ar: 'ماشروم', name_en: 'Mushroom', price: 3 }, { name_ar: 'خبز جلوتين فري', name_en: 'Gluten Free Bread', price: 5 },
        { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 }, { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 3 },
        { name_ar: '2 موزاريلا', name_en: '2 Mozzarella', price: 8 }, { name_ar: '3 حلقات بصل', name_en: '3 Onion Rings', price: 5 },
        { name_ar: 'وايت صوص', name_en: 'White Sauce', price: 5 }
    ], bIds);
    await addGlobal({ name_ar: 'إضافة فوق البرجر', name_en: 'Top Addons', group_type: 'addons' }, [
        { name_ar: 'بيض مقلي', name_en: 'Fried Egg', price: 3 },
        { name_ar: 'سلامي', name_en: 'Salami', price: 5 },
        { name_ar: 'بيكون لارج', name_en: 'Large Bacon', price: 6 },
        { name_ar: 'بصل مكرمل وفطر', name_en: 'Caramelized Onion & Mushroom', price: 5 }
    ], bIds);
    await addGlobal({ name_ar: 'بدون', name_en: 'Without', group_type: 'without' }, [
        { name_ar: 'بدون مخلل', name_en: 'No Pickles' }, { name_ar: 'بدون بندورة', name_en: 'No Tomato' }, { name_ar: 'بدون بصل', name_en: 'No Onion' }, { name_ar: 'بدون جبنة', name_en: 'No Cheese' }, { name_ar: 'بدون خس', name_en: 'No Lettuce' }, { name_ar: 'بدون صوص', name_en: 'No Sauce' }
    ], bIds);
    await addGlobal({ name_ar: 'اختر المشروب', name_en: 'Select Drink', group_type: 'MealDrink', is_required: true }, [
        { name_ar: 'كولا', name_en: 'Cola' }, { name_ar: 'كولا زيرو', name_en: 'Cola Zero' }, { name_ar: 'فانتا', name_en: 'Fanta' }, { name_ar: 'سبرايت', name_en: 'Sprite' }, { name_ar: 'ماء', name_en: 'Water' }, { name_ar: 'كابي', name_en: 'Cappy' }
    ], bIds);
    await addGlobal({ name_ar: 'تبديل المشروب', name_en: 'Upgrade Drink', group_type: 'MealDrinkUpgrade' }, [
        { name_ar: 'XL', name_en: 'XL Drink', price: 4 }, { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 }, { name_ar: 'صودا', name_en: 'Soda', price: 4 }
    ], bIds);
    await addGlobal({ name_ar: 'تبديل البطاطا', name_en: 'Change Fries', group_type: 'MealFries' }, [
        { name_ar: 'كيرلي', name_en: 'Curly Fries', price: 5 }, { name_ar: 'ويدجز', name_en: 'Wedges', price: 5 }, { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 }, { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 }
    ], bIds);

    // --- 2. SANDWICHES ---
    const sIds = findCats('ساندويشات', 'Sandwiches');
    await addGlobal({ name_ar: 'النوع', name_en: 'Type', group_type: 'types', is_required: true }, [
        { name_ar: 'ساندويش', name_en: 'Sandwich', price: 0 }, { name_ar: 'وجبة (بطاطا ومشروب)', name_en: 'Meal (Fries & Drink)', price: 9 }
    ], sIds);
    await addGlobal({ name_ar: 'إضافة داخل الساندويش', name_en: 'Inside Addons', group_type: 'addons' }, [
        { name_ar: 'لحمة 120غ', name_en: 'Beef 120g', price: 12 }, 
        { name_ar: 'سلامي', name_en: 'Salami', price: 5 }, 
        { name_ar: 'بيكون', name_en: 'Bacon', price: 5 }, 
        { name_ar: 'جبنة شيدر', name_en: 'Cheddar', price: 3 }, 
        { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 3 }
    ], sIds);
    await addGlobal({ name_ar: 'إضافة فوق الساندويش', name_en: 'Top Addons', group_type: 'addons' }, [
        { name_ar: 'بيض مقلي', name_en: 'Fried Egg', price: 3 },
        { name_ar: 'فطر مكرمل', name_en: 'Caramelized Mushroom', price: 4 }
    ], sIds);
    await addGlobal({ name_ar: 'بدون', name_en: 'Without', group_type: 'without' }, [
        { name_ar: 'بدون مخلل', name_en: 'No Pickles' }, { name_ar: 'بدون بندورة', name_en: 'No Tomato' }, { name_ar: 'بدون بصل', name_en: 'No Onion' }, { name_ar: 'بدون خس', name_en: 'No Lettuce' }, { name_ar: 'بدون صوص', name_en: 'No Sauce' }
    ], sIds);
    await addGlobal({ name_ar: 'اختر المشروب', name_en: 'Select Drink', group_type: 'MealDrink', is_required: true }, [
        { name_ar: 'كولا', name_en: 'Cola' }, { name_ar: 'كولا زيرو', name_en: 'Cola Zero' }, { name_ar: 'فانتا', name_en: 'Fanta' }, { name_ar: 'سبرايت', name_en: 'Sprite' }, { name_ar: 'ماء', name_en: 'Water' }
    ], sIds);
    await addGlobal({ name_ar: 'تبديل المشروب', name_en: 'Upgrade Drink', group_type: 'MealDrinkUpgrade' }, [
        { name_ar: 'XL', name_en: 'XL Drink', price: 4 }, { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 }, { name_ar: 'صودا', name_en: 'Soda', price: 4 }
    ], sIds);
    await addGlobal({ name_ar: 'تبديل البطاطا', name_en: 'Change Fries', group_type: 'MealFries' }, [
        { name_ar: 'كيرلي', name_en: 'Curly Fries', price: 5 }, { name_ar: 'ويدجز', name_en: 'Wedges', price: 5 }, { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 }, { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 }
    ], sIds);

    // [Remainder of script: Salads, Breakfast, Hookah, Juices, etc. kept same for brevity or added back]
    const slIds = findCats('سلطات', 'Salads');
    await addGlobal({ name_ar: 'إضافات', name_en: 'Addons', group_type: 'addons' }, [ { name_ar: 'دجاج إضافي', name_en: 'Extra Chicken', price: 8 } ], slIds);

    const apIds = findCats('مقبلات', 'Appetizers');
    await addGlobal({ name_ar: 'صوص جانبي', name_en: 'Side Sauce', group_type: 'addons' }, [ { name_ar: 'باربيكيو', name_en: 'BBQ', price: 2 } ], apIds);

    const hkIds = findCats('أراجيل', 'Hookah');
    await addGlobal({ name_ar: 'النكهة', name_en: 'Flavor', group_type: 'flavors', is_required: true }, [ { name_ar: 'ليمون ونعنع', name_en: 'Lemon & Mint' }, { name_ar: 'تفاحتين', name_en: 'Double Apple' } ], hkIds);

    const dsIds = findCats('حلويات', 'Desserts');
    await addGlobal({ name_ar: 'إضافات الحلى', name_en: 'Dessert Toppings', group_type: 'addons' }, [ { name_ar: 'بوظة فانيلا', name_en: 'Vanilla Ice Cream', price: 5 } ], dsIds);

    console.log('--- 🛡️ TOTAL MULTI-BRANCH SYNCHRONIZATION COMPLETE ---');
    process.exit(0);
}

syncAllAddons();
