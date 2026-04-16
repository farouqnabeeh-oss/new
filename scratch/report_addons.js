require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function summarize() {
    try {
        const { data: products } = await supabase.from('products').select('id, name_ar, category_id');
        const { data: addons } = await supabase.from('addon_groups').select('product_id, category_id, name_ar');
        const { data: categories } = await supabase.from('categories').select('id, name_ar');

        let mapCat = {};
        for (let c of (categories || [])) mapCat[c.id] = c.name_ar;

        let catWithAddons = new Set();
        (addons || []).forEach(a => {
            if (a.category_id) catWithAddons.add(a.category_id);
        });

        let withAddons = [];
        let withoutAddons = [];

        (products || []).forEach(p => {
            let hasDirect = (addons || []).some(a => a.product_id === p.id);
            let hasCat = catWithAddons.has(p.category_id);

            let catName = mapCat[p.category_id] || 'Unknown';
            if (hasDirect || hasCat) {
                withAddons.push(p.name_ar + ' [' + catName + ']');
            } else {
                withoutAddons.push(p.name_ar + ' [' + catName + ']');
            }
        });

        console.log('=== WITH ADDONS === (' + withAddons.length + ')');
        console.log(withAddons.slice(0, 30).join(', ') + (withAddons.length > 30 ? ' ... +' + (withAddons.length - 30) + ' more' : ''));

        console.log('\n=== WITHOUT ADDONS === (' + withoutAddons.length + ')');
        console.log(withoutAddons.join('\n'));
    } catch (err) {
        console.log(err);
    }
}

summarize();
