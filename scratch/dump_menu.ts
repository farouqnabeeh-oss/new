
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function dump() {
    const { data: categories } = await supabase.from('categories').select('id, name_ar');
    const { data: products } = await supabase.from('products').select('id, name_ar');

    const searchTerms = [
        'وجبة', 'ستيك', 'دجاج', 'لحمة', 'أجنحة', 'كيدز', 'موزار', 'عصير', 'سموذي', 'ميلك', 'اسبرسو', 'شاي', 'أرجيلة', 'ارجيلة'
    ];

    console.log('--- MATCHING PRODUCTS ---');
    for (const term of searchTerms) {
        const matches = products?.filter(p => p.name_ar.includes(term)) || [];
        if (matches.length > 0) {
            console.log(`\nMatches for "${term}":`);
            matches.forEach(m => console.log(`  [${m.id}] ${m.name_ar}`));
        }
    }

    const catSearchTerms = ['وجبات', 'أجنحة', 'رئيسية', 'سلطات', 'مقبلات', 'حلويات', 'باردة', 'ساخنة', 'ارجيلة', 'أرجيلة'];
    console.log('\n--- MATCHING CATEGORIES ---');
    for (const term of catSearchTerms) {
        const matches = categories?.filter(c => c.name_ar.includes(term)) || [];
        if (matches.length > 0) {
            console.log(`\nMatches for "${term}":`);
            matches.forEach(m => console.log(`  [${m.id}] ${m.name_ar}`));
        }
    }
}

dump();
