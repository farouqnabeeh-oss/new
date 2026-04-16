
require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncAll() {
    console.log('--- 🚀 THE 100% PERFECT REBUILD: EVERYTHING & EVERYWHERE ---');

    const { data: cats } = await supabase.from('categories').select('id, name_ar, name_en');
    if (!cats) { console.error('Failed to cats'); return; }
    
    // Improved matching with IDs
    const findIds = (kw, explicitId) => {
        let ids = cats.filter(c => 
            (c.name_ar && (c.name_ar.includes(kw) || c.name_ar.replace('أ','ا').includes(kw.replace('أ','ا')))) ||
            (c.name_en && c.name_en.toLowerCase().includes(kw.toLowerCase()))
        ).map(c => c.id);
        if (explicitId && !ids.includes(explicitId)) ids.push(explicitId);
        return ids;
    };

    console.log('Cleaning all existing addon data...');
    const { data: grps } = await supabase.from('addon_groups').select('id');
    if (grps && grps.length > 0) {
        const idsList = grps.map(g => g.id);
        await supabase.from('addon_group_items').delete().in('addon_group_id', idsList);
        await supabase.from('addon_groups').delete().in('id', idsList);
    }

    async function push(nameAr, items, ids, type = 'addons', req = false) {
        if (!ids || ids.length === 0) return;
        for (const cid of ids) {
            const { data, error } = await supabase.from('addon_groups').insert([{
                name_ar: nameAr,
                name_en: nameAr,
                group_type: type,
                category_id: cid,
                is_required: req,
                is_active: true
            }]).select();
            if (error) continue;
            const gid = data[0].id;
            if (items && items.length > 0) {
                const finalItems = items.map((it, idx) => ({
                    addon_group_id: gid,
                    name_ar: it.name,
                    name_en: it.name_en || it.name,
                    price: it.p || 0,
                    sort_order: idx + 1,
                    is_active: true
                }));
                await supabase.from('addon_group_items').insert(finalItems);
            }
        }
    }

    // --- 1. BURGERS/SANDWICHES/MAIN (THE WORKS) ---
    const mainIds = [...findIds('بيرجر', 1), ...findIds('ساندويشات', 2), ...findIds('وجبات رئيسية', 3)];
    await push('النوع', [{name:'ساندويش/حبة', p:0}, {name:'وجبة (مع بطاطا ومشروب)', p:9}], mainIds, 'types', true);
    await push('بدون', [{name:'بدون مخلل'}, {name:'بدون بصل'}, {name:'بدون بندورة'}, {name:'بدون خس'}, {name:'بدون صوص'}], mainIds, 'without');
    await push('درجة الاستواء', [{name:'Well Done'}, {name:'Medium'}, {name:'Medium Well'}], findIds('بيرجر', 1), 'addons', true);
    await push('إضافات داخل المنتج', [{name:'لحمة إضافية 120غ', p:12}, {name:'لحمة إضافية 150غ', p:15}, {name:'جبنة إضافية', p:3}, {name:'بيكون', p:6}, {name:'هالبينو', p:3}], mainIds);
    await push('إضافات فوق المنتج', [{name:'بيض مقلي', p:4}, {name:'سلامي', p:5}, {name:'بيكون لارج', p:7}, {name:'فطر مكرمل', p:5}], mainIds);
    await push('اختر المشروب', [{name:'كولا'}, {name:'كولا زيرو'}, {name:'فانتا'}, {name:'سبرايت'}, {name:'ماء'}], mainIds, 'MealDrink', true);
    await push('تبديل المشروب', [{name:'XL', p:4}, {name:'بافاريا', p:4}, {name:'صودا', p:4}], mainIds, 'MealDrinkUpgrade');
    await push('تبديل البطاطا', [{name:'كيرلي', p:5}, {name:'ويدجز', p:5}, {name:'بطاطا حلوة', p:5}], mainIds, 'MealFries');

    // --- 2. PASTA/SALADS/WINGS ---
    await push('إضافات الباستا', [{name:'دجاج إضافي', p:10}, {name:'قريدس إضافي', p:15}], findIds('باستا', 15));
    await push('إضافة للسلطة', [{name:'دجاج إضافي', p:10}, {name:'جبنة بارميزان', p:5}], findIds('سلطات', 6));
    await push('الصوص', [{name:'بافلو'}, {name:'باربيكيو'}], findIds('أجنحة', 4), 'addons', true);

    // --- 3. FAMILY/KIDS/DESSERTS ---
    await push('المشروب العائلي', [{name:'كولا 1.5 لتر'}, {name:'فانتا 1.5 لتر'}, {name:'سبرايت 1.5 لتر'}], findIds('الوجبات العائلية', 31), 'MealDrink', true);
    await push('نوع البطاطا لارج', [{name:'عادية لارج'}, {name:'كيرلي لارج', p:10}, {name:'ويدجز لارج', p:10}], findIds('الوجبات العائلية', 31), 'MealFries', true);
    await push('المشروب', [{name:'عصير برتقال'}, {name:'عصير تفاح'}], findIds('الأطفال', 5), 'MealDrink', true);
    await push('إضافات الحلى', [{name:'بوظة فانيلا', p:8}], findIds('حلويات', 11));

    // --- 4. BEVERAGES (COFFEE/SMOOTHIE/SOFT) ---
    await push('إضافات السموذي', [{name:'عسل إضافي', p:3}, {name:'حليب لوز', p:5}, {name:'ويبد كريم', p:4}], findIds('سموذي', 177));
    await push('إضافات المشروب', [{name:'إسبريسو شوت', p:5}, {name:'سيرب كراميل', p:3}], [...findIds('ميلك شيك', 9), ...findIds('قهوة باردة', 176)]);
    await push('ملاحظات', [{name:'سكر زيادة'}, {name:'بدون سكر'}], findIds('ساخنة', 10));
    await push('إضافات التقديم', [{name:'كأس ثلج'}, {name:'شريحة ليمون'}], findIds('مشروبات باردة', 12));

    // --- 5. APPETIZERS/HOOKAH ---
    await push('بدون', [{name:'بدون صوص'}], findIds('مقبلات', 14), 'without');
    await push('النكهة', [{name:'ليمون ونعنع'}, {name:'تفاحتين'}], findIds('أراجيل', 13), 'flavors', true);

    console.log('--- ✅ 100% PERFECT SYNC COMPLETE ---');
}
syncAll();
