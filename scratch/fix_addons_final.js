const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env'});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixAddons() {
    console.log('Starting addon synchronization...');

    // 1. Define groups to create/update
    // Each entry in this array will be a group in the addon_groups table.
    // Since each row only supports one category or product, we create duplicates as needed.
    const groupDefinitions = [
        // --- ADD-ONS (إضافات) ---
        { name_ar: 'إضافات', name_en: 'Add-ons', category_id: 1, is_required: false, allow_multiple: true, items: ['Extra Cheese', 'Bacon', 'Mushroom', 'Caramelized Onion'] },
        { name_ar: 'إضافات', name_en: 'Add-ons', category_id: 2, is_required: false, allow_multiple: true, items: ['Extra Cheese', 'Turkey', 'Salami'] },
        { name_ar: 'إضافات', name_en: 'Add-ons', category_id: 3, is_required: false, allow_multiple: true, items: ['Extra Rice', 'Extra Bread', 'Extra Sauce'] },
        { name_ar: 'إضافات', name_en: 'Add-ons', category_id: 11, is_required: false, allow_multiple: true, items: ['Extra Ice Cream', 'Chocolate Sauce', 'Lotus Sauce'] },
        { name_ar: 'إضافات', name_en: 'Add-ons', category_id: 15, is_required: false, allow_multiple: true, items: ['Extra Cheese', 'Extra Mushroom', 'Extra Chicken'] },
        { name_ar: 'إضافات', name_en: 'Add-ons', product_id: 106, is_required: false, allow_multiple: true, items: ['Special Sauce', 'Ranch Sauce'] }, // Mozzarella Sticks
        { name_ar: 'إضافات', name_en: 'Add-ons', product_id: 114, is_required: false, allow_multiple: true, items: ['Extra Vanilla', 'Caramel Syrup'] }, // French Vanilla

        // --- WITHOUT (بدون) ---
        { name_ar: 'بدون', name_en: 'Without', category_id: 1, is_required: false, allow_multiple: true, items: ['بدون بصل (No Onion)', 'بدون مخلل (No Pickles)', 'بدون بندورة (No Tomato)', 'بدون خس (No Lettuce)', 'بدون مايونيز (No Mayo)', 'بدون كاتشب (No Ketchup)'] },
        { name_ar: 'بدون', name_en: 'Without', category_id: 2, is_required: false, allow_multiple: true, items: ['بدون بصل (No Onion)', 'بدون مخلل (No Pickles)', 'بدون بندورة (No Tomato)', 'بدون خس (No Lettuce)', 'بدون مايونيز (No Mayo)'] },

        // --- DONENESS (درجة الاستواء) ---
        { name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: 3, is_required: true, allow_multiple: false, items: ['Medium', 'Medium Well', 'Well Done'] },

        // --- CHOOSE DRINK (اختيار المشروب) ---
        { name_ar: 'اختيار المشروب', name_en: 'Choose Drink', category_id: 1, is_required: true, allow_multiple: false, items: ['Cola', 'Cola Zero', 'Sprite', 'Fanta', 'Water'] },
        { name_ar: 'اختيار المشروب', name_en: 'Choose Drink', category_id: 2, is_required: true, allow_multiple: false, items: ['Cola', 'Cola Zero', 'Sprite', 'Fanta', 'Water'] },

        // --- CHANGE DRINK (تبديل المشروب) ---
        { name_ar: 'تبديل المشروب', name_en: 'Change Drink', category_id: 1, is_required: false, allow_multiple: false, items: ['Orange Juice (+5₪)', 'Lemon Mint (+5₪)', 'Milkshake (+10₪)'] },
        { name_ar: 'تبديل المشروب', name_en: 'Change Drink', category_id: 2, is_required: false, allow_multiple: false, items: ['Orange Juice (+5₪)', 'Lemon Mint (+5₪)', 'Milkshake (+10₪)'] },

        // --- CHANGE FRIES (تبديل البطاطا) ---
        { name_ar: 'تبديل البطاطا', name_en: 'Change Fries', category_id: 1, is_required: false, allow_multiple: false, items: ['Wedges (+5₪)', 'Twister (+5₪)', 'Sweet Potato (+8₪)'] },
        { name_ar: 'تبديل البطاطا', name_en: 'Change Fries', category_id: 2, is_required: false, allow_multiple: false, items: ['Wedges (+5₪)', 'Twister (+5₪)', 'Sweet Potato (+8₪)'] }
    ];

    // Clear existing groups to avoid mess (Optional, but cleaner for this specific sync request)
    const syncNames = [...new Set(groupDefinitions.map(d => d.name_en))];
    await supabase.from('addon_groups').delete().in('name_en', syncNames);

    for (const def of groupDefinitions) {
        console.log(`Processing group: ${def.name_en} for ${def.category_id ? 'Category ' + def.category_id : 'Product ' + def.product_id}`);
        
        const { data: group, error: groupErr } = await supabase.from('addon_groups').insert({
            name_ar: def.name_ar,
            name_en: def.name_en,
            category_id: def.category_id || null,
            product_id: def.product_id || null,
            is_required: def.is_required,
            allow_multiple: def.allow_multiple,
            is_active: true,
            group_type: 'Optional'
        }).select().single();

        if (groupErr) {
            console.error(`Error creating group ${def.name_en}:`, groupErr.message);
            continue;
        }

        const itemsToInsert = def.items.map((itemName, index) => {
            // Check if item has price in string like (+5₪)
            let price = 0;
            const priceMatch = itemName.match(/\(\+(\d+)₪\)/);
            if (priceMatch) price = parseInt(priceMatch[1]);

            return {
                addon_group_id: group.id,
                name_en: itemName,
                name_ar: itemName, // Simple duplicate for now
                price: price,
                sort_order: index,
                is_active: true
            };
        });

        const { error: itemsErr } = await supabase.from('addon_group_items').insert(itemsToInsert);
        if (itemsErr) {
            console.error(`Error creating items for ${def.name_en}:`, itemsErr.message);
        } else {
            console.log(`Successfully created ${def.name_en} with ${itemsToInsert.length} items.`);
        }
    }

    console.log('Addon synchronization finished.');
}

fixAddons();
