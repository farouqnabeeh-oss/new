const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixlmhcybngpqyofrmlze.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseKey) throw new Error("No key found");

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProducts() {
    console.log("Fetching categories & products...");
    const { data: categories } = await supabase.from('categories').select('*');
    const { data: products } = await supabase.from('products').select('*');
    
    // 1. Rename Drinks
    for (let p of products) {
        if (p.name_ar.includes("كوكاكولا") || p.name_ar.includes("كوكا كولا") || p.name_ar.includes("سبرایت")) {
            let newNameAr = p.name_ar.replace(/كوكاكولا|كوكا كولا/g, 'تشات كولا').replace(/سبرایت/g, 'تشات أب');
            let newNameEn = p.name_en.replace(/Coca[- ]?Cola/gi, 'Tchat Cola').replace(/Sprite/gi, 'Tchat Up');
            await supabase.from('products').update({ name_ar: newNameAr, name_en: newNameEn }).eq('id', p.id);
            console.log(`Renamed: ${p.name_ar} -> ${newNameAr}`);
        }
    }

    // 2. Fix Pasta 
    const pastaProd = products.find(p => p.name_en?.toLowerCase().includes('pasta') || p.name_ar?.includes('باستا'));
    if (pastaProd) {
        // Set pasta base price to 30
        await supabase.from('products').update({ base_price: 30 }).eq('id', pastaProd.id);
        console.log(`Updated Pasta base price to 30`);

        // Check if it has chicken addon
        const { data: existingAddons } = await supabase.from('product_addons').select('*').eq('product_id', pastaProd.id);
        const hasChicken = existingAddons.some(a => a.name_ar.includes('دجاج'));
        if (!hasChicken) {
            await supabase.from('product_addons').insert({
                product_id: pastaProd.id,
                name_ar: 'دجاج إضافي',
                name_en: 'Extra Chicken',
                price: 8,
                is_default: false
            });
            console.log("Added Chicken addon to Pasta (+8)");
        }
        
        const tempAddons = ['حار', 'عادي', 'بارد', 'حار جداً'];
        for(let t of tempAddons) {
            if(!existingAddons.some(a => a.name_ar === t)) {
                await supabase.from('product_addons').insert({
                    product_id: pastaProd.id,
                    name_ar: t,
                    name_en: t === 'عادي' ? 'Normal' : (t === 'حار' ? 'Spicy' : (t === 'بارد' ? 'Cold' : 'Very Spicy')),
                    price: 0
                });
            }
        }
        console.log("Added Temperature options to Pasta");
    }

    // 3. Burger Addons (Fix max selections and 'Without')
    const burgerCat = categories.find(c => c.slug === 'burgers');
    if (burgerCat) {
        const burgers = products.filter(p => p.category_id === burgerCat.id);
        const withoutOptions = ['بدون مخلل', 'بدون بصل', 'بدون صوص', 'بدون بندورة'];
        const withoutEn = ['No Pickles', 'No Onions', 'No Sauce', 'No Tomatoes'];

        for (let b of burgers) {
            const { data: bAddons } = await supabase.from('product_addons').select('*').eq('product_id', b.id);
            
            // Add 'without' options
            for (let i = 0; i < withoutOptions.length; i++) {
                if (!bAddons.some(a => a.name_ar === withoutOptions[i])) {
                    await supabase.from('product_addons').insert({
                        product_id: b.id,
                        name_ar: withoutOptions[i],
                        name_en: withoutEn[i],
                        price: 0
                    });
                }
            }
            console.log(`Added Without options to ${b.name_ar}`);
        }
    }

    console.log("Database Fixes Completed!");
}

fixProducts().catch(console.error);
