const fs = require('fs');
let data = fs.readFileSync('src/lib/mock.ts', 'utf-8');

// ============================
// 1. FIX CATEGORY ORDER
// ============================
// User's exact order:
// بيرجر(113) → سندويشات(101) → وجبات عائلية(116) → وجبات رئيسية(102) → أجنحة(103)
// → وجبات اطفال(104) → سلطات(105) → مقبلات(114) → باستا(115) → حلويات(110)
// → مشروبات باردة(111) → قهوة باردة(106) → سموذي طبيعي(107) → ميلك شيك(108)
// → مشروبات ساخنة(109) → اراجيل(112)

const newCategories = `export const mockCategories = [
  { id: 113, nameAr: "بيرجر", nameEn: "Burgers", branchId: null, sortOrder: 1, iconClass: "🍔", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 18 },
  { id: 101, nameAr: "ساندويشات", nameEn: "Sandwiches", branchId: null, sortOrder: 2, iconClass: "🥪", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 6 },
  { id: 116, nameAr: "وجبات عائلية", nameEn: "Family Meals", branchId: null, sortOrder: 3, iconClass: "👨‍👩‍👧‍👦", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 4 },
  { id: 102, nameAr: "وجبات رئيسية", nameEn: "Main Meals", branchId: null, sortOrder: 4, iconClass: "🍽️", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 7 },
  { id: 103, nameAr: "أجنحة", nameEn: "Wings", branchId: null, sortOrder: 5, iconClass: "🍗", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 7 },
  { id: 104, nameAr: "وجبات الأطفال", nameEn: "Kids Meals", branchId: null, sortOrder: 6, iconClass: "🧸", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 3 },
  { id: 105, nameAr: "سلطات", nameEn: "Salads", branchId: null, sortOrder: 7, iconClass: "🥗", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 6 },
  { id: 114, nameAr: "مقبلات", nameEn: "Appetizers", branchId: null, sortOrder: 8, iconClass: "🍟", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 13 },
  { id: 115, nameAr: "باستا", nameEn: "Pasta", branchId: 2, sortOrder: 9, iconClass: "🍝", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 3 },
  { id: 110, nameAr: "حلويات", nameEn: "Desserts", branchId: null, sortOrder: 10, iconClass: "🍰", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 9 },
  { id: 111, nameAr: "مشروبات باردة", nameEn: "Cold Drinks", branchId: null, sortOrder: 11, iconClass: "🥤", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 18 },
  { id: 106, nameAr: "قهوة باردة", nameEn: "Cold Coffee", branchId: null, sortOrder: 12, iconClass: "🧊", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 9 },
  { id: 107, nameAr: "سموذي طبيعي", nameEn: "Natural Smoothie", branchId: null, sortOrder: 13, iconClass: "🥤", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 1 },
  { id: 108, nameAr: "ميلك شيك", nameEn: "Milkshake", branchId: null, sortOrder: 14, iconClass: "🥤", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 1 },
  { id: 109, nameAr: "مشروبات ساخنة", nameEn: "Hot Drinks", branchId: null, sortOrder: 15, iconClass: "☕", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 15 },
  { id: 112, nameAr: "أراجيل", nameEn: "Hookah", branchId: null, sortOrder: 16, iconClass: "💨", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 1 }
];`;

data = data.replace(/export const mockCategories = \[[\s\S]*?\];/, newCategories);

// ============================
// 2. FIX BURGER SIZES: Only Classic Cheeseburger (id 1131)
// ============================
// Change the burger size addon group (id: 1) from whole category to specific product
data = data.replace(
  /id: 1, nameAr: "الحجم", nameEn: "Size", categoryId: 113, productId: null/,
  'id: 1, nameAr: "الحجم", nameEn: "Size", categoryId: 113, productId: 1131'
);

// ============================
// 3. FIX PRICES: basePrice should be set so Math.round(basePrice * 0.9) = listed price
// ============================
// The user's real prices are the FINAL price the customer pays.
// With discount: 10, the formula is: finalPrice = Math.round(basePrice * 0.9)
// So: basePrice = the value where Math.round(basePrice * 0.9) = listedPrice

function calcBasePrice(listedPrice) {
  // Find the smallest basePrice where Math.round(basePrice * 0.9) = listedPrice
  for (let bp = listedPrice; bp <= listedPrice * 2; bp++) {
    if (Math.round(bp * 0.9) === listedPrice) return bp;
  }
  return listedPrice; // fallback
}

// Product name (Arabic) → listed (real) price the user wants customer to pay
const realPrices = {
  "أجنحة مقلية مقرمشة": 30,
  "سبانش لاتيه": 17, // cold
  "كولا": 5,
  "شاي": 8,
  "ميلك شيك": 17,
  "سموذي طبيعي": 17,
  "وافل مع آيس كريم": 22,
  "أرجيلة": 30,
  "كيدز بيرجر لحمة": 23,
  "كلاسيك تشيز بيرجر": 23,
  "ستيك دجاج مشوي": 45,
  "ساندويش دجاج مقلي مقرمش (كريسبي)": 25,
  "بينا أرابيتا": 30,
  "كولا زيرو": 5,
  "كولا تشات": 5,
  "كولا تشات زيرو": 5,
  "سبرايت دايت": 5,
  "كابي": 5,
  "تشيكن اند فرايز": 30,
  "سلطة سيزر": 25,
  "أصابع دجاج 5 قطع": 22,
  "سلطة يونانية": 30,
  "أجنحة بصوص البافلو": 28,
  "آيس كابتشينو": 17,
  "سبرايت": 5,
  "اسبريسو": 8,
  "كريب مع شوكولاتة": 22,
  "كيدز بيرجر دجاج": 23,
  "سماش بيرجر": 35,
  "ريب أي ستيك": 90,
  "ساندويش دجاج مشوي": 25,
  "بينا بيستو": 30,
  "بوب كورن دجاج": 22,
  "سلطة جرجير": 25,
  "أجنحة بصوص الباربيكيو": 28,
  "آيس لاتيه": 17,
  "فانتا": 5,
  "قهوة عربية": 12,
  "سوفليه مع بوظة": 22,
  "بوب كورن دجاج (أطفال)": 23,
  "باربيكيو بيرجر": 25,
  "فيليه ستيك": 70,
  "ساندويش دجاج إيطالي": 25,
  "بينا الفريدو": 30,
  "أصابع موزاريلا": 12,
  "سلطة حلومي": 35,
  "أجنحة بصوص التيراكي": 28,
  "آيس كوفي": 17,
  "ماء صغير": 4,
  "أمريكانو": 12,
  "آيس كريم": 15,
  "سويس مشروم بيرجر": 30,
  "دجاج فاهيتا مع أرز": 45,
  "ساندويش مسحب فاهيتا": 25,
  "بينا روزيه": 30,
  "حلقات بصل": 10,
  "سلطة كينوا": 30,
  "أجنحة بصوص وثوم وليمون وبارميزان": 28,
  "آيس كارميل لاتيه": 19,
  "بفاريا": 8,
  "موكا": 15,
  "سان سباستيان تشيز كيك": 30,
  "مشروم بيرجر": 30,
  "ستروجانوف دجاج مع أرز": 45,
  "ساندويش حلومي": 25,
  "ماك اند تشيز": 25,
  "بطاطا مقلية": 7,
  "سلطة فتوش": 30,
  "أجنحة بصوص الثومة والليمون": 28,
  "آيس أمريكانو": 15,
  "صودا": 8,
  "وايت موكا": 15,
  "بلوبيري تشيز كيك": 22,
  "مشروم وايت صوص بيرجر": 30,
  "ستروجانوف لحمة مع أرز": 60,
  "ساندويش أسايدو": 36,
  "فيتوتشيني الفريدو": 30,
  "علبة جبنة": 5,
  "أجنحة بصوص السويت شيلي": 28,
  "فرابتشينو": 17,
  "XL": 8,
  "كابتشينو": 15,
  "لوتس تشيز كيك": 22,
  "مكسيكانو بيرجر": 30,
  "فوتوتشيني مع دجاج": 45,
  "سباجيتي ريد صوص": 30,
  "بطاطا": 12,
  "آيس موكا": 17,
  "آيس فانيلا": 17,
  "لاتيه": 15,
  "تيراميسو": 22,
  "أسايدو بيرجر": 36,
  "سباجيتي روزيه": 30,
  "آيس وايت موكا": 17,
  "آيس تي": 17,
  "شاي لاتيه": 15,
  "فرينش فانيلا": 15,
  "تشوكليت كيك": 22,
  "ريب أي بيرجر": 45,
  "آيس تشوكليت": 17,
  "بندق": 15,
  "أرابيكا بيرجر": 30,
  "فيليه تشيز ستيك": 36,
  "موميتو": 17,
  "هوت تشوكليت": 15,
  "بلو تشيز بيرجر": 30,
  "تورتيلا دجاج مقلي مقرمش": 18,
  "عصير": 15,
  "إيطاليان تشوكليت": 15,
  "فرايد ايغ بيرجر": 30,
  "مكس أعشاب": 10,
  "كوكتيل مع بوظة": 22,
  "ستيك بيرجر": 36,
  "سبانش لاتيه (ساخن)": 15, // hot
  "دجاج كريسبي بيرجر": 25,
  "نسكافيه": 12,
  "دجاج مشوي بيرجر": 25,
  "نباتي بيرجر": 30,
  "بصل مكرمل بيرجر": 30,
  "هاواين بيرجر": 30
};

// Update each product's basePrice
let updatedCount = 0;
for (const [name, listedPrice] of Object.entries(realPrices)) {
  const bp = calcBasePrice(listedPrice);
  // Verify
  const final = Math.round(bp * 0.9);
  if (final !== listedPrice) {
    console.error(`WARNING: ${name} → basePrice=${bp}, finalPrice=${final}, wanted=${listedPrice}`);
  }

  // Replace basePrice for this product name
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    '(nameAr: "' + escapedName + '"[^}]+?basePrice: )\\d+',
    's'
  );
  if (regex.test(data)) {
    data = data.replace(regex, '$1' + bp);
    updatedCount++;
  }
}

// Special fix for hot Spanish Latte (id 1104) - same name as cold, need to handle by ID
data = data.replace(
  /(id: 1104,[^}]+?basePrice: )\d+/s,
  '$1' + calcBasePrice(15)
);

console.log(`Updated ${updatedCount} product prices`);

// ============================
// 4. Pasta products: set branchId to 2 (al-tira only)
// ============================
data = data.replace(
  /(categoryId: 115, branchId: )null, allBranches: true/g,
  '$1' + '2, allBranches: false'
);

// Save
fs.writeFileSync('src/lib/mock.ts', data, 'utf-8');

// ============================
// VERIFY: Print all products with prices
// ============================
console.log('\n--- PRICE VERIFICATION (basePrice → finalPrice) ---');
const matches = [...data.matchAll(/nameAr: "([^"]+)"[^}]+?basePrice: (\d+), discount: (\d+)/gs)];
let allOk = true;
for (const m of matches) {
  const name = m[1];
  const bp = parseInt(m[2]);
  const disc = parseInt(m[3]);
  const finalPrice = Math.round(bp * (1 - disc / 100));
  const expected = realPrices[name];
  if (expected && finalPrice !== expected) {
    console.log(`❌ ${name}: base=${bp}, disc=${disc}%, final=${finalPrice}, expected=${expected}`);
    allOk = false;
  }
}
if (allOk) console.log('✅ All prices are mathematically correct!');
