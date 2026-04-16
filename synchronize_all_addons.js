
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncAll() {
    console.log('--- 🚀 EMERGENCY FULL REBUILD: ALL CATEGORIES ---');

    const { data: cats } = await supabase.from('categories').select('id, name_ar, name_en');
    if (!cats) { console.error('Failed to cats'); return; }
    console.log(`System found ${cats.length} categories.`);

    const find = (kw) => cats.filter(c => 
        (c.name_ar && c.name_ar.includes(kw)) || 
        (c.name_en && c.name_en.toLowerCase().includes(kw.toLowerCase()))
    ).map(c => c.id);

    console.log('Cleaning all existing addon data...');
    const { data: grps } = await supabase.from('addon_groups').select('id');
    if (grps && grps.length > 0) {
        const ids = grps.map(g => g.id);
        await supabase.from('addon_group_items').delete().in('addon_group_id', ids);
        await supabase.from('addon_groups').delete().in('id', ids);
    }

    async function push(nameAr, items, ids, type = 'addons', req = false) {
        if (!ids || ids.length === 0) { console.log(`⏩ Skipping ${nameAr} (No categories matched)`); return; }
        for (const cid of ids) {
            const { data, error } = await supabase.from('addon_groups').insert([{
                name_ar: nameAr,
                name_en: nameAr, // Fallback
                group_type: type,
                category_id: cid,
                is_required: req,
                is_active: true
            }]).select();
            
            if (error) { console.error(`❌ Error inserting group ${nameAr}:`, error.message); continue; }
            const gid = data[0].id;
            if (items && items.length > 0) {
                const finalItems = items.map((it, idx) => ({
                    addon_group_id: gid,
                    name_ar: it.name,
                    name_en: it.name,
                    price: it.p || 0,
                    sort_order: idx + 1,
                    is_active: true
                }));
                const { error: iErr } = await supabase.from('addon_group_items').insert(finalItems);
                if (iErr) console.error(`❌ Error inserting items for ${nameAr}:`, iErr.message);
            }
        }
        console.log(`✅ Added [${nameAr}] to ${ids.length} categories.`);
    }

    // 1. BURGERS & SANDWICHES & MAIN
    const bId = [...find('بيرجر'), ...find('ساندويشات'), ...find('وجبات رئيسية')];
    const drinkItems = [{name:'كولا'}, {name:'كولا زيرو'}, {name:'فانتا'}, {name:'سبرايت'}, {name:'ماء'}];
    const friesItems = [{name:'كيرلي', p:5}, {name:'ويدجز', p:5}, {name:'بطاطا حلوة', p:5}, {name:'كرات بطاطا', p:5}];
    
    await push('النوع', [{name:'ساندويش', p:0}, {name:'وجبة (مع بطاطا ومشروب)', p:9}], bId, 'types', true);
    await push('بدون', [{name:'بدون مخلل'}, {name:'بدون بصل'}, {name:'بدون بندورة'}, {name:'بدون خس'}, {name:'بدون صوص'}], bId, 'without');
    await push('إضافة داخلية', [{name:'لحمة إضافية', p:15}, {name:'جبنة إضافية', p:3}, {name:'بيكون', p:6}, {name:'هالبينو', p:3}], bId);
    await push('اختر المشروب', drinkItems, bId, 'MealDrink', true);
    await push('تبديل البطاطا', friesItems, bId, 'MealFries');

    // 2. PASTA
    const pId = find('باستا');
    await push('إضافات الباستا', [{name:'دجاج إضافي', p:10}, {name:'قريدس إضافي', p:15}, {name:'جبنة إضافية', p:5}], pId);
    await push('بدون', [{name:'بدون ثوم'}, {name:'بدون بصل'}, {name:'بدون فطر'}], pId, 'without');

    // 3. SALADS
    const sId = find('سلطات');
    await push('إضافة للسلطة', [{name:'دجاج إضافي', p:10}, {name:'جبنة بارميزان', p:5}, {name:'جوز', p:5}], sId);
    await push('بدون', [{name:'بدون بصل'}, {name:'بدون زيتون'}], sId, 'without');

    // 4. FAMILY MEALS
    const fId = find('العائلية');
    await push('المشروب العائلي', [{name:'كولا 1.5 لتر'}, {name:'فانتا 1.5 لتر'}, {name:'سبرايت 1.5 لتر'}], fId, 'MealDrink', true);
    await push('نوع البطاطا', [{name:'عادية لارج'}, {name:'كيرلي لارج', p:10}, {name:'ويدجز لارج', p:10}], fId, 'MealFries');

    // 5. KIDS MEALS
    const kId = find('الأطفال');
    await push('المشروب', [{name:'عصير برتقال'}, {name:'عصير تفاح'}, {name:'ماء'}], kId, 'MealDrink', true);

    // 6. WINGS
    const wId = find('أجنحة');
    await push('الصوص', [{name:'بافلو'}, {name:'باربيكيو'}, {name:'هاني ماسترد'}], wId, 'addons', true);

    // 7. BEVERAGES (Milkshake, Cold Coffee, Smoothie)
    const bevId = [...find('ميلك شيك'), ...find('قهوة باردة'), ...find('سموذي')];
    await push('إضافات المشروب', [{name:'سيرب كراميل', p:3}, {name:'كريمة إضافية', p:3}, {name:'إسبريسو شوت', p:5}], bevId);

    // 8. HOT DRINKS
    const hotId = find('ساخنة');
    await push('ملاحظات', [{name:'سكر زيادة'}, {name:'سكر خفيف'}, {name:'بدون سكر'}], hotId);

    // 9. DESSERTS
    const dsId = find('حلويات');
    await push('إضافات الحلى', [{name:'بوظة فانيلا', p:8}, {name:'نوتيلا إضافي', p:5}], dsId);

    // 10. APPETIZERS
    const apId = find('مقبلات');
    await push('بدون', [{name:'بدون تتبيلة'}, {name:'بدون صوص'}], apId, 'without');

    // 11. HOOKAH
    const hkId = find('أراجيل');
    await push('النكهة', [{name:'ليمون ونعنع'}, {name:'تفاحتين'}, {name:'علكة ونعنع'}], hkId, 'flavors', true);

    console.log('--- ✅ COMPLETED 100% REBUILD ---');
}
syncAll();
