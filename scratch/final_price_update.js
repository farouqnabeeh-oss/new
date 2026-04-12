const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const updates = [
  { id: 59, price: 22 }, // وافل مع آيس كريم
  { id: 62, price: 15 }, // آيس كريم
  { id: 61, price: 22 }, // سوفليه مع بوظة
  { id: 43, price: 17 }, // ميلك شيك
  { id: 114, price: 15 }, // فرينش فانيلا
  { id: 50, price: 15 }, // وايت موكا
  { id: 56, price: 10 }, // مكس أعشاب
  { id: 52, price: 15 }, // شاي لاتيه
  { id: 54, price: 15 }, // هوت تشوكليت (شوكولاته دافئة)
  { id: 48, price: 15 }, // كابتشينو
  { id: 53, price: 15 }, // بندق (قهوة البندق)
  { id: 47, price: 12 }, // أمريكانو
  { id: 68, price: 5 },  // كولا
  { id: 69, price: 5 },  // كولا زيرو
  { id: 74, price: 5 },  // سبرايت
  { id: 75, price: 5 },  // فانتا
  { id: 79, price: 8 },  // XL
  { id: 77, price: 8 },  // بفاريا
  { id: 83, price: 17 }, // موميتو (موهيتو)
  { id: 76, price: 4 },  // ماء (مياه)
  { id: 78, price: 8 },  // صودا
  { id: 31, price: 30 }, // سلطة كينوا
  { id: 28, price: 30 }, // سلطة يونانية
  { id: 32, price: 30 }, // سلطة فتوش
  { id: 29, price: 25 }, // سلطة جرجير
  { id: 27, price: 25 }, // سلطة سيزر
  { id: 115, price: 70 }, // فيليه تشيز ستيك
  { id: 110, price: 10 }, // حلقات بصل
  { id: 107, price: 22 }, // بوب كورن دجاج
  { id: 109, price: 30 }, // تشيكن اند فرايز
  { id: 112, price: 5 },  // علبة جبنة (جبنى اضافية)
  { id: 108, price: 22 }, // أصابع دجاج
  { id: 105, price: 12 }, // أصابع موزاريلا
  { id: 106, price: 12 }  // أصابع موزاريلا مكررة
];

async function finalUpdate() {
  console.log("--- Final Safe Price Update ---");

  for (const item of updates) {
    const { error } = await supabase.from('products')
      .update({ base_price: item.price, discount: 0 })
      .eq('id', item.id);
    
    if (error) console.error(`Error updating ID ${item.id}:`, error);
    else console.log(`ID ${item.id} updated to ${item.price}`);
  }

  // Handle remaining by name for those I couldn't find ID for
  const remaining = [
    { name: 'اسبريسو', price: 8 },
    { name: 'ستيك دجاج مشوي', price: 45 },
    { name: 'دجاج فاهيتا مع أرز', price: 45 },
    { name: 'ستروجانوف دجاج مع أرز', price: 45 },
    { name: 'ريب اي ستيك', price: 90 },
    { name: 'فتوتشيني الفريدو', price: 35 },
    { name: 'عصير', price: 15 }, // عصائر طازجة
    { name: 'أصابع دجاج 5 قطع', price: 22 },
    { name: 'شاي', price: 8 } // شاي اخضر / شاي مع نعناع
  ];

  for (const item of remaining) {
     const { data: matched } = await supabase.from('products').select('id, name_ar').ilike('name_ar', `%${item.name}%`);
     if (matched) {
        for (const m of matched) {
          console.log(`Updating ${m.name_ar} to ${item.price}`);
          await supabase.from('products').update({ base_price: item.price, discount: 0 }).eq('id', m.id);
        }
     }
  }

  console.log("--- Final Update Complete ---");
}

finalUpdate();
