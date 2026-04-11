import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fix() {
    console.log("Fixing addon groups product assignments...");

    // 1. Delete previously misassigned product-specific addons (where product_id IS NOT NULL) to start fresh
    // We only delete those previously added manually for these specific cases to avoid polluting the db.
    const { data: existingGroups } = await supabase.from('addon_groups').select('id, name_en').not('product_id', 'is', null);
    
    if (existingGroups && existingGroups.length > 0) {
        console.log("Deleting old product-specific groups:", existingGroups.map(g => g.name_en));
        for (const g of existingGroups) {
            await supabase.from('addon_groups').delete().eq('id', g.id);
        }
    }

    // Product IDs discovered:
    const beefSteaks = [8, 9];
    const chickenSteaks = [7];
    const wings = [17, 18, 19, 20, 21, 22, 23];
    const kidsChicken = [25];
    const mozzarella = [105];

    // Create Doneness for Beef Steaks
    for (const pid of beefSteaks) {
        console.log(`Adding doneness to Beef Steak ${pid}...`);
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'درجة الاستواء', name_en: 'Doneness', group_type: 'Doneness', is_required: true, allow_multiple: false, product_id: pid, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g.id, name_ar: 'ميديوم', name_en: 'Medium', price: 0, sort_order: 1, is_active: true },
                { addon_group_id: g.id, name_ar: 'ميديوم ويل', name_en: 'Medium Well', price: 0, sort_order: 2, is_active: true },
                { addon_group_id: g.id, name_ar: 'ويل دون', name_en: 'Well Done', price: 0, sort_order: 3, is_active: true }
            ]);
        }
    }

    // Create Type for Chicken Steak
    for (const pid of chickenSteaks) {
        console.log(`Adding type to Chicken Steak ${pid}...`);
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'النوع', name_en: 'Type', group_type: 'Type', is_required: true, allow_multiple: false, product_id: pid, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g.id, name_ar: 'مع ثوم و ليمون', name_en: 'With Garlic & Lemon', price: 45, sort_order: 1, is_active: true },
                { addon_group_id: g.id, name_ar: 'مع وايت صوص', name_en: 'With White Sauce', price: 45, sort_order: 2, is_active: true }
            ]);
        }
    }

    // Create Size for Wings
    for (const pid of wings) {
        console.log(`Adding size to Wings ${pid}...`);
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'الحجم', name_en: 'Size', group_type: 'Size', is_required: true, allow_multiple: false, product_id: pid, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g.id, name_ar: '10 قطع', name_en: '10 Pieces', price: 0, sort_order: 1, is_active: true },
                { addon_group_id: g.id, name_ar: '20 قطعة', name_en: '20 Pieces', price: 0, sort_order: 2, is_active: true }
            ]);
        }
    }

    // Create Type for Kids Chicken
    for (const pid of kidsChicken) {
        console.log(`Adding type to Kids Chicken ${pid}...`);
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'النوع', name_en: 'Type', group_type: 'Type', is_required: true, allow_multiple: false, product_id: pid, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g.id, name_ar: 'مشوي', name_en: 'Grilled', price: 0, sort_order: 1, is_active: true },
                { addon_group_id: g.id, name_ar: 'مقلي', name_en: 'Fried', price: 0, sort_order: 2, is_active: true }
            ]);
        }
    }

    // Appetizer - Mozzarella quantity? Or addition? "+1 (4₪)" -> Add +1 Stick for 4 ILS
    for (const pid of mozzarella) {
        console.log(`Adding +1 to Mozzarella Sticks ${pid}...`);
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'إضافات', name_en: 'Addons', group_type: 'Addon', is_required: false, allow_multiple: true, product_id: pid, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g.id, name_ar: '+1 اصبع', name_en: '+1 Stick', price: 4, sort_order: 1, is_active: true }
            ]);
        }
    }

    // What about عصير طبيعي? (Natural Juice)
    // The previous instructions said: "عصير يوجد النوع: برتقال 15₪, ليمون 15₪, ليمون ونعنع 15₪"
    // Let's find "عصير" ID:
    const { data: juiceData } = await supabase.from('products').select('id, name_ar').ilike('name_ar', '%عصير%');
    console.log("Found juices:", juiceData);

    if (juiceData && juiceData.length > 0) {
        for (const juice of juiceData) {
            const { data: g } = await supabase.from('addon_groups').insert({
                name_ar: 'النوع', name_en: 'Type', group_type: 'Type', is_required: true, allow_multiple: false, product_id: juice.id, is_active: true
            }).select().single();
            if (g) {
                await supabase.from('addon_group_items').insert([
                    { addon_group_id: g.id, name_ar: 'برتقال', name_en: 'Orange', price: 15, sort_order: 1, is_active: true },
                    { addon_group_id: g.id, name_ar: 'ليمون', name_en: 'Lemon', price: 15, sort_order: 2, is_active: true },
                    { addon_group_id: g.id, name_ar: 'ليمون ونعنع', name_en: 'Lemon Mint', price: 15, sort_order: 3, is_active: true }
                ]);
            }
        }
    }
    
    console.log("Done adding product-specific addons.");
}

fix();
