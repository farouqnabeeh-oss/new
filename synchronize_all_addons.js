
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncAllAddons() {
    console.log('--- 🛡️ TOTAL BILINGUAL ADDON SYNCHRONIZATION START ---');

    // 1. Get All Categories
    const { data: cats } = await supabase.from('categories').select('id, name_en, name_ar');
    const findCat = (ar, en) => cats.find(c => (c.name_ar === ar || c.name_en === en))?.id;

    // 2. Clean Wipe
    console.log('Performing clean wipe of existing addon data...');
    const { data: groups } = await supabase.from('addon_groups').select('id');
    if (groups && groups.length > 0) {
        const ids = groups.map(g => g.id);
        await supabase.from('addon_group_items').delete().in('addon_group_id', ids);
        await supabase.from('addon_groups').delete().in('id', ids);
    }

    // 3. Helper
    async function add(grp, items) {
        const { data, error } = await supabase.from('addon_groups').insert([{ ...grp, is_active: true }]).select();
        if (error || !data?.[0]) { console.error('Error adding group:', grp.name_ar, error); return; }
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
        console.log(`✅ ${grp.name_ar} / ${grp.name_en} (${items?.length || 0} items)`);
    }

    // --- 1. BURGERS ---
    const bId = findCat('بيرجر', 'Burgers');
    if (bId) {
        await add({ name_ar: 'النوع', name_en: 'Type', category_id: bId, group_type: 'types', is_required: true }, [
            { name_ar: 'بيرجر', name_en: 'Burger', price: 0 }, { name_ar: 'وجبة (بطاطا ومشروب)', name_en: 'Meal (Fries & Drink)', price: 9 }
        ]);
        await add({ name_ar: 'إضافات داخل البرجر', name_en: 'Inside Addons', category_id: bId, group_type: 'addons' }, [
            { name_ar: 'لحمة 120غ', name_en: 'Beef 120g', price: 12 }, { name_ar: 'لحمة 150غ', name_en: 'Beef 150g', price: 15 },
            { name_ar: 'ريب آي', name_en: 'Ribeye', price: 15 }, { name_ar: 'فيليه', name_en: 'Fillet', price: 12 },
            { name_ar: 'جبنة إضافية', name_en: 'Extra Cheese', price: 3 }, { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
            { name_ar: 'ماشروم', name_en: 'Mushroom', price: 3 }, { name_ar: 'خبز جلوتين فري', name_en: 'Gluten Free Bread', price: 5 },
            { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 }, { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 3 },
            { name_ar: '2 موزاريلا', name_en: '2 Mozzarella', price: 8 }, { name_ar: '3 حلقات بصل', name_en: '3 Onion Rings', price: 5 },
            { name_ar: 'وايت صوص', name_en: 'White Sauce', price: 5 }
        ]);
        await add({ name_ar: 'إضافة على جنب', name_en: 'Side Addons', category_id: bId, group_type: 'side_addons' }, [
            { name_ar: 'حلقات بصل (8)', name_en: 'Onion Rings (8pcs)', price: 10 }, { name_ar: 'موزاريلا (3)', name_en: 'Mozzarella (3pcs)', price: 12 },
            { name_ar: 'بوب كورن دجاج', name_en: 'Chicken Popcorn', price: 12 }, { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 8 }, { name_ar: 'علبة جبنة', name_en: 'Cheese Cup', price: 5 }
        ]);
        await add({ name_ar: 'بدون', name_en: 'Without', category_id: bId, group_type: 'without' }, [
            { name_ar: 'بدون مخلل', name_en: 'No Pickles' }, { name_ar: 'بدون بندورة', name_en: 'No Tomato' }, { name_ar: 'بدون بصل', name_en: 'No Onion' }, { name_ar: 'بدون جبنة', name_en: 'No Cheese' }, { name_ar: 'بدون خس', name_en: 'No Lettuce' }, { name_ar: 'بدون صوص', name_en: 'No Sauce' }
        ]);
        // Drink & Fries (Global for Burger Meals)
        await add({ name_ar: 'اختر المشروب', name_en: 'Select Drink', category_id: bId, group_type: 'MealDrink', is_required: true }, [
            { name_ar: 'كولا', name_en: 'Cola' }, { name_ar: 'كولا زيرو', name_en: 'Cola Zero' }, { name_ar: 'فانتا', name_en: 'Fanta' }, { name_ar: 'سبرايت', name_en: 'Sprite' }, { name_ar: 'ماء', name_en: 'Water' }, { name_ar: 'كابي', name_en: 'Cappy' }
        ]);
        await add({ name_ar: 'تبديل المشروب', name_en: 'Upgrade Drink', category_id: bId, group_type: 'MealDrinkUpgrade' }, [
            { name_ar: 'XL', name_en: 'XL Drink', price: 4 }, { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 }, { name_ar: 'صودا', name_en: 'Soda', price: 4 }
        ]);
        await add({ name_ar: 'تبديل البطاطا', name_en: 'Change Fries', category_id: bId, group_type: 'MealFries' }, [
            { name_ar: 'كيرلي', name_en: 'Curly Fries', price: 5 }, { name_ar: 'ويدجز', name_en: 'Wedges', price: 5 }, { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 }, { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 }
        ]);
    }

    // --- 2. SANDWICHES ---
    const sId = findCat('ساندويشات', 'Sandwiches');
    if (sId) {
        await add({ name_ar: 'النوع', name_en: 'Type', category_id: sId, group_type: 'types', is_required: true }, [
            { name_ar: 'ساندويش', name_en: 'Sandwich', price: 0 }, { name_ar: 'وجبة (بطاطا ومشروب)', name_en: 'Meal (Fries & Drink)', price: 9 }
        ]);
        await add({ name_ar: 'إضافات', name_en: 'Addons', category_id: sId, group_type: 'addons' }, [
            { name_ar: 'لحمة 120غ', name_en: 'Beef 120g', price: 12 }, { name_ar: 'سلامي', name_en: 'Salami', price: 5 }, { name_ar: 'بيكون', name_en: 'Bacon', price: 5 }, { name_ar: 'جبنة', name_en: 'Cheese', price: 3 }, { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 3 }
        ]);
        await add({ name_ar: 'بدون', name_en: 'Without', category_id: sId, group_type: 'without' }, [
            { name_ar: 'بدون مخلل', name_en: 'No Pickles' }, { name_ar: 'بدون بندورة', name_en: 'No Tomato' }, { name_ar: 'بدون بصل', name_en: 'No Onion' }, { name_ar: 'بدون خس', name_en: 'No Lettuce' }, { name_ar: 'بدون صوص', name_en: 'No Sauce' }
        ]);
        await add({ name_ar: 'اختر المشروب', name_en: 'Select Drink', category_id: sId, group_type: 'MealDrink', is_required: true }, [
            { name_ar: 'كولا', name_en: 'Cola' }, { name_ar: 'كولا زيرو', name_en: 'Cola Zero' }, { name_ar: 'فانتا', name_en: 'Fanta' }, { name_ar: 'سبرايت', name_en: 'Sprite' }, { name_ar: 'ماء', name_en: 'Water' }
        ]);
        await add({ name_ar: 'تبديل المشروب', name_en: 'Upgrade Drink', category_id: sId, group_type: 'MealDrinkUpgrade' }, [
            { name_ar: 'XL', name_en: 'XL Drink', price: 4 }, { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 }, { name_ar: 'صودا', name_en: 'Soda', price: 4 }
        ]);
        await add({ name_ar: 'تبديل البطاطا', name_en: 'Change Fries', category_id: sId, group_type: 'MealFries' }, [
            { name_ar: 'كيرلي', name_en: 'Curly Fries', price: 5 }, { name_ar: 'ويدجز', name_en: 'Wedges', price: 5 }, { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 }, { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 }
        ]);
    }

    // --- 3. SALADS ---
    const slId = findCat('سلطات', 'Salads');
    if (slId) {
        await add({ name_ar: 'إضافات', name_en: 'Addons', category_id: slId, group_type: 'addons' }, [
            { name_ar: 'دجاج إضافي', name_en: 'Extra Chicken', price: 8 }, { name_ar: 'حلوم إضافي', name_en: 'Extra Halloumi', price: 7 }, { name_ar: 'أفوكادو إضافي', name_en: 'Extra Avocado', price: 8 }
        ]);
    }

    // --- 4. BREAKFAST ---
    const brId = findCat('إفطار', 'Breakfast');
    if (brId) {
        await add({ name_ar: 'نوع البيض', name_en: 'Egg Style', category_id: brId, group_type: 'types', is_required: true }, [
            { name_ar: 'مقلي', name_en: 'Fried' }, { name_ar: 'أومليت', name_en: 'Omelette' }, { name_ar: 'شكشوكة', name_en: 'Shakshuka' }
        ]);
    }

    // --- 5. MANAKISH ---
    const mnId = findCat('مناقيش', 'Manakish');
    if (mnId) {
        await add({ name_ar: 'إضافات', name_en: 'Addons', category_id: mnId, group_type: 'addons' }, [
            { name_ar: 'جبنة إضافية', name_en: 'Extra Cheese', price: 5 }, { name_ar: 'خضار جانبي', name_en: 'Side Veggies', price: 5 }
        ]);
    }

    // --- 6. APPETIZERS ---
    const apId = findCat('مقبلات', 'Appetizers');
    if (apId) {
        await add({ name_ar: 'صوص جانبي', name_en: 'Side Sauce', category_id: apId, group_type: 'addons' }, [
            { name_ar: 'مايونيز ثوم', name_en: 'Garlic Mayo', price: 2 }, { name_ar: 'سبايسي صوص', name_en: 'Spicy Sauce', price: 2 }, { name_ar: 'باربيكيو', name_en: 'BBQ', price: 2 }
        ]);
    }

    // --- 7. MAIN MEALS ---
    const mmId = findCat('وجبات رئيسية', 'Main Meals');
    if (mmId) {
        await add({ name_ar: 'إضافات', name_en: 'Addons', category_id: mmId, group_type: 'addons' }, [ { name_ar: 'صحن أرز إضافي', name_en: 'Extra Rice', price: 10 } ]);
        await add({ name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: mmId, group_type: 'Doneness' }, [
            { name_ar: 'ميديوم', name_en: 'Medium' }, { name_ar: 'ميديوم ويل', name_en: 'Medium Well' }, { name_ar: 'ويل دون', name_en: 'Well Done' }
        ]);
    }

    // --- 8. PASTA ---
    const psId = findCat('باستا', 'Pasta');
    if (psId) {
        await add({ name_ar: 'إضافات', name_en: 'Addons', category_id: psId, group_type: 'addons' }, [
            { name_ar: 'دجاج إضافي', name_en: 'Extra Chicken', price: 8 }, { name_ar: 'جمبري إضافي', name_en: 'Extra Shrimp', price: 15 }, { name_ar: 'جبنة بارميزان', name_en: 'Extra Parmesan', price: 4 }, { name_ar: 'مشروم إضافي', name_en: 'Extra Mushroom', price: 4 }
        ]);
    }

    // --- 9. WINGS ---
    const wgId = findCat('أجنحة', 'Wings');
    if (wgId) {
        await add({ name_ar: 'الحجم', name_en: 'Size', category_id: wgId, group_type: 'sizes', is_required: true }, [
            { name_ar: '10 قطع', name_en: '10 Pieces', price: 0 }, { name_ar: '20 قطعة', name_en: '20 Pieces', price: 12 }
        ]);
        await add({ name_ar: 'الصوص', name_en: 'Sauce', category_id: wgId, group_type: 'types', is_required: true }, [
            { name_ar: 'بافلو', name_en: 'Buffalo' }, { name_ar: 'باربيكيو', name_en: 'BBQ' }, { name_ar: 'ثوم وليمون', name_en: 'Garlic Lemon' }, { name_ar: 'تيراكي', name_en: 'Teriyaki' }
        ]);
    }

    // --- 10. HOOKAH ---
    const hkId = findCat('أراجيل', 'Hookah');
    if (hkId) {
        await add({ name_ar: 'النكهة', name_en: 'Flavor', category_id: hkId, group_type: 'flavors', is_required: true }, [
            { name_ar: 'ليمون ونعنع', name_en: 'Lemon & Mint' }, { name_ar: 'تفاحتين', name_en: 'Double Apple' }, { name_ar: 'مستكة وقرفة', name_en: 'Gum & Cinnamon' }, { name_ar: 'بلوبري', name_en: 'Blueberry' }, { name_ar: 'بطيخ ونعنع', name_en: 'Watermelon & Mint' }, { name_ar: 'نخلة', name_en: 'Nakhla' }
        ]);
    }

    // --- 11. JUICES ---
    const jcId = findCat('عصائر طبيعية', 'Natural Juices');
    if (jcId) {
        await add({ name_ar: 'الحجم', name_en: 'Size', category_id: jcId, group_type: 'sizes', is_required: true }, [
            { name_ar: 'وسط', name_en: 'Medium', price: 0 }, { name_ar: 'كبير', name_en: 'Large', price: 5 }
        ]);
    }

    // --- 12. MILKSHAKE ---
    const mkId = findCat('ميلك شيك', 'Milkshake');
    if (mkId) {
        await add({ name_ar: 'النكهة', name_en: 'Flavor', category_id: mkId, group_type: 'flavors', is_required: true }, [
            { name_ar: 'فراولة', name_en: 'Strawberry' }, { name_ar: 'فانيلا', name_en: 'Vanilla' }, { name_ar: 'اوريو', name_en: 'Oreo' }, { name_ar: 'لوتس', name_en: 'Lotus' }, { name_ar: 'كوفي كراش', name_en: 'Coffee Crush' }
        ]);
    }

    // --- 13. SMOOTHIE ---
    const stId = findCat('سموذي طبيعي', 'Natural Smoothie');
    if (stId) {
        await add({ name_ar: 'النكهة', name_en: 'Flavor', category_id: stId, group_type: 'flavors', is_required: true }, [
            { name_ar: 'فراولة', name_en: 'Strawberry' }, { name_ar: 'مانجا', name_en: 'Mango' }, { name_ar: 'اناناس', name_en: 'Pineapple' }, { name_ar: 'مانجا وباشن', name_en: 'Mango Passion' }, { name_ar: 'بينك ليمونيد', name_en: 'Pink Lemonade' }
        ]);
    }

    // --- 14. COLD COFFEE ---
    const cfId = findCat('قهوة باردة', 'Cold Coffee');
    if (cfId) {
        await add({ name_ar: 'الحجم', name_en: 'Size', category_id: cfId, group_type: 'sizes', is_required: true }, [
            { name_ar: 'وسط', name_en: 'Medium', price: 0 }, { name_ar: 'كبير', name_en: 'Large', price: 3 }
        ]);
    }

    // --- 15. HOT DRINKS ---
    const hdId = findCat('مشروبات ساخنة', 'Hot Drinks');
    if (hdId) {
        await add({ name_ar: 'إضافات', name_en: 'Addons', category_id: hdId, group_type: 'addons' }, [
            { name_ar: 'عسل', name_en: 'Honey', price: 2 }, { name_ar: 'زنجبيل طازج', name_en: 'Fresh Ginger', price: 2 }
        ]);
    }

    // --- 16. CREPE / WAFFLE ---
    const cwId = findCat('كريب ووافل', 'Crepe & Waffle');
    if (cwId) {
        await add({ name_ar: 'إضافات', name_en: 'Extra Toppings', category_id: cwId, group_type: 'addons' }, [
            { name_ar: 'نوتيلا إضافية', name_en: 'Extra Nutella', price: 5 }, { name_ar: 'فواكه إضافية', name_en: 'Extra Fruits', price: 7 }, { name_ar: 'بوظة', name_en: 'Ice Cream Cup', price: 6 }
        ]);
    }

    // --- 17. KIDS MEALS ---
    const kdId = findCat('وجبات أطفال', 'Kids Meals');
    if (kdId) {
        await add({ name_ar: 'اختر العصير', name_en: 'Select Juice', category_id: kdId, group_type: 'types', is_required: true }, [
            { name_ar: 'عصير برتقال', name_en: 'Orange Juice' }, { name_ar: 'عصير تفاح', name_en: 'Apple Juice' }
        ]);
    }

    console.log('--- 🛡️ TOTAL SYNCHRONIZATION COMPLETE ---');
    process.exit(0);
}

syncAllAddons();
