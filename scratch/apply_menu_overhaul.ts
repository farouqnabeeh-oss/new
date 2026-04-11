
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log('🚀 Starting Exact Menu Sync with Real IDs...');

    try {
        // 1. وجبات رئيسية (Main Meals) - ID 3 - Rice Plate for ALL products in category
        const mainCatId = 3;
        await supabase.from('addon_groups').delete().eq('category_id', mainCatId).eq('name_en', 'Side Dishes');
        const { data: g1 } = await supabase.from('addon_groups').insert({
            name_ar: 'إضافات الطعام', name_en: 'Side Dishes', category_id: mainCatId, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 5, is_active: true
        }).select().single();
        if (g1) {
            await supabase.from('addon_group_items').insert({ addon_group_id: g1.id, name_ar: 'صحن أرز', name_en: 'Rice Plate', price: 10, sort_order: 1, is_active: true });
        }
        console.log('✅ Main Meals Side Dishes synced.');

        // 2. ستيك لحمة (Beef Steak) - ID 20 - Doneness
        const beefSteakId = 20;
        const beefCatId = 3; // It's in main meals
        await supabase.from('addon_groups').delete().eq('product_id', beefSteakId).eq('name_en', 'Doneness');
        const { data: g2 } = await supabase.from('addon_groups').insert({
            name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: beefCatId, product_id: beefSteakId, group_type: 'doneness', is_required: true, allow_multiple: false, sort_order: 1, is_active: true
        }).select().single();
        if (g2) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g2.id, name_ar: 'ميديوم', name_en: 'Medium', price: 0, sort_order: 1 },
                { addon_group_id: g2.id, name_ar: 'ميديوم ويل', name_en: 'Medium Well', price: 0, sort_order: 2 },
                { addon_group_id: g2.id, name_ar: 'ويل دون', name_en: 'Well Done', price: 0, sort_order: 3 }
            ]);
        }
        console.log('✅ Beef Steak Doneness synced.');

        // 3. ستيك دجاج مشوي (Chicken Steak) - ID 12 - Types
        const chickenSteakId = 12;
        await supabase.from('product_types').delete().eq('product_id', chickenSteakId);
        await supabase.from('product_types').insert([
            { product_id: chickenSteakId, name_ar: 'مع ثوم و ليمون', name_en: 'With Garlic & Lemon', price: 45, sort_order: 1 },
            { product_id: chickenSteakId, name_ar: 'مع وايت صوص', name_en: 'With White Sauce', price: 45, sort_order: 2 }
        ]);
        console.log('✅ Chicken Steak Types synced (applied to مشوي).');

        // 4. أجنحة (Wings) - ID 4 - Sizes for all products in category
        const wingsCatId = 4;
        const { data: wingsProds } = await supabase.from('products').select('id').eq('category_id', wingsCatId);
        if (wingsProds) {
            for (const p of wingsProds) {
                await supabase.from('product_sizes').delete().eq('product_id', p.id);
                await supabase.from('product_sizes').insert([
                    { product_id: p.id, name_ar: '١٠ قطع', name_en: '10 Pieces', price: 0, sort_order: 1 },
                    { product_id: p.id, name_ar: '٢٠ قطعة', name_en: '20 Pieces', price: 25, sort_order: 2 }
                ]);
            }
        }
        console.log('✅ Wings Sizes synced.');

        // 5. كيدز بيرجر دجاج (Kids Chicken Burger) - ID 25 - Types
        const kidsBurgerId = 25;
        await supabase.from('product_types').delete().eq('product_id', kidsBurgerId);
        await supabase.from('product_types').insert([
            { product_id: kidsBurgerId, name_ar: 'مشوي', name_en: 'Grilled', price: 0, sort_order: 1 },
            { product_id: kidsBurgerId, name_ar: 'مقلي', name_en: 'Fried', price: 0, sort_order: 2 }
        ]);
        console.log('✅ Kids Chicken Burger synced.');

        // 6. أصابع موزاريلا (Mozzarella Sticks) - ID 105
        await supabase.from('products').update({ base_price: 14 }).eq('id', 105);
        console.log('✅ Mozzarella Sticks synced.');

        // 7. عصير (Juice) - ID 84 - Types
        const juiceId = 84;
        await supabase.from('product_types').delete().eq('product_id', juiceId);
        await supabase.from('product_types').insert([
            { product_id: juiceId, name_ar: 'برتقال', name_en: 'Orange', price: 15, sort_order: 1 },
            { product_id: juiceId, name_ar: 'ليمون', name_en: 'Lemon', price: 15, sort_order: 2 },
            { product_id: juiceId, name_ar: 'ليمون و نعنع', name_en: 'Lemon & Mint', price: 15, sort_order: 3 }
        ]);
        console.log('✅ Juice Types synced.');

        // 8. سموذي طبيعي (Smoothie) - ID 42
        const smoothieId = 42;
        await supabase.from('product_types').delete().eq('product_id', smoothieId);
        await supabase.from('product_types').insert([
            { product_id: smoothieId, name_ar: 'فراولة', name_en: 'Strawberry', price: 17, sort_order: 1 },
            { product_id: smoothieId, name_ar: 'مانجا', name_en: 'Mango', price: 17, sort_order: 2 },
            { product_id: smoothieId, name_ar: 'اناناس', name_en: 'Pineapple', price: 17, sort_order: 3 },
            { product_id: smoothieId, name_ar: 'مانجا مع اناناس', name_en: 'Mango with Pineapple', price: 17, sort_order: 4 },
            { product_id: smoothieId, name_ar: 'مانجا مع مسفلورا', name_en: 'Mango with Passion Fruit', price: 17, sort_order: 5 },
            { product_id: smoothieId, name_ar: 'بينك ليموند', name_en: 'Pink Lemonade', price: 17, sort_order: 6 }
        ]);
        console.log('✅ Smoothie Types synced.');

        // 9. ميلك شيك (Milkshake) - ID 43
        const milkId = 43;
        await supabase.from('product_types').delete().eq('product_id', milkId);
        await supabase.from('product_types').insert([
            { product_id: milkId, name_ar: 'فراولة', name_en: 'Strawberry', price: 17, sort_order: 1 },
            { product_id: milkId, name_ar: 'فانيلا', name_en: 'Vanilla', price: 17, sort_order: 2 },
            { product_id: milkId, name_ar: 'اوريو', name_en: 'Oreo', price: 17, sort_order: 3 },
            { product_id: milkId, name_ar: 'لوتس', name_en: 'Lotus', price: 17, sort_order: 4 },
            { product_id: milkId, name_ar: 'تشوكليت', name_en: 'Chocolate', price: 17, sort_order: 5 },
            { product_id: milkId, name_ar: 'كوفي كراش', name_en: 'Coffee Crush', price: 17, sort_order: 6 }
        ]);
        console.log('✅ Milkshake Types synced.');

        // 10. مشروبات ساخنة (Espresso & Tea) - Espresso ID probably not found exactly "اسبرسو" maybe it's missing or named differently?
        // Let me add it to the hot drinks just in case
        const { data: espresso } = await supabase.from('products').select('id').ilike('name_ar', '%اسبريسو%').maybeSingle();
        if (espresso) {
            await supabase.from('product_types').delete().eq('product_id', espresso.id);
            await supabase.from('product_types').insert([
                { product_id: espresso.id, name_ar: 'سنجل', name_en: 'Single', price: 8, sort_order: 1 },
                { product_id: espresso.id, name_ar: 'دبل', name_en: 'Double', price: 12, sort_order: 2 }
            ]);
            console.log('✅ Espresso Types synced.');
        } else {
             console.log('⚠️ Espresso not found (maybe under different name?).');
        }

        const teaId = 44;
        await supabase.from('product_types').delete().eq('product_id', teaId);
        await supabase.from('product_types').insert([
            { product_id: teaId, name_ar: 'عادي', name_en: 'Regular', price: 8, sort_order: 1 },
            { product_id: teaId, name_ar: 'أخضر', name_en: 'Green', price: 8, sort_order: 2 }
        ]);
        console.log('✅ Hot Drinks synced.');

        // 11. أرجيلة (Hookah) - ID 86
        const hookId = 86;
        await supabase.from('product_types').delete().eq('product_id', hookId);
        await supabase.from('product_types').insert([
            { product_id: hookId, name_ar: 'ليمون و نعنع', name_en: 'Lemon & Mint', price: 30, sort_order: 1 },
            { product_id: hookId, name_ar: 'تفاحتين', name_en: 'Two Apples', price: 30, sort_order: 2 },
            { product_id: hookId, name_ar: 'مسكة و قرفة', name_en: 'Mastic & Cinnamon', price: 30, sort_order: 3 },
            { product_id: hookId, name_ar: 'بلوبري', name_en: 'Blueberry', price: 30, sort_order: 4 },
            { product_id: hookId, name_ar: 'بطيخ و نعنع', name_en: 'Watermelon & Mint', price: 30, sort_order: 5 },
            { product_id: hookId, name_ar: 'تفاحتين نخلة', name_en: 'Two Apples Nakhlah', price: 40, sort_order: 6 }
        ]);
        console.log('✅ Hookah synced.');

        // Verify if Espresso is missing completely, I'll add an Espresso product to category 10 (مجوبات ساخنة)
        if (!espresso) {
            console.log('➕ Creating missing Espresso product...');
            const { data: newEspresso } = await supabase.from('products').insert({
                name_ar: 'اسبريسو',
                name_en: 'Espresso',
                base_price: 8,
                category_id: 10,
                all_branches: true,
                is_active: true
            }).select().single();
            if (newEspresso) {
                await supabase.from('product_types').insert([
                    { product_id: newEspresso.id, name_ar: 'سنجل', name_en: 'Single', price: 8, sort_order: 1 },
                    { product_id: newEspresso.id, name_ar: 'دبل', name_en: 'Double', price: 12, sort_order: 2 }
                ]);
                console.log('✅ Created Espresso with Types.');
            }
        }

    } catch (err) {
        console.error('❌ Sync Error:', err);
    }

    console.log('🎯 Full Exact Sync Complete!');
}

sync();
