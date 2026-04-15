import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupMainMeals() {
    console.log("Cleaning up 'Main Meals' category...");
    
    // 1. Find the category
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name_en', 'Main Meals')
        .single();
        
    if (!category) {
        console.error("Main Meals category not found");
        return;
    }
    
    console.log(`Found category ID: ${category.id}`);
    
    // 2. Deactivate all products in this category
    const { error: deactivateError } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('category_id', category.id);
        
    if (deactivateError) {
        console.error("Error deactivating products:", deactivateError.message);
    } else {
        console.log("Deactivated existing products in Main Meals.");
    }
    
    // 3. Upsert "Rice Plate" (صحن أرز)
    const { error: upsertError } = await supabase
        .from('products')
        .upsert({
            name_ar: "صحن أرز",
            name_en: "Rice Plate",
            description_ar: "أرز بسمتي فاخر",
            description_en: "Premium Basmati Rice",
            base_price: 15,
            category_id: category.id,
            is_active: true,
            all_branches: true
        }, { onConflict: 'name_en' });
        
    if (upsertError) {
        console.error("Error adding Rice Plate:", upsertError.message);
    } else {
        console.log("Ensured 'Rice Plate' is the only active product in Main Meals.");
    }
}

cleanupMainMeals();
