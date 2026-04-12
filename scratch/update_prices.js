const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const priceList = [
  { name: 'وافل مع ايس كريم', price: 22 },
  { name: 'ايس كريم', price: 15 },
  { name: 'سوفليه مع ايس كريم', price: 22 },
  { name: 'ميلك شيك', price: 17 },
  { name: 'فرينش فانيلا', price: 15 },
  { name: 'وايت موكا', price: 15 },
  { name: 'مكس اعشاب', price: 10 },
  { name: 'شاي اخضر مع نعناع', price: 8 },
  { name: 'شاي مع نعناع', price: 8 },
  { name: 'شاي لاتي', price: 15 },
  { name: 'شوكلاته دافئة', price: 15 },
  { name: 'موكا', price: 15 },
  { name: 'كابتشينو', price: 15 },
  { name: 'قهوة البندق', price: 15 },
  { name: 'اميريكانو', price: 12 },
  { name: 'كولا', price: 5 },
  { name: 'كولا زيرو', price: 5 },
  { name: 'سبرايت', price: 5 },
  { name: 'فانتا', price: 5 },
  { name: 'اكس ال', price: 8 },
  { name: 'بافاريا', price: 8 },
  { name: 'موهيتو', price: 17 },
  { name: 'مياه', price: 4 },
  { name: 'عصائر طازجة', price: 15 },
  { name: 'صودا', price: 8 },
  { name: 'مشروبات باردة كولا', price: 5 },
  { name: 'سلطة كينوا', price: 30 },
  { name: 'سلطة يونانية', price: 30 },
  { name: 'سلطة فتوش', price: 30 },
  { name: 'سلطة جرجير', price: 25 },
  { name: 'سلطة دجاج', price: 35 },
  { name: 'سلطة سيزر', price: 25 },
  { name: 'سلطة حلومي', price: 35 },
  { name: 'ستيك دجاج مشوي مع وايت صوص', price: 45 },
  { name: 'ستيك دجاج مشوي بالثوم', price: 45 },
  { name: 'ستيك فيليه مشوي', price: 70 },
  { name: 'دجاج فاهيتا مع ارز', price: 45 },
  { name: 'فتوتشيني م دجاج', price: 45 },
  { name: 'دجاج ستروجانوف مع ارز', price: 45 },
  { name: 'ريب اي ستيك', price: 90 },
  { name: 'فتوتشيني الفريدو', price: 35 },
  { name: 'اصابع دجاج', price: 22 },
  { name: 'حلقات بصل', price: 10 },
  { name: 'بوب كورن دجاج', price: 22 },
  { name: 'جبنى اضافية', price: 5 },
  { name: 'تشكن امد فرايز', price: 30 },
  { name: 'هلابينو', price: 3 },
  { name: 'اصابع مزراريلا', price: 12 }
];

async function updatePrices() {
  console.log("--- Starting Price Update ---");

  // Load all products
  const { data: products } = await supabase.from('products').select('*');
  
  for (const item of priceList) {
    // Find matching product (loose match for Arabic text)
    const product = products.find(p => 
      (p.name_ar || "").trim() === item.name.trim() || 
      (p.name_ar || "").includes(item.name)
    );

    if (product) {
       console.log(`Updating ${product.name_ar}: ${product.base_price} -> ${item.price}`);
       await supabase.from('products').update({ 
         base_price: item.price,
         discount: 0 // Reset discount as per "Final Price" logic
       }).eq('id', product.id);
    } else {
       console.warn(`Product NOT FOUND: ${item.name}`);
    }
  }

  // Handle Espresso specifically
  console.log("Handling Espresso sizes...");
  const { data: espresso } = await supabase.from('products')
    .select('id, name_ar')
    .or('name_ar.ilike.%اسبريسو%,name_en.ilike.%espresso%')
    .single();

  if (espresso) {
     // Find the size group for this product
     const { data: sizeGroup } = await supabase.from('addon_groups')
       .select('id')
       .eq('product_id', espresso.id)
       .eq('group_type', 'sizes')
       .single();
     
     if (sizeGroup) {
        // Update small size to 8
        await supabase.from('addon_group_items')
          .update({ price: 8 })
          .eq('addon_group_id', sizeGroup.id)
          .or('name_ar.ilike.%صغير%,name_en.ilike.%small%');
        
        // Update large size to 12
        await supabase.from('addon_group_items')
          .update({ price: 12 })
          .eq('addon_group_id', sizeGroup.id)
          .or('name_ar.ilike.%كبير%,name_en.ilike.%large%');
        
        console.log("Updated Espresso sizes successfully.");
     }
  }

  console.log("--- Price Update Complete ---");
}

updatePrices();
