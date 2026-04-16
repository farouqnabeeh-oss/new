require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fullRebuildAddons() {

    // ==============================
    // STEP 1: Get all categories & products
    // ==============================
    const { data: cats } = await supabase.from('categories').select('id, name_en');
    const { data: prods } = await supabase.from('products').select('id, name_en, category_id');

    const catMap = Object.fromEntries(cats.map(c => [c.name_en, c.id]));
    const prodMap = Object.fromEntries(prods.map(p => [p.name_en, p]));

    console.log('Categories:', Object.keys(catMap).join(', '));

    // ==============================
    // STEP 2: Delete ALL existing addon groups and items
    // ==============================
    console.log('\nDeleting all existing addon groups...');
    const { data: allGroups } = await supabase.from('addon_groups').select('id');
    if (allGroups && allGroups.length > 0) {
        const ids = allGroups.map(g => g.id);
        // Delete items first
        const { error: itemErr } = await supabase.from('addon_group_items').delete().in('addon_group_id', ids);
        if (itemErr) console.log('Item delete error:', itemErr.message);
        // Delete groups
        const { error: grpErr } = await supabase.from('addon_groups').delete().in('id', ids);
        if (grpErr) console.log('Group delete error:', grpErr.message);
        console.log(`Deleted ${ids.length} groups.`);
    }

    // ==============================
    // HELPER: insert group + items
    // ==============================
    async function insertGroup(groupData, items) {
        const { data: g, error } = await supabase.from('addon_groups').insert([groupData]).select();
        if (error || !g || g.length === 0) {
            console.log(`  ERROR inserting group "${groupData.name_ar}":`, error?.message || 'no data');
            return;
        }
        const gid = g[0].id;
        if (items && items.length > 0) {
            const toInsert = items.map((it, idx) => ({ ...it, addon_group_id: gid, sort_order: it.sort_order ?? idx + 1, is_active: true }));
            const { error: iErr } = await supabase.from('addon_group_items').insert(toInsert);
            if (iErr) console.log(`  ERROR inserting items for "${groupData.name_ar}":`, iErr.message);
        }
        console.log(`  ✅ ${groupData.name_ar} [${items?.length || 0} items]`);
    }

    // ====================================
    // SECTION A: BURGERS (category_id = catMap.Burgers)
    // ====================================
    console.log('\n=== BURGERS ===');
    const burgerCatId = catMap['Burgers'];
    if (burgerCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: burgerCatId, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'بيرجر', name_en: 'Burger', price: 0, sort_order: 1 },
            { name_ar: 'وجبة (مع بطاطا ومشروب غازي)', name_en: 'Meal (Fries & Drink)', price: 9, sort_order: 2 },
        ]);
        await insertGroup({ name_ar: '➕ إضافة داخل البرغر', name_en: 'Inside Adds', category_id: burgerCatId, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 2, is_active: true }, [
            { name_ar: 'قطعة لحمة 120 غرام', name_en: 'Extra Meat 120g', price: 12 },
            { name_ar: 'قطعة لحمة 150 غرام', name_en: 'Extra Meat 150g', price: 15 },
            { name_ar: 'بورشن ريب آي', name_en: 'Ribeye Portion', price: 15 },
            { name_ar: 'بورشن فيليه', name_en: 'Fillet Portion', price: 12 },
            { name_ar: 'جبنة على البرغر', name_en: 'Extra Cheese', price: 3 },
            { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
            { name_ar: 'ماشروم', name_en: 'Mushroom', price: 3 },
            { name_ar: 'خبز خالي من الجلوتين', name_en: 'Gluten Free Bread', price: 5 },
            { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 },
            { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 3 },
            { name_ar: 'أصبعين موزاريلا', name_en: '2 Mozzarella Sticks', price: 8 },
            { name_ar: '3 حلقات بصل', name_en: '3 Onion Rings', price: 5 },
            { name_ar: 'وايت صوص', name_en: 'White Sauce', price: 5 },
        ]);
        await insertGroup({ name_ar: '🥗 إضافة على جنب', name_en: 'Side Adds', category_id: burgerCatId, group_type: 'side_addons', is_required: false, allow_multiple: true, sort_order: 3, is_active: true }, [
            { name_ar: 'حلقات بصل 8 قطع', name_en: 'Onion Rings 8pcs', price: 10 },
            { name_ar: 'أصابع موزاريلا 3 قطع', name_en: 'Mozzarella Sticks 3pcs', price: 12 },
            { name_ar: 'بوب كورن دجاج', name_en: 'Chicken Popcorn', price: 12 },
            { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 8 },
            { name_ar: 'علبة جبنة', name_en: 'Cheese Cup', price: 5 },
        ]);
        await insertGroup({ name_ar: '🚫 بدون', name_en: 'Without', category_id: burgerCatId, group_type: 'without', is_required: false, allow_multiple: true, sort_order: 4, is_active: true }, [
            { name_ar: 'مخلل', name_en: 'Pickles', price: 0 },
            { name_ar: 'بندورة', name_en: 'Tomato', price: 0 },
            { name_ar: 'بصل', name_en: 'Onion', price: 0 },
            { name_ar: 'جبنة', name_en: 'Cheese', price: 0 },
            { name_ar: 'خس', name_en: 'Lettuce', price: 0 },
            { name_ar: 'صوص', name_en: 'Sauce', price: 0 },
        ]);
        // Meal-only groups
        await insertGroup({ name_ar: '🥤 اختر المشروب (للوجبة فقط)', name_en: 'Select Drink', category_id: burgerCatId, group_type: 'MealDrink', is_required: true, allow_multiple: false, sort_order: 5, is_active: true }, [
            { name_ar: 'كولا', name_en: 'Cola', price: 0 },
            { name_ar: 'كولا زيرو', name_en: 'Cola Zero', price: 0 },
            { name_ar: 'فانتا', name_en: 'Fanta', price: 0 },
            { name_ar: 'سبرايت', name_en: 'Sprite', price: 0 },
            { name_ar: 'سبرايت دايت', name_en: 'Sprite Diet', price: 0 },
            { name_ar: 'كابي', name_en: 'Cappy', price: 0 },
            { name_ar: 'ماء', name_en: 'Water', price: 0 },
        ]);
        await insertGroup({ name_ar: '🔄 تبديل المشروب', name_en: 'Change Drink', category_id: burgerCatId, group_type: 'MealDrinkUpgrade', is_required: false, allow_multiple: false, sort_order: 6, is_active: true }, [
            { name_ar: 'XL', name_en: 'XL', price: 4 },
            { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 },
            { name_ar: 'صودا', name_en: 'Soda', price: 4 },
        ]);
        await insertGroup({ name_ar: '🍟 تبديل البطاطا', name_en: 'Change Fries', category_id: burgerCatId, group_type: 'MealFries', is_required: false, allow_multiple: false, sort_order: 7, is_active: true }, [
            { name_ar: 'كيرلي', name_en: 'Curly Fries', price: 5 },
            { name_ar: 'ويدجز', name_en: 'Wedges', price: 5 },
            { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 },
            { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 },
        ]);
    }

    // ====================================
    // SECTION B: SANDWICHES
    // ====================================
    console.log('\n=== SANDWICHES ===');
    const sandwichCatId = catMap['Sandwiches'];
    if (sandwichCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: sandwichCatId, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'ساندويش', name_en: 'Sandwich', price: 0, sort_order: 1 },
            { name_ar: 'وجبة (مع بطاطا ومشروب غازي)', name_en: 'Meal (Fries & Drink)', price: 9, sort_order: 2 },
        ]);
        await insertGroup({ name_ar: '➕ الإضافات', name_en: 'Addons', category_id: sandwichCatId, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 2, is_active: true }, [
            { name_ar: 'قطعة لحمة 120 غرام', name_en: 'Extra Meat 120g', price: 12 },
            { name_ar: 'قطعة لحمة 150 غرام', name_en: 'Extra Meat 150g', price: 15 },
            { name_ar: 'بورشن ريب آي', name_en: 'Ribeye Portion', price: 15 },
            { name_ar: 'بورشن فيليه', name_en: 'Fillet Portion', price: 12 },
            { name_ar: 'جبنة على البرغر', name_en: 'Extra Cheese', price: 3 },
            { name_ar: 'بصل مكرمل', name_en: 'Caramelized Onion', price: 3 },
            { name_ar: 'ماشروم', name_en: 'Mushroom', price: 3 },
            { name_ar: 'خبز خالي من الجلوتين', name_en: 'Gluten Free Bread', price: 5 },
            { name_ar: 'أفوكادو', name_en: 'Avocado', price: 5 },
            { name_ar: 'هالبينو', name_en: 'Jalapeno', price: 3 },
            { name_ar: 'أصبعين موزاريلا', name_en: '2 Mozzarella Sticks', price: 8 },
            { name_ar: '3 حلقات بصل', name_en: '3 Onion Rings', price: 5 },
            { name_ar: 'وايت صوص', name_en: 'White Sauce', price: 5 },
        ]);
        await insertGroup({ name_ar: '🚫 بدون', name_en: 'Without', category_id: sandwichCatId, group_type: 'without', is_required: false, allow_multiple: true, sort_order: 3, is_active: true }, [
            { name_ar: 'مخلل', name_en: 'Pickles', price: 0 },
            { name_ar: 'بندورة', name_en: 'Tomato', price: 0 },
            { name_ar: 'بصل', name_en: 'Onion', price: 0 },
            { name_ar: 'جبنة', name_en: 'Cheese', price: 0 },
            { name_ar: 'خس', name_en: 'Lettuce', price: 0 },
            { name_ar: 'صوص', name_en: 'Sauce', price: 0 },
        ]);
        await insertGroup({ name_ar: '🥤 اختر المشروب (للوجبة فقط)', name_en: 'Select Drink', category_id: sandwichCatId, group_type: 'MealDrink', is_required: true, allow_multiple: false, sort_order: 4, is_active: true }, [
            { name_ar: 'كولا', name_en: 'Cola', price: 0 },
            { name_ar: 'كولا زيرو', name_en: 'Cola Zero', price: 0 },
            { name_ar: 'فانتا', name_en: 'Fanta', price: 0 },
            { name_ar: 'سبرايت', name_en: 'Sprite', price: 0 },
            { name_ar: 'سبرايت دايت', name_en: 'Sprite Diet', price: 0 },
            { name_ar: 'كابي', name_en: 'Cappy', price: 0 },
            { name_ar: 'ماء', name_en: 'Water', price: 0 },
        ]);
        await insertGroup({ name_ar: '🔄 تبديل المشروب', name_en: 'Change Drink', category_id: sandwichCatId, group_type: 'MealDrinkUpgrade', is_required: false, allow_multiple: false, sort_order: 5, is_active: true }, [
            { name_ar: 'XL', name_en: 'XL', price: 4 },
            { name_ar: 'بافاريا', name_en: 'Bavaria', price: 4 },
            { name_ar: 'صودا', name_en: 'Soda', price: 4 },
        ]);
        await insertGroup({ name_ar: '🍟 تبديل البطاطا', name_en: 'Change Fries', category_id: sandwichCatId, group_type: 'MealFries', is_required: false, allow_multiple: false, sort_order: 6, is_active: true }, [
            { name_ar: 'كيرلي', name_en: 'Curly Fries', price: 5 },
            { name_ar: 'ويدجز', name_en: 'Wedges', price: 5 },
            { name_ar: 'بطاطا حلوة', name_en: 'Sweet Potato', price: 5 },
            { name_ar: 'كرات بطاطا', name_en: 'Potato Balls', price: 5 },
        ]);
    }

    // ====================================
    // SECTION C: FAMILY MEALS (الوجبات العائلية)
    // ====================================
    console.log('\n=== FAMILY MEALS ===');
    const familyCat = cats.find(c => c.name_ar?.includes('عائلية') || c.name_en?.includes('Family'));
    if (familyCat) {
        const fid = familyCat.id;
        await insertGroup({ name_ar: 'اختيار المشروب', name_en: 'Choose Drink', category_id: fid, group_type: 'MealDrink', is_required: true, allow_multiple: true, sort_order: 1, is_active: true }, [
            { name_ar: 'كولا', name_en: 'Cola', price: 0 },
            { name_ar: 'كولا زيرو', name_en: 'Cola Zero', price: 0 },
            { name_ar: 'فانتا', name_en: 'Fanta', price: 0 },
            { name_ar: 'سبرايت', name_en: 'Sprite', price: 0 },
            { name_ar: 'ماء', name_en: 'Water', price: 0 },
        ]);
        await insertGroup({ name_ar: 'إضافات الطعام', name_en: 'Food Addons', category_id: fid, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 2, is_active: true }, [
            { name_ar: 'صحن أرز إضافي', name_en: 'Extra Rice Plate', price: 10 },
            { name_ar: 'بطاطا مقلية', name_en: 'Fries', price: 7 },
            { name_ar: 'علبة جبنة', name_en: 'Cheese Cup', price: 5 },
            { name_ar: 'حلقات بصل 8 قطع', name_en: 'Onion Rings 8pcs', price: 10 },
        ]);
    } else {
        console.log('  Family Meals category NOT found - skipping');
    }

    // ====================================
    // SECTION D: MAIN MEALS / وجبات رئيسية
    // ====================================
    console.log('\n=== MAIN MEALS ===');
    const mainCatId = catMap['Main Meals'];
    if (mainCatId) {
        await insertGroup({ name_ar: 'إضافات', name_en: 'Addons', category_id: mainCatId, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 1, is_active: true }, [
            { name_ar: 'صحن أرز إضافي', name_en: 'Extra Rice Plate', price: 10 },
        ]);
        await insertGroup({ name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: mainCatId, group_type: 'Doneness', is_required: true, allow_multiple: false, sort_order: 2, is_active: true }, [
            { name_ar: 'ميديوم', name_en: 'Medium', price: 0 },
            { name_ar: 'ميديوم ويل', name_en: 'Medium Well', price: 0 },
            { name_ar: 'ويل دون', name_en: 'Well Done', price: 0 },
        ]);
        // Grilled Chicken Steak - type
        const gcs = prodMap['Grilled Chicken Steak'];
        if (gcs) {
            await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: mainCatId, product_id: gcs.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 3, is_active: true }, [
                { name_ar: 'مع ثوم و ليمون', name_en: 'With Garlic and Lemon', price: 0 },
                { name_ar: 'مع وايت صوص', name_en: 'With White Sauce', price: 0 },
            ]);
        }
        // Grilled Chicken Steak with Garlic and Lemon -> a separate product
        const gcslp = prodMap['Grilled Chicken Steak with Garlic and Lemon'];
        if (gcslp) {
            await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: mainCatId, product_id: gcslp.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 3, is_active: true }, [
                { name_ar: 'مع ثوم و ليمون', name_en: 'With Garlic and Lemon', price: 0 },
                { name_ar: 'مع وايت صوص', name_en: 'With White Sauce', price: 0 },
            ]);
        }
    }

    // ====================================
    // SECTION E: WINGS / أجنحة
    // ====================================
    console.log('\n=== WINGS ===');
    const wingsCatId = catMap['Wings'];
    if (wingsCatId) {
        await insertGroup({ name_ar: 'الحجم', name_en: 'Size', category_id: wingsCatId, group_type: 'sizes', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: '١٠ قطع', name_en: '10 Pieces', price: 13 },
            { name_ar: '٢٠ قطعة', name_en: '20 Pieces', price: 25 },
        ]);
        await insertGroup({ name_ar: 'صوص', name_en: 'Sauce Choice', category_id: wingsCatId, group_type: 'types', is_required: false, allow_multiple: false, sort_order: 2, is_active: true }, [
            { name_ar: 'صوص البافلو', name_en: 'Buffalo Sauce', price: 0 },
            { name_ar: 'صوص الباربيكيو', name_en: 'BBQ Sauce', price: 0 },
            { name_ar: 'التيراكي', name_en: 'Teriyaki', price: 0 },
            { name_ar: 'السويت شيلي', name_en: 'Sweet Chili', price: 0 },
            { name_ar: 'ثوم وليمون وبارميزان', name_en: 'Garlic Lemon Parmesan', price: 0 },
            { name_ar: 'ثومة وليمون', name_en: 'Garlic Lemon', price: 0 },
        ]);
    }

    // ====================================
    // SECTION F: KIDS MEALS
    // ====================================
    console.log('\n=== KIDS MEALS ===');
    const kidsCatId = catMap['Kids Meals'];
    if (kidsCatId) {
        const kidsChicken = prodMap['Kids Chicken Burger'];
        if (kidsChicken) {
            await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: kidsCatId, product_id: kidsChicken.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
                { name_ar: 'مشوي', name_en: 'Grilled', price: 0 },
                { name_ar: 'مقلي', name_en: 'Fried', price: 0 },
            ]);
        }
    }

    // ====================================
    // SECTION G: DESSERTS / حلويات
    // ====================================
    console.log('\n=== DESSERTS ===');
    const dessertsCatId = catMap['Desserts'];
    if (dessertsCatId) {
        // Ice Cream - flavors
        const iceCream = prodMap['Ice Cream'];
        if (iceCream) {
            await insertGroup({ name_ar: 'النكهة', name_en: 'Flavor', category_id: dessertsCatId, product_id: iceCream.id, group_type: 'types', is_required: true, allow_multiple: true, sort_order: 1, is_active: true }, [
                { name_ar: 'شوكولاتة', name_en: 'Chocolate', price: 0 },
                { name_ar: 'فانيلا', name_en: 'Vanilla', price: 0 },
                { name_ar: 'فراولة', name_en: 'Strawberry', price: 0 },
                { name_ar: 'لوتس', name_en: 'Lotus', price: 0 },
                { name_ar: 'مانجا', name_en: 'Mango', price: 0 },
            ]);
        }
        // Waffle
        const waffle = prodMap['Waffle with Ice Cream'];
        if (waffle) {
            await insertGroup({ name_ar: 'النكهة', name_en: 'Flavor', category_id: dessertsCatId, product_id: waffle.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
                { name_ar: 'شوكولاتة', name_en: 'Chocolate', price: 0 },
                { name_ar: 'فراولة', name_en: 'Strawberry', price: 0 },
                { name_ar: 'لوتس', name_en: 'Lotus', price: 0 },
            ]);
        }
        // Crepe
        const crepe = prodMap['Crepe with Chocolate'];
        if (crepe) {
            await insertGroup({ name_ar: 'الإضافة', name_en: 'Topping', category_id: dessertsCatId, product_id: crepe.id, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 1, is_active: true }, [
                { name_ar: 'نوتيلا', name_en: 'Nutella', price: 0 },
                { name_ar: 'لوتس', name_en: 'Lotus', price: 0 },
                { name_ar: 'بوظة', name_en: 'Ice Cream', price: 3 },
                { name_ar: 'موز', name_en: 'Banana', price: 2 },
            ]);
        }
    }

    // ====================================
    // SECTION H: APPETIZERS / مقبلات
    // ====================================
    console.log('\n=== APPETIZERS ===');
    const appCatId = catMap['Appetizers'];
    if (appCatId) {
        // Mozzarella Sticks 3pcs - add +1
        const mozz3 = prodMap['Mozzarella Sticks 3pcs'];
        if (mozz3) {
            await insertGroup({ name_ar: 'إضافات', name_en: 'Addons', category_id: appCatId, product_id: mozz3.id, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 1, is_active: true }, [
                { name_ar: '+1 موزاريلا', name_en: '+1 Mozzarella', price: 4 },
            ]);
        }
        // Chicken Fingers
        const chickenFingers = prodMap['Chicken Fingers 5pcs'];
        if (chickenFingers) {
            await insertGroup({ name_ar: 'إضافات', name_en: 'Addons', category_id: appCatId, product_id: chickenFingers.id, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 1, is_active: true }, [
                { name_ar: '+5 قطع', name_en: '+5 Pieces', price: 12 },
            ]);
        }
        // Philly Cheese Steak - sauce
        const philly = prodMap['Philly Cheese Steak Specialty'];
        if (philly) {
            await insertGroup({ name_ar: 'اختر الصوص', name_en: 'Choose Sauce', category_id: appCatId, product_id: philly.id, group_type: 'types', is_required: false, allow_multiple: false, sort_order: 1, is_active: true }, [
                { name_ar: 'رانش', name_en: 'Ranch', price: 0 },
                { name_ar: 'بيستو', name_en: 'Pesto', price: 0 },
                { name_ar: 'صوص حار', name_en: 'Spicy Sauce', price: 0 },
            ]);
        }
        // Crispy Tortilla
        const tortilla = prodMap['Crispy Chicken Tortilla Specialty'];
        if (tortilla) {
            await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: appCatId, product_id: tortilla.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
                { name_ar: 'مقلي مقرمش', name_en: 'Crispy Fried', price: 0 },
                { name_ar: 'مشوي', name_en: 'Grilled', price: 0 },
            ]);
        }
    }

    // ====================================
    // SECTION I: COLD DRINKS - Juice
    // ====================================
    console.log('\n=== COLD DRINKS ===');
    const coldDrinksCatId = catMap['Cold Drinks'];
    const juice = prodMap['Juice'];
    if (juice && coldDrinksCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: coldDrinksCatId, product_id: juice.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'برتقال', name_en: 'Orange', price: 0 },
            { name_ar: 'ليمون', name_en: 'Lemon', price: 0 },
            { name_ar: 'ليمون و نعنع', name_en: 'Lemon & Mint', price: 0 },
        ]);
    }

    // ====================================
    // SECTION J: COLD COFFEE
    // ====================================
    console.log('\n=== COLD COFFEE ===');
    const coldCoffeeCatId = catMap['Cold Coffee'];
    if (coldCoffeeCatId) {
        await insertGroup({ name_ar: 'الحجم', name_en: 'Size', category_id: coldCoffeeCatId, group_type: 'sizes', is_required: false, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'وسط', name_en: 'Medium', price: 0 },
            { name_ar: 'كبير', name_en: 'Large', price: 3 },
        ]);
    }

    // ====================================
    // SECTION K: NATURAL SMOOTHIE
    // ====================================
    console.log('\n=== NATURAL SMOOTHIE ===');
    const smoothieCatId = catMap['Natural Smoothie'];
    const smoothie = prodMap['Natural Smoothie'];
    if (smoothie && smoothieCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: smoothieCatId, product_id: smoothie.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'فراولة', name_en: 'Strawberry', price: 0 },
            { name_ar: 'مانجا', name_en: 'Mango', price: 0 },
            { name_ar: 'اناناس', name_en: 'Pineapple', price: 0 },
            { name_ar: 'مانجا مع اناناس', name_en: 'Mango & Pineapple', price: 0 },
            { name_ar: 'مانجا مع مسفلورا', name_en: 'Mango & Passion Fruit', price: 0 },
            { name_ar: 'بينك ليموند', name_en: 'Pink Lemonade', price: 0 },
        ]);
    }

    // ====================================
    // SECTION L: MILKSHAKE
    // ====================================
    console.log('\n=== MILKSHAKE ===');
    const milkshakeCatId = catMap['Milkshake'];
    const milkshake = prodMap['Milkshake'];
    if (milkshake && milkshakeCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: milkshakeCatId, product_id: milkshake.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'فراولة', name_en: 'Strawberry', price: 0 },
            { name_ar: 'فانيلا', name_en: 'Vanilla', price: 0 },
            { name_ar: 'اوريو', name_en: 'Oreo', price: 0 },
            { name_ar: 'لوتس', name_en: 'Lotus', price: 0 },
            { name_ar: 'تشوكليت', name_en: 'Chocolate', price: 0 },
            { name_ar: 'كوفي كراش', name_en: 'Coffee Crush', price: 0 },
        ]);
    }

    // ====================================
    // SECTION M: HOT DRINKS
    // ====================================
    console.log('\n=== HOT DRINKS ===');
    const hotDrinksCatId = catMap['Hot Drinks'];
    const espresso = prodMap['Espresso'];
    const tea = prodMap['Tea'];
    if (espresso && hotDrinksCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: hotDrinksCatId, product_id: espresso.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'سنجل', name_en: 'Single', price: 0 },
            { name_ar: 'دبل', name_en: 'Double', price: 4 },
        ]);
    }
    if (tea && hotDrinksCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: hotDrinksCatId, product_id: tea.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 2, is_active: true }, [
            { name_ar: 'عادي', name_en: 'Regular', price: 0 },
            { name_ar: 'أخضر', name_en: 'Green', price: 0 },
        ]);
    }

    // ====================================
    // SECTION N: HOOKAH / أراجيل
    // ====================================
    console.log('\n=== HOOKAH ===');
    const hookahCatId = catMap['Hookah'];
    const hookah = prodMap['Hookah'];
    if (hookah && hookahCatId) {
        await insertGroup({ name_ar: 'النوع', name_en: 'Type', category_id: hookahCatId, product_id: hookah.id, group_type: 'types', is_required: true, allow_multiple: false, sort_order: 1, is_active: true }, [
            { name_ar: 'ليمون و نعنع', name_en: 'Lemon & Mint', price: 0 },
            { name_ar: 'تفاحتين', name_en: 'Two Apples', price: 0 },
            { name_ar: 'مسكة و قرفة', name_en: 'Mastic & Cinnamon', price: 0 },
            { name_ar: 'بلوبري', name_en: 'Blueberry', price: 0 },
            { name_ar: 'بطيخ و نعنع', name_en: 'Watermelon & Mint', price: 0 },
            { name_ar: 'تفاحتين نخلة', name_en: 'Palm Two Apples', price: 10 },
        ]);
    }

    // ====================================
    // SECTION O: PASTA
    // ====================================
    console.log('\n=== PASTA ===');
    const pastaCatId = catMap['Pasta'];
    if (pastaCatId) {
        await insertGroup({ name_ar: 'إضافات', name_en: 'Addons', category_id: pastaCatId, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 1, is_active: true }, [
            { name_ar: 'دجاج إضافي', name_en: 'Extra Chicken', price: 8 },
            { name_ar: 'جبنة بارميزان', name_en: 'Extra Parmesan', price: 4 },
            { name_ar: 'مشروم', name_en: 'Mushroom', price: 4 },
        ]);
    }

    console.log('\n=====================================');
    console.log('✅ Full addon rebuild COMPLETE!');
    console.log('=====================================');
    process.exit(0);
}

fullRebuildAddons().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
