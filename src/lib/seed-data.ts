import { getSupabaseAdmin } from "./supabase";

export async function seedRestaurantData() {
  const supabase = getSupabaseAdmin();

  console.log("Starting database seeding...");

  // 1. Categories
  const categories = [
    { name_ar: "بيرجر", name_en: "Burgers", sort_order: 1, is_active: true, icon_class: "🍔" },
    { name_ar: "وجبات رئيسية", name_en: "Main Meals", sort_order: 2, is_active: true, icon_class: "🍽️" },
    { name_ar: "أجنحة", name_en: "Wings", sort_order: 3, is_active: true, icon_class: "🍗" },
    { name_ar: "وجبات الأطفال", name_en: "Kids Meals", sort_order: 4, is_active: true, icon_class: "🧸" },
    { name_ar: "سلطات", name_en: "Salads", sort_order: 5, is_active: true, icon_class: "🥗" },
    { name_ar: "مقبلات", name_en: "Appetizers", sort_order: 6, is_active: true, icon_class: "🍟" },
    { name_ar: "حلويات", name_en: "Desserts", sort_order: 7, is_active: true, icon_class: "🍰" },
    { name_ar: "مشروبات باردة", name_en: "Cold Drinks", sort_order: 8, is_active: true, icon_class: "🥤" },
    { name_ar: "قهوة باردة", name_en: "Cold Coffee", sort_order: 9, is_active: true, icon_class: "🧊" },
    { name_ar: "سموذي طبيعي", name_en: "Natural Smoothie", sort_order: 10, is_active: true, icon_class: "🥤" },
    { name_ar: "ميلك شيك", name_en: "Milkshake", sort_order: 11, is_active: true, icon_class: "🥤" },
    { name_ar: "مشروبات ساخنة", name_en: "Hot Drinks", sort_order: 12, is_active: true, icon_class: "☕" },
    { name_ar: "أراجيل", name_en: "Hookah", sort_order: 13, is_active: true, icon_class: "💨" },
    { name_ar: "باستا", name_en: "Pasta", sort_order: 14, is_active: true, icon_class: "🍝" },
    { name_ar: "ساندويشات", name_en: "Sandwiches", sort_order: 15, is_active: true, icon_class: "🥪" },
    { name_ar: "عروض الفاميلي", name_en: "Family Offers", sort_order: 16, is_active: true, icon_class: "👨‍👩‍👧" },
  ];

  const { data: catData, error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: 'name_en' })
    .select();

  if (catError || !catData) {
    console.error("Error seeding categories:", catError);
    return;
  }

  const categoryMap = Object.fromEntries(catData.map(c => [c.name_en, c.id]));

  // 2. Products
  const products = [
    // Burgers
    { name_ar: "كلاسيك تشيز بيرجر", name_en: "Classic Cheese Burger", description_ar: "120 غرام . جبنة تشيدر . خس . بندورة . بصل . صوص اب تاون", description_en: "120g, cheddar, lettuce, tomato, onions, uptown sauce", base_price: 25, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/classic-cheeseburger__0x1e3y1qv68eiip.jpg" },
    { name_ar: "سماش بيرجر", name_en: "Smash Burger", description_ar: "240 غرام . جبنة تشيدر . مخلل . خس . بندورة . بصل . صوص اب تاون", description_en: "240g, double cheddar, pickles, lettuce, tomato, onions, uptown sauce", base_price: 35, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/smashed-burger__f4vm70uiqpdg28s.jpg" },
    { name_ar: "باربيكيو بيرجر", name_en: "BBQ Burger", description_ar: "150 غرام . خس . جبنة موزاريلا . مخلل . بصل . باربيكيو . صوص اب تاون", description_en: "150g, mozzarella, pickles, onions, bbq sauce, uptown sauce", base_price: 25, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/bbq-burger__qw0nxdtpwc5rbst.jpg" },
    { name_ar: "سويس مشروم بيرجر", name_en: "Swiss Mushroom Burger", description_ar: "150 غرام . جبنة سويسرية . خس . بندورة . بصل . مشروم. مخلل . صوص اب تاون", description_en: "150g, swiss cheese, lettuce, tomato, mushroom, onions, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/swiss-mushroom-burger__txtxxp1aifr4j8i.jpg" },
    { name_ar: "مشروم بيرجر", name_en: "Mushroom Burger", description_ar: "150 غرام . مشروم. خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g, mushroom, lettuce, tomato, pickles, onions, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/mushroom-burger__s07zohznm42itsy.jpg" },
    { name_ar: "مشروم وايت صوص بيرجر", name_en: "Mushroom White Sauce Burger", description_ar: "150 غرام . مشروم. وايت صوص . خس . بندورة . بصل . اب تاون صوص", description_en: "150g, mushroom, white sauce, lettuce, tomato, onions, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/mushroom-white-sauce-burger__4w37ua1o61radfn.jpg" },
    { name_ar: "مكسيكانو بيرجر", name_en: "Mexicano Burger", description_ar: "150 غرام . خس . جبنة تشيدر . بندورة . بصل . هالبينو . صوص مكسيكي", description_en: "150g, cheddar, tomato, onions, jalapeno, mexican sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/mexicano-burger__l76kbi9btmcrvey.jpg" },
    { name_ar: "أسايدو بيرجر", name_en: "Asado Burger", description_ar: "150 غرام . قطع لحم بقري فاخر مطهو لأكثر من 5 ساعات . مخلل . صوص اب تاون . خس . بندورة . بصل مشوي", description_en: "150g slow-cooked beef bits, pickles, uptown sauce, lettuce, tomato, grilled onions", base_price: 36, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/asado-burger__2m81wutgpbyhv9z.jpg" },
    { name_ar: "ريب أي بيرجر", name_en: "Ribeye Burger", description_ar: "150 غرام . جبنة شيدر . جبنة موزاريلا . مخلل . صوص مدخن . خس . بندورة . بصل", description_en: "150g patty, cheddar, mozzarella, pickles, smoked sauce, lettuce, tomato, onions", base_price: 45, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/ribeye-burger__8w4my5hb4xqt6zg.jpg" },
    { name_ar: "أرابيكا بيرجر", name_en: "Arabica Burger", description_ar: "150 غرام . مكس من لحم الخاروف والعجل . خس . بندورة . بصل . مخلل . صوص", description_en: "150g lamb/veal mix, lettuce, tomato, onions, pickles, sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/arabica-burger__18bxeuobojgdvh9.jpg" },
    { name_ar: "بلو تشيز بيرجر", name_en: "Blue Cheese Burger", description_ar: "150 غرام . بلو تشيز . عسل . مكسرات . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g, blue cheese, honey, nuts, lettuce, tomato, onions, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/blue-cheese-burger__n6kolhf4bmk2o6c.jpg" },
    { name_ar: "فرايد ايغ بيرجر", name_en: "Fried Egg Burger", description_ar: "150 غرام . بيض مقلي . جبنة تشيدر . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g, fried egg, cheddar, lettuce, tomato, onions, pickles, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/fried-egg-burger__40j1tpwdob2wmoy.jpg" },
    { name_ar: "ستيك بيرجر", name_en: "Steak Burger", description_ar: "150 غرام . قطعة كلاسيك . شرائح ستيك فيليه 60 غرام . جبنة تشيدر . جبنة موزاريلا . صوص اب تاون . خس . بندورة", description_en: "150g patty + fillet strips, cheddar, mozzarella, uptown sauce, lettuce, tomato", base_price: 36, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/steak-burger__e825653zpga0dw0.jpg" },
    { name_ar: "دجاج كريسبي بيرجر", name_en: "Crispy Chicken Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g crispy chicken, lettuce, tomato, pickles, uptown sauce", base_price: 25, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/crispy-chicken-burger__49g1si6flsxx82w.jpg" },
    { name_ar: "دجاج مشوي بيرجر", name_en: "Grilled Chicken Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g grilled chicken, lettuce, tomato, pickles, uptown sauce", base_price: 25, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/grilled-chicken-burger__bm22lgyfrl1ixtx.jpg" },
    { name_ar: "نباتي بيرجر", name_en: "Vegetarian Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون . صوص رانش . جبنة حلومي", description_en: "150g vegetable patty, lettuce, tomato, onions, pickles, halloumi cheese", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/vegetarian-burger__h0no3tubpyaxbs0.jpg" },
    { name_ar: "بصل مكرمل بيرجر", name_en: "Caramelized Onion Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون . بصل مكرمل", description_en: "150g, lettuce, tomato, onions, pickles, caramelized onion, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/caramelized-onion-burger__rpouw9135aroh54.jpg" },
    { name_ar: "هاواين بيرجر", name_en: "Hawaiian Burger", description_ar: "150 غرام . خس . بندورة . قطعتين أناناس . مخلل . صوص اب تاون", description_en: "150g, lettuce, tomato, pineapple rings (2), pickles, uptown sauce", base_price: 30, discount: 0, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/hawaiian-burger__ev2mcri9z6vgqev.jpg" },

    // Main Meals
    { name_ar: "ستيك دجاج مشوي", name_en: "Grilled Chicken Steak", description_ar: "خضار سوتيه . ماشد بوتيتو", description_en: "Sautéed vegetables, mashed potatoes", base_price: 45, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/grilled-chicken-steak__1i9bertljdazgo6.jpg" },
    { name_ar: "ريب أي ستيك", name_en: "Ribeye Steak", description_ar: "ستيك ريب أي . خضار سوتيه . ماشد بوتيتو . وايت صوص", description_en: "Ribeye steak, sautéed vegetables, mashed potatoes, and white sauce", base_price: 90, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, has_doneness_option: true, image_path: "/images/ribeye-steak__ug7of6vwzmplsva.jpg" },
    { name_ar: "فيليه ستيك", name_en: "Fillet Steak", description_ar: "ستيك فيليه . خضار سوتيه . ماشد بوتيتو . وايت صوص", description_en: "Fillet steak, sautéed vegetables, mashed potatoes, and white sauce", base_price: 70, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, has_doneness_option: true, image_path: "/images/beef-fillet-steak__1z530ggv6hnt6g0.webp" },
    { name_ar: "دجاج فاهيتا مع أرز", name_en: "Fajita Chicken with Rice", description_ar: "دجاج . فلفل حلو . بصل . مشروم. صوص مكسيكي", description_en: "Chicken, bell peppers, onions, mushroom, and Mexican sauce", base_price: 45, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/chicken-fajita-with-rice__2re3bdsltsnwkzv.jpg" },
    { name_ar: "ستروجانوف دجاج مع أرز", name_en: "Chicken Stroganoff with Rice", description_ar: "دجاج . فلفل حلو . بصل . مشروم. وايت صوص", description_en: "Chicken, bell peppers, onions, mushroom, and white sauce", base_price: 45, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/chicken-stroganoff-with-rice__nl0w7mlpkeq6dl9.jpg" },
    { name_ar: "ستروجانوف لحمة مع أرز", name_en: "Beef Stroganoff with Rice", description_ar: "شرائح فيليه ستيك . فلفل حلو . بصل . مشروم. وايت صوص", description_en: "Fillet steak strips, bell peppers, onions, mushroom, and white sauce", base_price: 60, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/beef-stroganoff-with-rice__pyr14b4rim9cnsg.jpg" },
    { name_ar: "ستروجانوف دجاج", name_en: "Chicken Stroganoff", description_ar: "دجاج . فلفل حلو . بصل . مشروم. وايت صوص", description_en: "Chicken, bell peppers, onions, mushroom, and white sauce", base_price: 45, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/chicken-stroganoff-with-rice__nl0w7mlpkeq6dl9.jpg" },
    { name_ar: "ستروجانوف لحمة", name_en: "Beef Stroganoff", description_ar: "شرائح فيليه ستيك . فلفل حلو . بصل . مشروم. وايت صوص", description_en: "Fillet steak strips, bell peppers, onions, mushroom, and white sauce", base_price: 60, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/beef-stroganoff-with-rice__pyr14b4rim9cnsg.jpg" },
    { name_ar: "فوتوتشيني مع دجاج", name_en: "Fettuccine with Chicken", description_ar: "دجاج مشوي . فوتوتشيني . مشروم. وايت صوص . جبنة بارميزان", description_en: "Grilled chicken, fettuccine, mushroom, white sauce, and parmesan cheese", base_price: 45, discount: 0, category_id: categoryMap["Main Meals"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },

    // Pasta
    { name_ar: "سباجيتي ريد صوص", name_en: "Spaghetti Red Sauce", description_ar: "سباجيتي مع صلصة الطماطم الحمراء", description_en: "Spaghetti with red tomato sauce", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },
    { name_ar: "بينا أرابيتا", name_en: "Penne Arrabbiata", description_ar: "باستا بينا بصلصة حارة", description_en: "Penne pasta with spicy sauce", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },
    { name_ar: "بينا بيستو", name_en: "Penne Pesto", description_ar: "باستا مع صوص البيستو والريحان", description_en: "Penne pasta with pesto sauce", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },
    { name_ar: "بينا روزيه", name_en: "Penne Rose", description_ar: "باستا مع صوص الروزيه الكريمي", description_en: "Penne pasta with creamy rose sauce", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },
    { name_ar: "بينا الفريدو", name_en: "Penne Alfredo", description_ar: "باستا مع صوص الفريدو الكريمي والمشروم", description_en: "Penne pasta with alfredo sauce and mushroom", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },
    { name_ar: "ماك آند تشيز", name_en: "Mac & Cheese", description_ar: "باستا مع صوص الجبن الغني", description_en: "Pasta with rich cheese sauce", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },
    { name_ar: "سباجيتي وايت صوص", name_en: "Spaghetti White Sauce", description_ar: "سباجيتي مع الصلصة البيضاء الكريمية", description_en: "Spaghetti with creamy white sauce", base_price: 30, discount: 0, category_id: categoryMap["Pasta"], is_active: true, all_branches: true, image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg" },

    // Wings
    { name_ar: "أجنحة مقلية مقرمشة", name_en: "Crispy Fried Wings", description_ar: "أجنحة دجاج مقلية مقرمشة", description_en: "Crispy fried chicken wings", base_price: 30, discount: 0, category_id: categoryMap["Wings"], is_active: true, all_branches: true, image_path: "/images/crispy-fried-wings__8a79zxxqhvr0ihm.jpg" },
    { name_ar: "أجنحة بصوص البافلو", name_en: "Buffalo Wings", description_ar: "أجنحة بصوص البافلو الحار", description_en: "Spicy buffalo wings", base_price: 30, discount: 0, category_id: categoryMap["Wings"], is_active: true, all_branches: true, image_path: "/images/buffalo-sauce-wings__hvhrz3c6wkwi56v.jpg" },
    { name_ar: "أجنحة بصوص الباربيكيو", name_en: "BBQ Wings", description_ar: "أجنحة بصوص الباربيكيو المدخن", description_en: "Smoked BBQ wings", base_price: 30, discount: 0, category_id: categoryMap["Wings"], is_active: true, all_branches: true, image_path: "/images/bbq-sauce-wings__ut71ovptawjn1ai.jpg" },

    // Kids Meals
    { name_ar: "كيدز بيرجر دجاج", name_en: "Kids Chicken Burger", description_ar: "الوجبة تشمل بطاطا مقلية وعصير", description_en: "Meal includes french fries and juice", base_price: 23, discount: 0, category_id: categoryMap["Kids Meals"], is_active: true, all_branches: true, image_path: "/images/file-4d47862d-9ad6-4c84-bb82-b70d9f7ce255.webp" },
    { name_ar: "بوب كورن دجاج أطفال", name_en: "Kids Chicken Popcorn", description_ar: "الوجبة تشمل بطاطا مقلية وعصير", description_en: "Meal includes french fries and juice", base_price: 23, discount: 0, category_id: categoryMap["Kids Meals"], is_active: true, all_branches: true, image_path: "/images/popcorn-chicken__19q2tjl7h9lr4st.jpg" },

    // Salads
    { name_ar: "سلطة سيزر", name_en: "Caesar Salad", description_ar: "خس . جبنة بارميزان . خبز محمص . صوص سيزر", description_en: "Lettuce, parmesan cheese, croutons, and Caesar dressing", base_price: 25, discount: 0, category_id: categoryMap["Salads"], is_active: true, all_branches: true, image_path: "/images/caesar-salad-kgn4gpstowx0mu9-c9d70a64-0049-4b14-974b-dc68ac07791c.jpg" },
    { name_ar: "سلطة يونانية", name_en: "Greek Salad", description_ar: "خس . فلفل ملون . خيار . زيتون أسود . بندورة . ليمون . زيت زيتون . جبنة فيتا", description_en: "Lettuce, bell peppers, cucumber, olives, tomato, lemon, olive oil, and feta cheese", base_price: 30, discount: 0, category_id: categoryMap["Salads"], is_active: true, all_branches: true, image_path: "/images/greek-salad__3ogmuh9isdbt41n.jpg" },

    // Cold Coffee
    { name_ar: "سبانش لاتيه", name_en: "Spanish Latte", description_ar: "بريك قهوة بارد ومنعش", description_en: "Refreshing cold coffee break", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/spanish-latte__0j9ew7pi59r1fb6.jpg" },
    { name_ar: "آيس كابتشينو", name_en: "Ice Cappuccino", description_ar: "كابتشينو مثلج مع رغوة كثيفة", description_en: "Iced cappuccino with thick foam", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-cappuccino__nh76n3rx78rmkfm.jpg" },
    { name_ar: "آيس لاتيه", name_en: "Ice Latte", description_ar: "لاتيه كلاسيكي مثلج", description_en: "Classic iced latte", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-latte__igw1jlq8obg8clj.jpg" },
    { name_ar: "آيس كوفي", name_en: "Ice Coffee", description_ar: "قهوة مثلجة منعشة", description_en: "Refreshing iced coffee", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-coffee__x9fwu0nnonmt1bf.jpg" },
    { name_ar: "آيس كارميل لاتيه", name_en: "Ice Caramel Latte", description_ar: "لاتيه مثلج مع صوص الكارميل", description_en: "Iced latte with caramel sauce", base_price: 19, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-caramel-latte__7s8czuyblnkgk6r.jpg" },
    { name_ar: "آيس أمريكانو", name_en: "Ice Americano", description_ar: "أمريكانو كلاسيكي مثلج", description_en: "Classic iced americano", base_price: 16, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-americano__2ignz0x5yz4sxhu.jpg" },
    { name_ar: "فرابتشينو", name_en: "Frappuccino", description_ar: "مشروب فرابتشينو الغني", description_en: "Rich frappuccino drink", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/frappuccino__11jotuwxtm2czjo.jpg" },
    { name_ar: "آيس موكا", name_en: "Ice Mocha", description_ar: "موكا مثلجة بلمسة شوكولاتة", description_en: "Iced mocha with a chocolate touch", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-mocha__shnp5dn9oggwun7.jpg" },
    { name_ar: "آيس وايت موكا", name_en: "Ice White Mocha", description_ar: "وايت موكا مثلجة", description_en: "Iced white mocha", base_price: 17, discount: 0, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-white-mocha__rcg0h9ji0z1trnx.jpg" },

    // Natural Smoothie
    { name_ar: "سموذي طبيعي", name_en: "Natural Smoothie", description_ar: "تشكيلة سموذي فواكه طبيعية", description_en: "Assorted natural fruit smoothies", base_price: 17, discount: 0, category_id: categoryMap["Natural Smoothie"], is_active: true, all_branches: true, image_path: "/images/natural-smoothie__c9pnbwbvwhncuvs.jpg" },

    // Milkshake
    { name_ar: "ميلك شيك", name_en: "Milkshake", description_ar: "ميلك شيك غني بعدة نكهات", description_en: "Rich milkshakes in various flavors", base_price: 17, discount: 0, category_id: categoryMap["Milkshake"], is_active: true, all_branches: true, image_path: "/images/milkshakes__pgt1ljcxf6qma9t.jpg" },

    // Hot Drinks
    { name_ar: "شاي", name_en: "Tea", description_ar: "شاي كلاسيكي ساخن", description_en: "Classic hot tea", base_price: 8, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/tea__68ipsqrolope9un.jpg" },
    { name_ar: "اسبريسو", name_en: "Espresso", description_ar: "اسبريسو كلاسيكي", description_en: "Classic espresso", base_price: 8, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/espresso__e6jr0mu46qix1iw.jpg" },
    { name_ar: "قهوة عربية", name_en: "Arabic Coffee", description_ar: "قهوة عربية أصيلة", description_en: "Authentic Arabic coffee", base_price: 13, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/arabic-coffee__nrx56q4y8ik0dt1.jpg" },
    { name_ar: "أمريكانو", name_en: "Americano", description_ar: "قهوة أمريكانو ساخنة", description_en: "Hot Americano coffee", base_price: 13, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/americano__ikrmozgl4db883m.jpg" },
    { name_ar: "موكا", name_en: "Mocha", description_ar: "مزيج ساخن من القهوة والكاكاو", description_en: "Hot mix of coffee and cocoa", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/mocha__nruytezewx8c3t4.jpg" },
    { name_ar: "وايت موكا", name_en: "White Mocha", description_ar: "موكا ساخنة بالشوكولاتة البيضاء", description_en: "Hot white chocolate mocha", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/white-mocha__6ch77h9v3dnxy1k.jpg" },
    { name_ar: "كابتشينو", name_en: "Cappuccino", description_ar: "كابتشينو كلاسيكي ساخن", description_en: "Classic hot cappuccino", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/cappuccino__jzn3vtp7cja8809.webp" },
    { name_ar: "لاتيه", name_en: "Latte", description_ar: "لاتيه كلاسيكي ساخن", description_en: "Classic hot latte", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/latte__kgf531y5zc8pm74.jpg" },
    { name_ar: "شاي لاتيه", name_en: "Tea Latte", description_ar: "شاي بلمسة من الحليب", description_en: "Tea with a milky touch", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/tea-latte__lciq1bb4qgw7zfi.jpg" },
    { name_ar: "بندق", name_en: "Hazelnut Drink", description_ar: "مزيج ساخن بنكهة البندق", description_en: "Hot mix with hazelnut flavor", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/hazelnut__ru44q1bkipzkn48.jpg" },
    { name_ar: "هوت تشوكليت", name_en: "Hot Chocolate", description_ar: "شوكولاتة ساخنة غنية", description_en: "Rich hot chocolate", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/hot-chocolate__v09sja0o7rcic8x.jpg" },
    { name_ar: "إيطاليان تشوكليت", name_en: "Italian Chocolate", description_ar: "شوكولاتة إيطالية ساخنة كثيفة", description_en: "Thick Italian hot chocolate", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/italian-chocolate__x4nkeo37cxq9lab.jpg" },
    { name_ar: "مكس أعشاب", name_en: "Herbal Mix", description_ar: "مزيج أعشاب برية ساخنة", description_en: "Hot wild herbal mix", base_price: 10, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/herbal-mix__7hokmq4lw78tzn6.jpg" },
    { name_ar: "سبانش لاتيه", name_en: "Hot Spanish Latte", description_ar: "سبانش لاتيه ساخن", description_en: "Hot Spanish latte", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/spanish-latte__8tnujlrujxfzigl.jpg" },
    { name_ar: "نسكافيه", name_en: "Nescafe", description_ar: "نسكافيه كلاسيكي ساخن", description_en: "Classic hot Nescafe", base_price: 13, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/nescafe__quyge4un0omih97.webp" },
    { name_ar: "قهوة تركية", name_en: "Turkish Coffee", description_ar: "قهوة تركية أصلية", description_en: "Authentic Turkish coffee", base_price: 10, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/espresso__e6jr0mu46qix1iw.jpg" },
    { name_ar: "كورتادو", name_en: "Cortado", description_ar: "اسبريسو مع كمية متساوية من الحليب", description_en: "Espresso with equal part milk", base_price: 14, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/espresso__e6jr0mu46qix1iw.jpg" },
    { name_ar: "فلات وايت", name_en: "Flat White", description_ar: "اسبريسو مع حليب حريري ونسبة قليلة من الرغوة", description_en: "Espresso with silky milk and thin foam", base_price: 16, discount: 0, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/latte__kgf531y5zc8pm74.jpg" },

    // Desserts
    { name_ar: "وافل مع آيس كريم", name_en: "Waffle with Ice Cream", description_ar: "وافل ساخن يقدم مع الآيس كريم", description_en: "Hot waffle served with ice cream", base_price: 22, discount: 0, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/waffle-with-ice-cream__x29z7g0cy8sbot9.jpg" },
    { name_ar: "كريب مع شوكولاتة", name_en: "Crepe with Chocolate", description_ar: "كريب محشو بالشوكولاتة", description_en: "Crepe filled with chocolate", base_price: 22, discount: 0, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/crepe-with-chocolate__6lfwdup297e7hd5.webp" },
    { name_ar: "سوفليه مع بوظة", name_en: "Souffle with Ice Cream", description_ar: "سوفليه شوكولاتة ساخن مع الآيس كريم", description_en: "Hot chocolate souffle with ice cream", base_price: 22, discount: 0, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/souffle-with-ice-cream__o375y0v76qe0ehb.jpg" },
    { name_ar: "تشيز كيك", name_en: "Cheesecake", description_ar: "تشيز كيك غني (لوتس / بلوبيري / سان سباستيان)", description_en: "Rich cheesecake (Lotus / Blueberry / San Sebastian)", base_price: 25, discount: 0, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/san-sebastian-cheesecake__crjozhzu3bx2i1k.jpg" },
    { name_ar: "تيراميسو", name_en: "Tiramisu", description_ar: "حلى التيراميسو الإيطالي", description_en: "Italian Tiramisu dessert", base_price: 22, discount: 0, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/tiramisu__sxnp971n4vv4o5k.jpg" },
    { name_ar: "تشوكليت كيك", name_en: "Chocolate Cake", description_ar: "كيك شوكولاتة غني", description_en: "Rich chocolate cake", base_price: 22, discount: 0, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/chocolate-cake__xb561uywo403igv.jpg" },

    // Cold Drinks
    { name_ar: "كولا", name_en: "Cola", description_ar: "علبة كولا", description_en: "Cola Can", base_price: 6, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/cola__f6o1p5tywou44t7.jpg" },
    { name_ar: "كولا زيرو", name_en: "Cola Zero", description_ar: "علبة كولا زيرو", description_en: "Cola Zero Can", base_price: 6, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/cola__f6o1p5tywou44t7.jpg" },
    { name_ar: "سبرايت دايت", name_en: "Sprite Diet", description_ar: "علبة سبرايت دايت", description_en: "Sprite Diet Can", base_price: 6, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/sprite__i4s36gw3g0d9m6i.jpg" },
    { name_ar: "كابي", name_en: "Cappy Juice", description_ar: "عصير كابي", description_en: "Cappy Juice bottle", base_price: 6, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/file-e09e95f3-e7b0-4c7e-8fc2-a0afa1d97e09.jpg" },
    { name_ar: "سبرايت", name_en: "Sprite", description_ar: "علبة سبرايت", description_en: "Sprite Can", base_price: 6, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/sprite__i4s36gw3g0d9m6i.jpg" },
    { name_ar: "فانتا", name_en: "Fanta", description_ar: "علبة فانتا", description_en: "Fanta Can", base_price: 6, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/fanta__qb9s0izcqjn38fr.jpg" },
    { name_ar: "ماء صغير", name_en: "Small Water", description_ar: "زجاجة مياه صغيرة", description_en: "Small water bottle", base_price: 5, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/small-water__retkduxc2891b17.jpg" },
    { name_ar: "ماء كبير", name_en: "Large Water", description_ar: "زجاجة مياه كبيرة", description_en: "Large water bottle", base_price: 10, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/small-water__retkduxc2891b17.jpg" },
    { name_ar: "بفاريا", name_en: "Bavaria", description_ar: "شراب بفاريا بر باردة", description_en: "Cold Bavaria drink", base_price: 8, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/bavaria__g0tdpqe9yr51l45.jpg" },
    { name_ar: "صودا", name_en: "Soda", description_ar: "ماء صودا", description_en: "Soda water", base_price: 8, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/soda__28xcya6e1tmloih.jpg" },
    { name_ar: "XL", name_en: "XL Energy Drink", description_ar: "مشروب طاقة XL", description_en: "XL Energy Drink", base_price: 8, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/xl__l07thqasq1gfrd8.jpg" },
    { name_ar: "بلو", name_en: "Blue Energy Drink", description_ar: "مشروب طاقة بلو", description_en: "Blue Energy Drink", base_price: 8, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/xl__l07thqasq1gfrd8.jpg" },
    { name_ar: "آيس فانيلا", name_en: "Ice Vanilla", description_ar: "شراب منعش بنكهة الفانيلا", description_en: "Refreshing ice vanilla drink", base_price: 17, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/iced-vanilla__cf85firw7etrfpb.jpg" },
    { name_ar: "آيس تي", name_en: "Ice Tea", description_ar: "شاي مثلج منعش", description_en: "Refreshing iced tea", base_price: 17, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/iced-tea__7xvf02dww34t6g9.jpg" },
    { name_ar: "آيس تشوكليت", name_en: "Ice Chocolate", description_ar: "شوكولاتة مثلجة غنية", description_en: "Rich iced chocolate", base_price: 17, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/iced-chocolate__n5gge2vfh6dvahl.jpg" },
    { name_ar: "موهيتو", name_en: "Mojito", description_ar: "موهيتو منعش للموهيتو", description_en: "Refreshing mojito drink", base_price: 17, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/mojito__dnldrs18pec0our.jpg" },
    { name_ar: "عصير", name_en: "Fresh Juice", description_ar: "عصير فواكه طازج", description_en: "Fresh fruit juice", base_price: 15, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/juice__xe7kdad5ruvmdwq.jpg" },
    { name_ar: "كوكتيل مع بوظة", name_en: "Cocktail with Ice Cream", description_ar: "كوكتيل فواكه مع الآيس كريم", description_en: "Fruit cocktail with ice cream", base_price: 22, discount: 0, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/cocktail-with-ice-cream__8drtk81n7t43qxa.jpg" },

    // Hookah
    { name_ar: "أرجيلة", name_en: "Hookah", description_ar: "أرجيلة بنكهات متنوعة", description_en: "Hookah with various flavors", base_price: 30, discount: 0, category_id: categoryMap["Hookah"], is_active: true, all_branches: true, image_path: "/images/shisha__3rtwtm1vhjem729.jpg" },

    // Appetizers
    { name_ar: "أصابع موزاريلا 3 قطع", name_en: "Mozzarella Sticks 3pcs", description_ar: "3 قطع أصابع موزاريلا مقلية مقرمشة", description_en: "3 pieces of crispy fried mozzarella sticks", base_price: 12, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/mozzarella-sticks-3-pcs__ilg2wr1vbnhdqns.jpg" },
    { name_ar: "بوب كورن دجاج", name_en: "Chicken Popcorn (250g)", description_ar: "250 غرام من قطع الدجاج الصغيرة المقرمشة", description_en: "250g of small crispy chicken pieces", base_price: 22, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/popcorn-chicken__19q2tjl7h9lr4st.jpg" },
    { name_ar: "أصابع دجاج 5 قطع", name_en: "Chicken Fingers 5pcs", description_ar: "5 قطع من أصابع الدجاج المقلية", description_en: "5 pieces of fried chicken finger sticks", base_price: 22, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/chicken-fingers-5-pcs__1sqwat9myfpnpzw.jpg" },
    { name_ar: "تشيكن اند فرايز", name_en: "Chicken and Fries", description_ar: "قطع دجاج مقلية مع بطاطا", description_en: "Fried chicken pieces with french fries", base_price: 30, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/chicken-popcorn__8ql6ou2bhl45zed.jpg" },
    { name_ar: "حلقات بصل 8 قطع", name_en: "Onion Rings 8pcs", description_ar: "8 قطع من حلقات البصل الذهبية", description_en: "8 pieces of golden onion rings", base_price: 10, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/onion-rings-8-pcs__6yyl6nhstlciej0.jpg" },
    { name_ar: "بطاطا مقلية", name_en: "French Fries Appetizer", description_ar: "بطاطا مقلية كلاسيكية", description_en: "Classic crispy french fries", base_price: 7, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/french-fries__15besvty49y4dw2.jpg" },
    { name_ar: "علبة جبنة", name_en: "Cheese Cup Appetizer", description_ar: "علبة صوص الجبنة الغنية", description_en: "Rich cheese sauce cup", base_price: 5, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/cheese-box__h2jnlaey0uea720.jpg" },
    { name_ar: "بطاطا", name_en: "Specialty Potato Appetizer", description_ar: "بطاطا اب تاون الخاصة", description_en: "Special Uptown style potatoes", base_price: 12, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/img-2398-a9a9219e-ca4c-43ed-8365-127be873e542.jpeg" },
    { name_ar: "فرينش فانيلا", name_en: "French Vanilla Specialty", description_ar: "مشروب بنكهة الفانيلا الفرنسية", description_en: "French vanilla flavored drink", base_price: 15, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/french-vanilla__u8v2md0zal4nvo9.jpg" },
    { name_ar: "فيليه تشيز ستيك", name_en: "Philly Cheese Steak Specialty", description_ar: "180 غرام . لحم عجل فيليه مشوي . جبنة تشيدر . جبنة موزاريلا . صوص رانش . فلفل", description_en: "180g veal fillet, cheddar, mozzarella, ranch, peppers", base_price: 36, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/philly-cheesesteak-sandwich__zse9y6u7vbvhagu.jpg" },
    { name_ar: "تورتيلا دجاج مقلي مقرمش", name_en: "Crispy Chicken Tortilla Specialty", description_ar: "140 غرام . كريسبي راب او مشوي . خس . مخلل . بصل . صوص مكسيكي . صوص اب تاون", description_en: "140g crispy/grilled chicken, lettuce, pickles, onions, mexican sauce", base_price: 18, discount: 0, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/crispy-chicken-tortilla-wrap__uij6r0qhdp8qpni.jpg" },

    // Sandwiches
    { name_ar: "ساندويش شنيتسل", name_en: "Schnitzel Sandwich", description_ar: "شنيتسل دجاج مقرمش", description_en: "Crispy chicken schnitzel sandwich", base_price: 26, discount: 0, category_id: categoryMap["Sandwiches"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/schnitzel-sandwich__h86gct2mxlsw4it.jpg" },
    { name_ar: "ساندويش فيليه ستيك", name_en: "Fillet Steak Sandwich", description_ar: "شرائح فيليه ستيك مشوية", description_en: "Grilled fillet steak strips sandwich", base_price: 38, discount: 0, category_id: categoryMap["Sandwiches"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/steak-burger__e825653zpga0dw0.jpg" },
    { name_ar: "ساندويش دجاج مشوي", name_en: "Grilled Chicken Sandwich", description_ar: "صدر دجاج مشوي", description_en: "Grilled chicken breast sandwich", base_price: 26, discount: 0, category_id: categoryMap["Sandwiches"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/grilled-chicken-burger__bm22lgyfrl1ixtx.jpg" },
  ];

  const { data: prodData, error: prodError } = await supabase
    .from("products")
    .upsert(products, { onConflict: 'name_en' })
    .select();

  if (prodError || !prodData) {
    console.error("Error seeding products:", prodError);
  }

  // 3. Branches and Delivery Zones
  const alIrsalZones = [
    { name_ar: "عين منجد", name_en: "Ein Munjed", fee: 18 },
    { name_ar: "الماصيون", name_en: "Al-Masyoun", fee: 16 },
    { name_ar: "رام الله التحتا", name_en: "Lower Ramallah", fee: 14 },
    { name_ar: "ام الشرايط", name_en: "Um Al-Sharayet", fee: 18 },
    { name_ar: "كفر عقب", name_en: "Kufr Aqab", fee: 27 },
    { name_ar: "الارسال", name_en: "Al-Irsal", fee: 10 },
    { name_ar: "سردا", name_en: "Surda", fee: 16 },
    { name_ar: "عين مصباح", name_en: "Ein Misbah", fee: 13 },
    { name_ar: "قلنديا", name_en: "Qalandia", fee: 30 },
    { name_ar: "المطار", name_en: "Airport Area", fee: 30 },
    { name_ar: "بيتونيا", name_en: "Beitunia", fee: 18 },
    { name_ar: "الصناعة", name_en: "Industrial Zone", fee: 18 },
    { name_ar: "البيرة", name_en: "Al-Bireh", fee: 14 },
    { name_ar: "الشرفة", name_en: "Al-Shurfa", fee: 18 },
    { name_ar: "الجنان", name_en: "Al-Jinan", fee: 20 },
    { name_ar: "سطح مرحبا", name_en: "Sateh Marhaba", fee: 18 },
    { name_ar: "جبل الطويل", name_en: "Jabal Al-Taweel", fee: 18 },
    { name_ar: "حي الكرامة", name_en: "Al-Karameh", fee: 30 },
    { name_ar: "ابو قش", name_en: "Abu Qash", fee: 18 },
    { name_ar: "بيرزيت", name_en: "Birzeit", fee: 35 },
    { name_ar: "دورا القرع", name_en: "Dura Al-Qarei", fee: 40 },
    { name_ar: "عين يبرود", name_en: "Ein Yabrud", fee: 40 },
    { name_ar: "يبرود", name_en: "Yabrud", fee: 40 },
    { name_ar: "سلواد", name_en: "Silwad", fee: 60 },
    { name_ar: "المزرعة الشرقية", name_en: "Al-Mazra'a Al-Sharqiya", fee: 60 },
    { name_ar: "عطارة", name_en: "Atara", fee: 60 },
    { name_ar: "عين سينيا", name_en: "Ein Siniya", fee: 45 },
    { name_ar: "جفنا", name_en: "Jifna", fee: 40 },
  ];

  const alTiraZones = [
    { name_ar: "عين منجد", name_en: "Ein Munjed", fee: 10 },
    { name_ar: "الماصيون (دوار الوزراء)", name_en: "Al-Masyoun (Ministers Roundabout)", fee: 12 },
    { name_ar: "شارع المهندسين", name_en: "Engineers Street", fee: 11 },
    { name_ar: "دوار التشريعي", name_en: "Legislative Roundabout", fee: 11 },
    { name_ar: "دوار المينليوم", name_en: "Millennium Roundabout", fee: 12 },
    { name_ar: "محطة الهدى", name_en: "Al-Huda Station", fee: 13 },
    { name_ar: "اول الارسال", name_en: "Beginning of Al-Irsal", fee: 10 },
    { name_ar: "شارع ركب", name_en: "Rukab Street", fee: 10 },
    { name_ar: "الحسبة", name_en: "Al-Hisba", fee: 11 },
    { name_ar: "النهضه", name_en: "Al-Nahda", fee: 11 },
    { name_ar: "شارع المستشفى", name_en: "Hospital Street", fee: 10 },
    { name_ar: "شارع المكتبة", name_en: "Library Street", fee: 10 },
    { name_ar: "رام الله التحتى", name_en: "Lower Ramallah", fee: 10 },
    { name_ar: "الرواد بطن الهوى", name_en: "Al-Rowad Batan Al-Hawa", fee: 11 },
    { name_ar: "الشارع الرئيسي (بطن الهوى)", name_en: "Main Street (Batan Al-Hawa)", fee: 10 },
    { name_ar: "دوار السرية", name_en: "Sareyya Roundabout", fee: 10 },
    { name_ar: "دوار نبيل عمرو", name_en: "Nabil Amr Roundabout", fee: 10 },
    { name_ar: "دوار نيسلون", name_en: "Nelson Roundabout", fee: 10 },
    { name_ar: "دوار شقيرة", name_en: "Shaqira Roundabout", fee: 11 },
    { name_ar: "مدرسة زياد ابو عين", name_en: "Ziad Abu Ein School", fee: 10 },
    { name_ar: "نادي رجال الاعمال", name_en: "Business Men Club", fee: 11 },
    { name_ar: "اسكان ابو عبسة", name_en: "Abu Absa Housing", fee: 12 },
    { name_ar: "حديقة رام الله", name_en: "Ramallah Park", fee: 18 },
    { name_ar: "الجدول", name_en: "Al-Jadwal", fee: 10 },
    { name_ar: "مفرق قراوة", name_en: "Qarawat Junction", fee: 10 },
    { name_ar: "قراوة", name_en: "Qarawat Bin Zeid", fee: 10 },
    { name_ar: "عين قينيا", name_en: "Ein Qinya", fee: 15 },
    { name_ar: "عين عريك", name_en: "Ein Arik", fee: 15 },
    { name_ar: "دير ابزيع", name_en: "Deir Ibzi", fee: 25 },
    { name_ar: "كفر نعمة", name_en: "Kafr Ni'ma", fee: 30 },
    { name_ar: "بلعين", name_en: "Bil'in", fee: 35 },
    { name_ar: "صفا", name_en: "Saffa", fee: 40 },
    { name_ar: "بيت عور", name_en: "Beit Ur", fee: 40 },
    { name_ar: "خربثا", name_en: "Kharbatha", fee: 40 },
    { name_ar: "المزرعة القبلية", name_en: "Al-Mazra'a Al-Qibliya", fee: 25 },
    { name_ar: "عطارة", name_en: "Atara", fee: 35 },
  ];

  const branches = [
    { name_ar: "الأرسال", name_en: "Al-Irsal", slug: "al-irsal", latitude: 31.9148, longitude: 35.2016, is_active: true, sort_order: 1, banner_image_path: "/images/alirsal.webp", delivery_zones: alIrsalZones },
    { name_ar: "الطيرة", name_en: "Al-Tira", slug: "al-tira", latitude: 31.9056, longitude: 35.1950, is_active: true, sort_order: 2, banner_image_path: "/images/altira.webp", delivery_zones: alTiraZones },
  ];
  await supabase.from("branches").upsert(branches, { onConflict: 'slug' });

  // 4. Addon Groups and Items
  console.log("Seeding Addon Groups...");

  // Burgers
  const burgerCatId = categoryMap["Burgers"];
  if (burgerCatId) {
    await supabase.from("addon_groups").delete().eq("category_id", burgerCatId);
    const burgerGroups = [
      { name_ar: "الأنواع", name_en: "Type", category_id: burgerCatId, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1, is_active: true },
      { name_ar: "➕ الإضافات", name_en: "Addons", category_id: burgerCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 2, is_active: true },
      { name_ar: "🚫 بدون", name_en: "Without", category_id: burgerCatId, group_type: "without", is_required: false, allow_multiple: true, sort_order: 3, is_active: true },
      { name_ar: "🥤 اختر المشروب (للوجبة فقط)", name_en: "Select Drink", category_id: burgerCatId, group_type: "MealDrink", is_required: true, allow_multiple: false, sort_order: 4, is_active: true },
      { name_ar: "🍟 تبديل البطاطا", name_en: "Swap Fries", category_id: burgerCatId, group_type: "MealFries", is_required: false, allow_multiple: false, sort_order: 5, is_active: true },
    ];
    const { data: bAgData } = await supabase.from("addon_groups").insert(burgerGroups).select();
    if (bAgData) {
      const bAgMap = Object.fromEntries(bAgData.map(g => [g.group_type, g.id]));
      const bItems = [
        { addon_group_id: bAgMap["types"], name_ar: "بيرجر فقط (ساندويش)", name_en: "Burger Only", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: bAgMap["types"], name_ar: "وجبة (مع بطاطا ومشروب)", name_en: "Meal (+ Fries & Drink)", price: 9, sort_order: 2, is_active: true },
        { addon_group_id: bAgMap["addons"], name_ar: "قطعة لحمة 120 غرام", name_en: "Extra Meat 120g", price: 12, sort_order: 1, is_active: true },
        { addon_group_id: bAgMap["addons"], name_ar: "جبنة إضافية", name_en: "Extra Cheese", price: 3, sort_order: 2, is_active: true },
        { addon_group_id: bAgMap["without"], name_ar: "مخلل", name_en: "No Pickles", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: bAgMap["without"], name_ar: "بندورة", name_en: "No Tomato", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: bAgMap["without"], name_ar: "بصل", name_en: "No Onions", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: bAgMap["without"], name_ar: "خس", name_en: "No Lettuce", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: bAgMap["MealDrink"], name_ar: "كولا", name_en: "Cola", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: bAgMap["MealFries"], name_ar: "ويدجز", name_en: "Wedges", price: 5, sort_order: 1, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(bItems, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // Sandwiches
  const sandwichCatId = categoryMap["Sandwiches"];
  if (sandwichCatId) {
    await supabase.from("addon_groups").delete().eq("category_id", sandwichCatId);
    const sandwichGroups = [
      { name_ar: "الأنواع", name_en: "Type", category_id: sandwichCatId, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1, is_active: true },
      { name_ar: "➕ الإضافات", name_en: "Addons", category_id: sandwichCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 2, is_active: true },
      { name_ar: "🚫 بدون", name_en: "Without", category_id: sandwichCatId, group_type: "without", is_required: false, allow_multiple: true, sort_order: 3, is_active: true },
      { name_ar: "🥤 اختر المشروب (للوجبة فقط)", name_en: "Select Drink", category_id: sandwichCatId, group_type: "MealDrink", is_required: true, allow_multiple: false, sort_order: 4, is_active: true },
      { name_ar: "🍟 تبديل البطاطا", name_en: "Swap Fries", category_id: sandwichCatId, group_type: "MealFries", is_required: false, allow_multiple: false, sort_order: 5, is_active: true },
    ];
    const { data: sAgData } = await supabase.from("addon_groups").insert(sandwichGroups).select();
    if (sAgData) {
      const sAgMap = Object.fromEntries(sAgData.map(g => [g.group_type, g.id]));
      const sItems = [
        { addon_group_id: sAgMap["types"], name_ar: "ساندويش فقط", name_en: "Sandwich Only", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: sAgMap["types"], name_ar: "وجبة (مع بطاطا ومشروب)", name_en: "Meal (+ Fries & Drink)", price: 9, sort_order: 2, is_active: true },
        { addon_group_id: sAgMap["addons"], name_ar: "جبنة إضافية", name_en: "Extra Cheese", price: 3, sort_order: 1, is_active: true },
        { addon_group_id: sAgMap["without"], name_ar: "مخلل", name_en: "No Pickles", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: sAgMap["without"], name_ar: "بندورة", name_en: "No Tomato", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: sAgMap["without"], name_ar: "بصل", name_en: "No Onions", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: sAgMap["without"], name_ar: "خس", name_en: "No Lettuce", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: sAgMap["MealDrink"], name_ar: "كولا", name_en: "Cola", price: 0, sort_order: 1, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(sItems, { onConflict: 'addon_group_id,name_en' });
    }
  }
  // Main Meals
  const mainMealsCatId = categoryMap["Main Meals"];
  if (mainMealsCatId) {
    const mainGroups = [
      { name_ar: "إضافات", name_en: "Addons", category_id: mainMealsCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 1, is_active: true },
    ];
    const { data: mAgData } = await supabase.from("addon_groups").upsert(mainGroups, { onConflict: 'name_en,category_id' }).select();
    if (mAgData) {
      const mItems = [
        { addon_group_id: mAgData[0].id, name_ar: "صحن أرز", name_en: "Rice Plate", price: 10, sort_order: 1, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(mItems, { onConflict: 'addon_group_id,name_en' });
    }

    const ribeye = prodData.find(p => p.name_en === "Ribeye Steak");
    const fillet = prodData.find(p => p.name_en === "Fillet Steak");
    if (ribeye || fillet) {
      const { data: doneness } = await supabase.from("addon_groups").upsert([{ 
        name_ar: "درجة الاستواء", name_en: "Doneness", category_id: mainMealsCatId, group_type: "Doneness", is_required: true, allow_multiple: false, sort_order: 2, is_active: true 
      }], { onConflict: 'name_en,category_id' }).select();
      if (doneness) {
        await supabase.from("addon_group_items").upsert([
          { addon_group_id: doneness[0].id, name_ar: "ميديوم", name_en: "Medium", price: 0, sort_order: 1, is_active: true },
          { addon_group_id: doneness[0].id, name_ar: "ميديوم ويل", name_en: "Medium Well", price: 0, sort_order: 2, is_active: true },
          { addon_group_id: doneness[0].id, name_ar: "ويل دون", name_en: "Well Done", price: 0, sort_order: 3, is_active: true },
        ], { onConflict: 'addon_group_id,name_en' });
      }
    }

    const chickenSteak = prodData.find(p => p.name_en === "Grilled Chicken Steak");
    if (chickenSteak) {
      const { data: sauceG } = await supabase.from("addon_groups").upsert([{ 
        name_ar: "النوع", name_en: "Sauce", category_id: mainMealsCatId, group_type: "sauce", is_required: true, allow_multiple: false, sort_order: 3, is_active: true 
      }], { onConflict: 'name_en,category_id' }).select();
      if (sauceG) {
        await supabase.from("addon_group_items").upsert([
          { addon_group_id: sauceG[0].id, name_ar: "مع ثوم و ليمون", name_en: "Garlic & Lemon", price: 0, sort_order: 1, is_active: true },
          { addon_group_id: sauceG[0].id, name_ar: "مع وايت صوص", name_en: "White Sauce", price: 0, sort_order: 2, is_active: true },
        ], { onConflict: 'addon_group_id,name_en' });
      }
    }
  }

  // Family Offers
  const familyCatId = categoryMap["Family Offers"];
  if (familyCatId) {
    const familyGroups = [
      { name_ar: "اختر نوع البرغر", name_en: "Choose Burger Types", category_id: familyCatId, group_type: "burgers", is_required: true, allow_multiple: true, sort_order: 1, is_active: true },
      { name_ar: "🥤 اختر المشروب العائلي", name_en: "Choose Large Drink", category_id: familyCatId, group_type: "drink", is_required: true, allow_multiple: false, sort_order: 2, is_active: true },
    ];
    const { data: fAgData } = await supabase.from("addon_groups").upsert(familyGroups, { onConflict: 'name_en,category_id' }).select();
    if (fAgData) {
      const fAgMap = Object.fromEntries(fAgData.map(g => [g.group_type, g.id]));
      const fItems = [
        { addon_group_id: fAgMap["burgers"], name_ar: "كلاسيك تشيز بيرجر", name_en: "Classic Cheese Burger", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: fAgMap["burgers"], name_ar: "باربيكيو بيرجر", name_en: "BBQ Burger", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: fAgMap["burgers"], name_ar: "دجاج كريسبي بيرجر", name_en: "Crispy Chicken Burger", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: fAgMap["drink"], name_ar: "مشروب تشات (كولا)", name_en: "Chaat Drink (Cola)", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: fAgMap["drink"], name_ar: "مشروب تشات (سبرايت)", name_en: "Chaat Drink (Sprite)", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: fAgMap["drink"], name_ar: "مشروب تشات (فانتا)", name_en: "Chaat Drink (Fanta)", price: 0, sort_order: 3, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(fItems, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // Pasta
  const pastaCatId = categoryMap["Pasta"];
  if (pastaCatId) {
    await supabase.from("addon_groups").delete().eq("category_id", pastaCatId);
    const pastaGroups = [
      { name_ar: "الأنواع", name_en: "Type", category_id: pastaCatId, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1, is_active: true },
      { name_ar: "➕ الإضافات", name_en: "Addons", category_id: pastaCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 2, is_active: true },
      { name_ar: "🔥 مستوى الحرارة", name_en: "Heat Level", category_id: pastaCatId, group_type: "heat", is_required: true, allow_multiple: false, sort_order: 3, is_active: true },
    ];
    const { data: pAgData } = await supabase.from("addon_groups").insert(pastaGroups).select();
    if (pAgData) {
      const pAgMap = Object.fromEntries(pAgData.map(g => [g.group_type, g.id]));
      const pItems = [
        { addon_group_id: pAgMap["types"], name_ar: "باستا (سادة)", name_en: "Pasta Only", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: pAgMap["addons"], name_ar: "إضافة دجاج", name_en: "Add Chicken", price: 8, sort_order: 1, is_active: true },
        { addon_group_id: pAgMap["addons"], name_ar: "جبنة إضافية", name_en: "Extra Cheese", price: 5, sort_order: 2, is_active: true },
        { addon_group_id: pAgMap["heat"], name_ar: "بدون فلفل", name_en: "No Heat", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: pAgMap["heat"], name_ar: "وسط", name_en: "Medium", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: pAgMap["heat"], name_ar: "حار جداً", name_en: "Extra Spicy", price: 0, sort_order: 3, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(pItems, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // Wings
  const wingsCatId = categoryMap["Wings"];
  if (wingsCatId) {
    const { data: sizeG } = await supabase.from("addon_groups").upsert([{ 
      name_ar: "الحجم", name_en: "Size", category_id: wingsCatId, group_type: "sizes", is_required: true, allow_multiple: false, sort_order: 1 
    }], { onConflict: 'name_en,category_id' }).select();
    if (sizeG) {
      await supabase.from("addon_group_items").upsert([
        { addon_group_id: sizeG[0].id, name_ar: "١٠ قطع", name_en: "10 Pieces", price: 13, sort_order: 1, is_active: true },
        { addon_group_id: sizeG[0].id, name_ar: "٢٠ قطعة", name_en: "20 Pieces", price: 25, sort_order: 2, is_active: true },
      ], { onConflict: 'addon_group_id,name_en' });
    }
  }

  // Appetizers
  const appCatId = categoryMap["Appetizers"];
  if (appCatId) {
    const { data: addG } = await supabase.from("addon_groups").upsert([{ 
      name_ar: "إضافات", name_en: "Addons", category_id: appCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 1 
    }], { onConflict: 'name_en,category_id' }).select();
    if (addG) {
       await supabase.from("addon_group_items").upsert([
        { addon_group_id: addG[0].id, name_ar: "أصابع موزاريلا إضافية", name_en: "Extra Mozzarella Sticks", price: 14, sort_order: 1, is_active: true },
      ], { onConflict: 'addon_group_id,name_en' });
    }
  }

  // Juice
  const juice = prodData.find(p => p.name_en === "Fresh Juice");
  if (juice) {
    const { data: jType } = await supabase.from("addon_groups").upsert([{ 
      name_ar: "النوع", name_en: "Type", category_id: categoryMap["Cold Drinks"], product_id: juice.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 
    }], { onConflict: 'name_en,product_id' }).select();
    if (jType) {
      await supabase.from("addon_group_items").upsert([
        { addon_group_id: jType[0].id, name_ar: "برتقال", name_en: "Orange", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: jType[0].id, name_ar: "ليمون", name_en: "Lemon", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: jType[0].id, name_ar: "ليمون و نعنع", name_en: "Lemon & Mint", price: 0, sort_order: 3, is_active: true },
      ], { onConflict: 'addon_group_id,name_en' });
    }
  }

  console.log("Seeding complete!");
}
