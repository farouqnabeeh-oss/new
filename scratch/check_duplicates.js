require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function removeDuplicates() {
    console.log("Starting deduplication process...");

    // 1. Deduplicate Products
    const { data: products } = await supabase.from('products').select('id, name_en, name_ar, category_id').order('id', { ascending: true });
    if (products) {
        let seenProducts = new Set();
        let prodToDelete = [];
        for (let p of products) {
            const key = p.name_ar?.trim() + '-' + p.name_en?.trim() + '-' + p.category_id;
            if (seenProducts.has(key)) {
                prodToDelete.push(p.id);
            } else {
                seenProducts.add(key);
            }
        }
        if (prodToDelete.length > 0) {
            console.log(`Found ${prodToDelete.length} duplicate products. Deleting...`);
            await supabase.from('products').delete().in('id', prodToDelete);
        } else {
            console.log("No duplicate products found.");
        }
    }

    // 2. Deduplicate Addon Groups
    const { data: groups } = await supabase.from('addon_groups').select('id, name_ar, category_id, product_id, group_type').order('id', { ascending: true });
    if (groups) {
        let seenGroups = new Set();
        let groupsToDelete = [];
        for (let g of groups) {
            // A group is duplicate if it has the same name and belongs to the same target (category OR product)
            const key = g.name_ar?.trim() + '-' + (g.category_id || '') + '-' + (g.product_id || '') + '-' + (g.group_type || '');
            if (seenGroups.has(key)) {
                groupsToDelete.push(g.id);
            } else {
                seenGroups.add(key);
            }
        }
        if (groupsToDelete.length > 0) {
            console.log(`Found ${groupsToDelete.length} duplicate addon groups. Deleting...`);
            await supabase.from('addon_groups').delete().in('id', groupsToDelete);
        } else {
            console.log("No duplicate addon groups found.");
        }
    }

    // 3. Deduplicate Addon Group Items
    const { data: items } = await supabase.from('addon_group_items').select('id, addon_group_id, name_ar').order('id', { ascending: true });
    if (items) {
        let seenItems = new Set();
        let itemsToDelete = [];
        for (let it of items) {
            const key = it.addon_group_id + '-' + it.name_ar?.trim();
            if (seenItems.has(key)) {
                itemsToDelete.push(it.id);
            } else {
                seenItems.add(key);
            }
        }
        if (itemsToDelete.length > 0) {
            console.log(`Found ${itemsToDelete.length} duplicate addon items. Deleting...`);
            await supabase.from('addon_group_items').delete().in('id', itemsToDelete);
        } else {
            console.log("No duplicate addon items found.");
        }
    }

    // 4. Clean up Mojito/Mometo manual user duplicates if any
    const { data: mojitoProds } = await supabase.from('products').select('id, name_ar').ilike('name_ar', '%موهيتو%');
    if (mojitoProds && mojitoProds.length > 1) {
        let mojitoToDelete = mojitoProds.slice(1).map(p => p.id);
        console.log(`Found manual duplicate Mojitos. Deleting IDs: ${mojitoToDelete}`);
        await supabase.from('products').delete().in('id', mojitoToDelete);
    }

    // Check sizes
    const { data: sizes } = await supabase.from('product_sizes').select('id, product_id, name_ar').order('id', { ascending: true });
    if (sizes) {
        let seenSizes = new Set();
        let sizesToDelete = [];
        for (let s of sizes) {
            const key = s.product_id + '-' + s.name_ar?.trim();
            if (seenSizes.has(key)) {
                sizesToDelete.push(s.id);
            } else {
                seenSizes.add(key);
            }
        }
        if (sizesToDelete.length > 0) {
            console.log(`Found ${sizesToDelete.length} duplicate sizes. Deleting...`);
            await supabase.from('product_sizes').delete().in('id', sizesToDelete);
        } else {
            console.log("No duplicate sizes found.");
        }
    }

    console.log("Deduplication complete!");
    process.exit(0);
}

removeDuplicates();
