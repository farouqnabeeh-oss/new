const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log('Starting massive menu data fixes...');

    // 1. Asado Price to 36
    await s.from('products').update({ base_price: 36 }).ilike('name_ar', '%اسادو%');
    await s.from('products').update({ base_price: 36 }).ilike('name_ar', '%حلومي%');
    await s.from('products').update({ base_price: 36 }).ilike('name_ar', '%فيليه%');

    // 2. Family Offers: Remove Images, Tchat drink text update
    const { data: familyOffers } = await s.from('products').select('*').ilike('name_ar', '%عائلي%');
    if (familyOffers) {
        for (let off of familyOffers) {
            let nDesc = (off.description_ar || '').replace(/كوكاكولا/g, 'تشات كولا').replace(/كوكا كولا/g, 'تشات كولا').replace(/سبرايت/g, 'تشات أب');
            await s.from('products').update({ description_ar: nDesc, image_path: null }).eq('id', off.id);
        }
    }

    // 3. Images to Null
    const nullImages = ['اجنحة', 'تشيكن', 'بينا بيستو', 'بينا الفريدو', 'بينا اربياتا', 'فيتوتشيني', 'ماك اند تشيز', 'كلاسيك برجر', 'مكسيكو', 'بلو تشيز'];
    for (let w of nullImages) {
        await s.from('products').update({ image_path: null }).ilike('name_ar', `%${w}%`);
    }

    // 4. Specific Prices
    await s.from('products').update({ base_price: 23 }).ilike('name_ar', '%كيندر%');
    await s.from('products').update({ base_price: 23 }).ilike('name_ar', '%بوب كورن%');
    await s.from('products').update({ base_price: 8 }).ilike('name_ar', '%بابل%');
    await s.from('products').update({ base_price: 25 }).ilike('name_ar', '%كريسبي%').neq('category_id', 4);
    await s.from('products').update({ base_price: 30 }).ilike('name_ar', '%بينا بيستو%');

    // 5. Reactivate Missing Drinks & Desserts (Categories: Juices, Sweets)
    await s.from('products').update({ is_active: true }).ilike('name_ar', '%برتقال%');
    await s.from('products').update({ is_active: true }).ilike('name_ar', '%ليمون%');
    await s.from('products').update({ is_active: true }).ilike('name_ar', '%نعنع%');
    await s.from('products').update({ is_active: true }).ilike('name_ar', '%سموثي%');
    await s.from('products').update({ is_active: true }).ilike('name_ar', '%سان%'); // San Sebastian
    await s.from('products').update({ is_active: true }).ilike('name_ar', '%شوكليت%');

    // 6. Missing Ingredients strings
    await s.from('products').update({ description_ar: 'مخلل + صوص ايولان' }).ilike('name_ar', '%اسادو%');
    await s.from('products').update({ description_ar: 'بين تشيز + موزريلا + صوص مدخن' }).ilike('name_ar', '%مشروم%');
    await s.from('products').update({ description_ar: 'تشيز + موزريلا + صوص ايولان' }).ilike('name_ar', '%تشكن برجر%');
    // Spicy
    await s.from('products').update({ description_ar: 'صوص حار + هلابينو + جبنة + بصل + مخلل' }).ilike('name_ar', '%سبايسي%');

    // 7. Chicken Addon to Caesar Salad
    const { data: caesar } = await s.from('products').select('id').ilike('name_ar', '%سيزر%');
    if (caesar && caesar.length > 0) {
        // Find existing addon group for extensions
        const { data: caesarRels } = await s.from('product_addon_groups').select('group_id').eq('product_id', caesar[0].id);
        if (caesarRels && caesarRels.length > 0) {
            const grpId = caesarRels[0].group_id;
            await s.from('addon_items').insert({ group_id: grpId, name_ar: 'إضافة دجاج', name_en: 'Add Chicken', price: 8 });
        } else {
            // Create group
            const { data: newGrp } = await s.from('addon_groups').insert({ name_ar: 'إضافات', name_en: 'Addons', group_type: 'addons', allow_multiple: true }).select('id');
            if (newGrp) {
                await s.from('product_addon_groups').insert({ product_id: caesar[0].id, group_id: newGrp[0].id });
                await s.from('addon_items').insert({ group_id: newGrp[0].id, name_ar: 'إضافة دجاج', name_en: 'Add Chicken', price: 8 });
            }
        }
    }

    // 8. Main Meals Options
    const { data: mains } = await s.from('products').select('id').ilike('name_ar', '%ستيك%');
    if (mains) {
        for (let m of mains) {
            // Create Sauces Group
            const { data: srcGrp } = await s.from('addon_groups').insert({ name_ar: 'اختر الصوص', name_en: 'Choose Sauce', group_type: 'addons' }).select('id');
            if (srcGrp) {
                await s.from('product_addon_groups').insert({ product_id: m.id, group_id: srcGrp[0].id });
                await s.from('addon_items').insert([
                    { group_id: srcGrp[0].id, name_ar: 'وايت صوص', name_en: 'White Sauce', price: 0 },
                    { group_id: srcGrp[0].id, name_ar: 'ليمون وثوم', name_en: 'Lemon & Garlic', price: 0 }
                ]);
            }
            // Create Rice Group
            const { data: riceGrp } = await s.from('addon_groups').insert({ name_ar: 'أرز إضافي', name_en: 'Extra Rice', group_type: 'addons', allow_multiple: true }).select('id');
            if (riceGrp) {
                await s.from('product_addon_groups').insert({ product_id: m.id, group_id: riceGrp[0].id });
                await s.from('addon_items').insert({ group_id: riceGrp[0].id, name_ar: 'أرز إضافي', name_en: 'Extra Rice', price: 10 });
            }
        }
    }

    console.log('Finished Menu Data Update!');
}
run();
