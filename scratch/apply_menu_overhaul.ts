
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log('🚀 Starting Full Menu Sync with User Requirements...');

    try {
        // 1. הوجبات الرئيسية (Main Meals) - Rice Plate for ALL products in category
        const { data: mainCat } = await supabase.from('categories').select('id').ilike('name_ar', '%الوجبات الرئيسية%').maybeSingle();
        if (mainCat) {
            await supabase.from('addon_groups').delete().eq('category_id', mainCat.id).eq('name_en', 'Side Dishes');
            const { data: g } = await supabase.from('addon_groups').insert({
                name_ar: 'إضافات جانبية', name_en: 'Side Dishes', category_id: mainCat.id, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 5, is_active: true
            }).select().single();
            if (g) {
                await supabase.from('addon_group_items').insert({ addon_group_id: g.id, name_ar: 'صحن أرز', name_en: 'Rice Plate', price: 10, sort_order: 1, is_active: true });
            }
            console.log('✅ Main Meals Side Dishes synced.');
        }

        // 2. ستيك اللحمة (Beef Steak) - Doneness
        const { data: beefSteak } = await supabase.from('products').select('id, category_id').ilike('name_ar', '%ستيك اللحمة%').maybeSingle();
        if (beefSteak) {
            await supabase.from('addon_groups').delete().eq('product_id', beefSteak.id).eq('name_en', 'Doneness');
            const { data: g } = await supabase.from('addon_groups').insert({
                name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: beefSteak.category_id, product_id: beefSteak.id, group_type: 'doneness', is_required: true, allow_multiple: false, sort_order: 1, is_active: true
            }).select().single();
            if (g) {
                await supabase.from('addon_group_items').insert([
                    { addon_group_id: g.id, name_ar: 'ميديوم', name_en: 'Medium', price: 0, sort_order: 1 },
                    { addon_group_id: g.id, name_ar: 'ميديوم ويل', name_en: 'Medium Well', price: 0, sort_order: 2 },
                    { addon_group_id: g.id, name_ar: 'ويل دون', name_en: 'Well Done', price: 0, sort_order: 3 }
                ]);
            }
            console.log('✅ Beef Steak Doneness synced.');
        }

        // 3. ستيك الدجاج (Chicken Steak) - Types
        const { data: chickenSteak } = await supabase.from('products').select('id').ilike('name_ar', '%ستيك الدجاج%').maybeSingle();
        if (chickenSteak) {
            await supabase.from('product_types').delete().eq('product_id', chickenSteak.id);
            await supabase.from('product_types').insert([
                { product_id: chickenSteak.id, name_ar: 'مع ثوم و ليمون', name_en: 'With Garlic & Lemon', price: 45, sort_order: 1 },
                { product_id: chickenSteak.id, name_ar: 'مع وايت صوص', name_en: 'With White Sauce', price: 45, sort_order: 2 }
            ]);
            console.log('✅ Chicken Steak Types synced.');
        }

        // 4. أجنحة (Wings) - Sizes for all products in category
        const { data: wingsCat } = await supabase.from('categories').select('id').ilike('name_ar', '%أجنحة%').maybeSingle();
        if (wingsCat) {
            const { data: prods } = await supabase.from('products').select('id').eq('category_id', wingsCat.id);
            if (prods) {
                for (const p of prods) {
                    await supabase.from('product_sizes').delete().eq('product_id', p.id);
                    await supabase.from('product_sizes').insert([
                        { product_id: p.id, name_ar: '١٠ قطع', name_en: '10 Pieces', price: 0, sort_order: 1 },
                        { product_id: p.id, name_ar: '٢٠ قطعة', name_en: '20 Pieces', price: 25, sort_order: 2 }
                    ]);
                }
            }
            console.log('✅ Wings Sizes synced.');
        }

        // 5. كيدز بيرجر دجاج (Kids Chicken Burger) - Types
        const { data: kidsBurger } = await supabase.from('products').select('id').ilike('name_ar', '%كيدز بيرجر دجاج%').maybeSingle();
        if (kidsBurger) {
            await supabase.from('product_types').delete().eq('product_id', kidsBurger.id);
            await supabase.from('product_types').insert([
                { product_id: kidsBurger.id, name_ar: 'مشوي', name_en: 'Grilled', price: 0, sort_order: 1 },
                { product_id: kidsBurger.id, name_ar: 'مقلي', name_en: 'Fried', price: 0, sort_order: 2 }
            ]);
            console.log('✅ Kids Chicken Burger synced.');
        }

        // 6. اصابع الموزاريلا (Mozzarella Sticks)
        await supabase.from('products').update({ base_price: 14 }).ilike('name_ar', '%اصابع الموزاريلا%');
        console.log('✅ Mozzarella Sticks synced.');

        // 7. عصير (Juice) - Types
        const { data: juice } = await supabase.from('products').select('id').ilike('name_ar', '%عصير%').maybeSingle();
        if (juice) {
            await supabase.from('product_types').delete().eq('product_id', juice.id);
            await supabase.from('product_types').insert([
                { product_id: juice.id, name_ar: 'برتقال', name_en: 'Orange', price: 15, sort_order: 1 },
                { product_id: juice.id, name_ar: 'ليمون', name_en: 'Lemon', price: 15, sort_order: 2 },
                { product_id: juice.id, name_ar: 'ليمون نعنع', name_en: 'Lemon & Mint', price: 15, sort_order: 3 }
            ]);
            console.log('✅ Juice Types synced.');
        }

        // 8. سموذي طبيعي (Smoothie)
        const { data: smoothie } = await supabase.from('products').select('id').ilike('name_ar', '%سموذي%').maybeSingle();
        if (smoothie) {
            await supabase.from('product_types').delete().eq('product_id', smoothie.id);
            await supabase.from('product_types').insert([
                { product_id: smoothie.id, name_ar: 'فراولة', name_en: 'Strawberry', price: 17, sort_order: 1 },
                { product_id: smoothie.id, name_ar: 'مانجا', name_en: 'Mango', price: 17, sort_order: 2 },
                { product_id: smoothie.id, name_ar: 'اناناس', name_en: 'Pineapple', price: 17, sort_order: 3 },
                { product_id: smoothie.id, name_ar: 'مانجا مع اناناس', name_en: 'Mango with Pineapple', price: 17, sort_order: 4 },
                { product_id: smoothie.id, name_ar: 'مانجا مع مسفلورا', name_en: 'Mango with Passion Fruit', price: 17, sort_order: 5 },
                { product_id: smoothie.id, name_ar: 'بينك ليموند', name_en: 'Pink Lemonade', price: 17, sort_order: 6 }
            ]);
            console.log('✅ Smoothie Types synced.');
        }

        // 9. ميلك شيك (Milkshake)
        const { data: milk } = await supabase.from('products').select('id').ilike('name_ar', '%ميلك شيك%').maybeSingle();
        if (milk) {
            await supabase.from('product_types').delete().eq('product_id', milk.id);
            await supabase.from('product_types').insert([
                { product_id: milk.id, name_ar: 'فراولة', name_en: 'Strawberry', price: 17, sort_order: 1 },
                { product_id: milk.id, name_ar: 'فانيلا', name_en: 'Vanilla', price: 17, sort_order: 2 },
                { product_id: milk.id, name_ar: 'اوريو', name_en: 'Oreo', price: 17, sort_order: 3 },
                { product_id: milk.id, name_ar: 'لوتس', name_en: 'Lotus', price: 17, sort_order: 4 },
                { product_id: milk.id, name_ar: 'تشوكليت', name_en: 'Chocolate', price: 17, sort_order: 5 },
                { product_id: milk.id, name_ar: 'كوفي كراش', name_en: 'Coffee Crush', price: 17, sort_order: 6 }
            ]);
            console.log('✅ Milkshake Types synced.');
        }

        // 10. مشروبات ساخنة (Espresso & Tea)
        const { data: espresso } = await supabase.from('products').select('id').ilike('name_ar', '%اسبرسو%').maybeSingle();
        if (espresso) {
            await supabase.from('product_types').delete().eq('product_id', espresso.id);
            await supabase.from('product_types').insert([
                { product_id: espresso.id, name_ar: 'سنجل', name_en: 'Single', price: 8, sort_order: 1 },
                { product_id: espresso.id, name_ar: 'دبل', name_en: 'Double', price: 12, sort_order: 2 }
            ]);
        }
        const { data: tea } = await supabase.from('products').select('id').ilike('name_ar', '%شاي%').maybeSingle();
        if (tea) {
            await supabase.from('product_types').delete().eq('product_id', tea.id);
            await supabase.from('product_types').insert([
                { product_id: tea.id, name_ar: 'عادي', name_en: 'Regular', price: 8, sort_order: 1 },
                { product_id: tea.id, name_ar: 'أخضر', name_en: 'Green', price: 8, sort_order: 2 }
            ]);
        }
        console.log('✅ Hot Drinks synced.');

        // 11. أرجيلة (Hookah)
        const { data: hook } = await supabase.from('products').select('id').ilike('name_ar', '%أرجيلة%').maybeSingle();
        if (hook) {
            await supabase.from('product_types').delete().eq('product_id', hook.id);
            await supabase.from('product_types').insert([
                { product_id: hook.id, name_ar: 'ليمون نعنع', name_en: 'Lemon & Mint', price: 30, sort_order: 1 },
                { product_id: hook.id, name_ar: 'تفاحتين', name_en: 'Two Apples', price: 30, sort_order: 2 },
                { product_id: hook.id, name_ar: 'مسكة و قرفة', name_en: 'Mastic & Cinnamon', price: 30, sort_order: 3 },
                { product_id: hook.id, name_ar: 'بلوبري', name_en: 'Blueberry', price: 30, sort_order: 4 },
                { product_id: hook.id, name_ar: 'بطيخ و نعنع', name_en: 'Watermelon & Mint', price: 30, sort_order: 5 },
                { product_id: hook.id, name_ar: 'تفاحتين نخلة', name_en: 'Two Apples Nakhlah', price: 40, sort_order: 6 }
            ]);
            console.log('✅ Hookah synced.');
        }

    } catch (err) {
        console.error('❌ Sync Error:', err);
    }

    console.log('🎯 Full Sync Complete!');
}

sync();
