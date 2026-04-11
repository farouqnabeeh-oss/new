
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAndFinalize() {
    console.log('🧹 Cleaning up unwanted addons...');

    const unwantedCategories = ['السلطات', 'حلويات', 'قهوة باردة'];
    for (const catName of unwantedCategories) {
        const { data: cat } = await supabase.from('categories').select('id').ilike('name_ar', `%${catName}%`).maybeSingle();
        if (cat) {
            await supabase.from('addon_groups').delete().eq('category_id', cat.id);
            console.log(`✅ Cleared all addons for ${catName}`);
        }
    }

    // Ensure only the specific products have addons as requested
    console.log('🎯 Done.');
}

cleanAndFinalize();
