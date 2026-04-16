const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupMainMeals() {
    console.log("Cleaning up 'Main Meals' category...");
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name_en', 'Main Meals')
        .single();
        
    if (!category) {
        console.error("Main Meals category not found");
        return;
    }
    
    await supabase.from('products').update({ is_active: false }).eq('category_id', category.id);
    
    await supabase.from('products').upsert({
            name_ar: "صحن أرز",
            name_en: "Rice Plate",
            description_ar: "أرز بسمتي فاخر",
            description_en: "Premium Basmati Rice",
            base_price: 15,
            category_id: category.id,
            is_active: true,
            all_branches: true
        }, { onConflict: 'name_en' });
    
    console.log("Cleanup complete.");
}

cleanupMainMeals();
