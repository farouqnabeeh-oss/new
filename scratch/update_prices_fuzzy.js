const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const priceList = [
  { name: 'وافل', price: 22 },
  { name: 'ايس كريم', price: 15 },
  { name: 'سوفليه', price: 22 },
  { name: 'ميلك شيك', price: 17 },
  { name: 'فانيلا', price: 15 },
  { name: 'وايت موكا', price: 15 },
  { name: 'اعشاب', price: 10 },
  { name: 'شاي اخضر', price: 8 },
  { name: 'شاي مع نعناع', price: 8 },
  { name: 'شاي لاتي', price: 15 },
  { name: 'شوكلاته', price: 15 },
  { name: 'موكا', price: 15 },
  { name: 'كابتشينو', price: 15 },
  { name: 'بندق', price: 15 },
  { name: 'اميريكانو', price: 12 },
  { name: 'كولا', price: 5 },
  { name: 'سبرايت', price: 5 },
  { name: 'فانتا', price: 5 },
  { name: 'اكس ال', price: 8 },
  { name: 'بافاريا', price: 8 },
  { name: 'موهيتو', price: 17 },
  { name: 'مياه', price: 4 },
  { name: 'عصائر', price: 15 },
  { name: 'صودا', price: 8 },
  { name: 'كينوا', price: 30 },
  { name: 'يونانية', price: 30 },
  { name: 'فتوش', price: 30 },
  { name: 'جرجير', price: 25 },
  { name: 'سلطة دجاج', price: 35 },
  { name: 'سيزر', price: 25 },
  { name: 'حلومي', price: 35 },
  { name: 'ستيك دجاج', price: 45 },
  { name: 'فيليه', price: 70 },
  { name: 'فاهيتا', price: 45 },
  { name: 'فتوتشيني م دجاج', price: 45 },
  { name: 'ستروجانوف', price: 45 },
  { name: 'ريب اي', price: 90 },
  { name: 'الفريدو', price: 35 },
  { name: 'اصابع دجاج', price: 22 },
  { name: 'حلقات بصل', price: 10 },
  { name: 'بوب كورن', price: 22 },
  { name: 'جبنى اضافية', price: 5 },
  { name: 'تشكن امد فرايز', price: 30 },
  { name: 'هلابينو', price: 3 },
  { name: 'مزراريلا', price: 12 }
];

async function updatePricesFuzzy() {
  console.log("--- Starting Fuzzy Price Update ---");

  const { data: products } = await supabase.from('products').select('*');
  
  for (const item of priceList) {
    // Fuzzy matching: if DB name contains the list name or vice-versa
    const matches = products.filter(p => {
       const dbName = (p.name_ar || "").trim();
       return dbName.includes(item.name) || item.name.includes(dbName);
    });

    for (const product of matches) {
       console.log(`Matching ${item.name} -> ${product.name_ar}: ${item.price}`);
       await supabase.from('products').update({ 
         base_price: item.price,
         discount: 0 
       }).eq('id', product.id);
    }
  }

  console.log("--- Fuzzy Update Complete ---");
}

updatePricesFuzzy();
