const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log('Fixing allow_multiple for Burger Addons...');
    await s.from('addon_groups')
       .update({ allow_multiple: true, max_selections: 5 })
       .in('group_type', ['addons', 'Without']);

    console.log('Fetching Without groups...');
    const { data: withoutGroups } = await s.from('addon_groups').select('id').eq('group_type', 'Without');
    if(withoutGroups) {
        for(let g of withoutGroups) {
            const {data: existing} = await s.from('addon_items').select('id').eq('group_id', g.id).ilike('name_ar', '%خبز%');
            if(!existing || existing.length === 0) {
                await s.from('addon_items').insert({ group_id: g.id, name_ar: 'بدون خبز', name_en: 'Without Bread', price: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
            }
        }
    }

    console.log('Fixing Pasta (Category 4)...');
    await s.from('products').update({ image_path: '', base_price: 30 }).eq('category_id', 4);
    
    // Add 'Free Bread' to Pasta products
    const { data: pastas } = await s.from('products').select('id').eq('category_id', 4);
    if(pastas) {
        for(let p of pastas) {
            const {data: rels} = await s.from('product_addon_groups').select('group_id').eq('product_id', p.id);
            if(rels && rels.length > 0) {
                const groupIds = rels.map(r=>r.group_id);
                const {data: g} = await s.from('addon_groups').select('id').in('id', groupIds).eq('group_type', 'addons').limit(1);
                if(g && g.length > 0) {
                    const {data: existingBread} = await s.from('addon_items').select('id').eq('group_id', g[0].id).ilike('name_ar', '%خبز مجاني%');
                    if(!existingBread || existingBread.length === 0) {
                        await s.from('addon_items').insert({ group_id: g[0].id, name_ar: 'خبز عربي مجاني', name_en: 'Free Arabic Bread', price: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
                    }
                }
            }
        }
    }

    console.log('Done.');
}
run();
