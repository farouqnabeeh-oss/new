const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env'});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function linkAddons() {
    const { data: products } = await supabase.from('products').select('id, name_en, category_id, is_active, category:categories(name_en)');
    const { data: groups } = await supabase.from('product_addon_groups').select('id, name_en');
    
    // helper to find group ID by partial name
    const getGroupId = (nameMatch) => {
        const group = groups.find(g => g.name_en.toLowerCase().includes(nameMatch.toLowerCase()));
        return group ? group.id : null;
    };

    const addonsGroupId = getGroupId('Add-on');
    const withoutGroupId = getGroupId('Without');
    const donenessGroupId = getGroupId('Doneness');
    const chooseDrinkGroupId = getGroupId('Choose Drink');
    const changeDrinkGroupId = getGroupId('Change Drink');
    const changeFriesGroupId = getGroupId('Change Fries');

    console.log({ addonsGroupId, withoutGroupId, donenessGroupId, chooseDrinkGroupId, changeDrinkGroupId, changeFriesGroupId });

    let mappings = [];

    products.forEach(p => {
        const catName = p.category && p.category.name_en ? p.category.name_en.toLowerCase() : '';
        const prodName = p.name_en.toLowerCase();

        const isAppetizer = catName.includes('appetizer');
        const isDessert = catName.includes('dessert');
        const isPasta = catName.includes('pasta');
        const isBurger = catName.includes('burger');
        const isSandwich = catName.includes('sandwich');
        const isMainDish = catName.includes('main dish') || catName.includes('main');

        // 1. Add-ons
        if (
            (isAppetizer && (prodName.includes('mozzarella') || prodName.includes('french vanilla'))) ||
            isDessert || isPasta || isBurger || isSandwich || isMainDish
        ) {
            if (addonsGroupId) mappings.push({ product_id: p.id, group_id: addonsGroupId });
        }

        // 2. Without
        if (isBurger || isSandwich) {
            if (withoutGroupId) mappings.push({ product_id: p.id, group_id: withoutGroupId });
        }

        // 3. Doneness
        if (isMainDish) {
            if (donenessGroupId) mappings.push({ product_id: p.id, group_id: donenessGroupId });
        }

        // 4. Choose Drink
        if (isBurger || isSandwich) {
            if (chooseDrinkGroupId) mappings.push({ product_id: p.id, group_id: chooseDrinkGroupId });
        }

        // 5. Change Drink
        if (isBurger || isSandwich) {
            if (changeDrinkGroupId) mappings.push({ product_id: p.id, group_id: changeDrinkGroupId });
        }

        // 6. Change Fries
        if (isBurger || isSandwich) {
            if (changeFriesGroupId) mappings.push({ product_id: p.id, group_id: changeFriesGroupId });
        }
    });

    console.log('Total mappings to insert:', mappings.length);

    if (mappings.length > 0) {
        await supabase.from('product_addon_group_mappings').delete().neq('id', 0); // clear all
        
        // Chunk inserts
        const chunkSize = 100;
        for (let i = 0; i < mappings.length; i += chunkSize) {
            const chunk = mappings.slice(i, i + chunkSize);
            const { error: insErr } = await supabase.from('product_addon_group_mappings').insert(chunk);
            if (insErr) console.error('Insert error:', insErr);
        }
        console.log('Mappings updated successfully!');
    }
}
linkAddons();
