import { getSupabaseAdmin } from "./supabase";

export async function seedRestaurantData() {
  const supabase = getSupabaseAdmin();

  // 1. Categories based on real menu
  const categories = [
    { name_ar: "بيرجر", name_en: "Burgers", sort_order: 13, is_active: true, icon_class: "🍔" },
    { name_ar: "ساندويشات", name_en: "Sandwiches", sort_order: 1, is_active: true, icon_class: "🥪" },
    { name_ar: "وجبات رئيسية", name_en: "Main Meals", sort_order: 2, is_active: true, icon_class: "🍽️" },
    { name_ar: "أجنحة", name_en: "Wings", sort_order: 3, is_active: true, icon_class: "🍗" },
    { name_ar: "وجبات الأطفال", name_en: "Kids Meals", sort_order: 4, is_active: true, icon_class: "🧸" },
    { name_ar: "سلطات", name_en: "Salads", sort_order: 5, is_active: true, icon_class: "🥗" },
    { name_ar: "قهوة باردة", name_en: "Cold Coffee", sort_order: 6, is_active: true, icon_class: "🧊" },
    { name_ar: "سموذي طبيعي", name_en: "Natural Smoothie", sort_order: 7, is_active: true, icon_class: "🥤" },
    { name_ar: "ميلك شيك", name_en: "Milkshake", sort_order: 8, is_active: true, icon_class: "🥤" },
    { name_ar: "مشروبات ساخنة", name_en: "Hot Drinks", sort_order: 9, is_active: true, icon_class: "☕" },
    { name_ar: "حلويات", name_en: "Desserts", sort_order: 10, is_active: true, icon_class: "🍰" },
    { name_ar: "مشروبات باردة", name_en: "Cold Drinks", sort_order: 11, is_active: true, icon_class: "🥤" },
    { name_ar: "أراجيل", name_en: "Hookah", sort_order: 12, is_active: true, icon_class: "💨" },
    { name_ar: "مقبلات", name_en: "Appetizers", sort_order: 14, is_active: true, icon_class: "🍟" },
    { name_ar: "باستا", name_en: "Pasta", sort_order: 15, is_active: true, icon_class: "🍝" },
  ];

  const { data: catData, error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: 'name_en' })
    .select();

  if (catError) {
    console.error("Error seeding categories:", catError);
    return;
  }

  const categoryMap = Object.fromEntries(catData.map(c => [c.name_en, c.id]));

  // 2. Products
  const products = [
    // Sandwiches
    {
      name_ar: "ساندويش دجاج مقلي مقرمش (كريسبي)",
      name_en: "Crispy Chicken Sandwich",
      description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون",
      description_en: "150g crispy chicken, lettuce, tomato, onions, pickles, and Uptown sauce",
      base_price: 25, discount: 10,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "/images/crispy-fried-chicken-sandwich__nxer45s6cek81pp.jpg"
    },
    {
      name_ar: "ساندويش دجاج مشوي",
      name_en: "Grilled Chicken Sandwich",
      description_ar: "150 غرام . خس . بندورة . مخلل . بصل . صوص اب تاون",
      description_en: "150g grilled chicken, lettuce, tomato, pickles, onions, and Uptown sauce",
      base_price: 25, discount: 10,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "/images/grilled-chicken-sandwich__0p8n3eb1fxkz4e1.jpg"
    },
    {
      name_ar: "ساندويش دجاج إيطالي",
      name_en: "Italian Chicken Sandwich",
      description_ar: "150 غرام . دجاج مشوي . م صوص . خس . مخلل . بصل . صوص اب تاون",
      description_en: "150g grilled chicken, mushroom white sauce, lettuce, pickles, onions, and Uptown sauce",
      base_price: 25, discount: 10,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "/images/italian-chicken-sandwich__v8h8fvt2k4dudl7.jpg"
    },
    {
      name_ar: "ساندويش مسحب فاهيتا",
      name_en: "Fajita Chicken Sandwich",
      description_ar: "150 غرام . دجاج مشوي . فلفل حلو ملون . مشروم. بصل . بندورة . صوص مكسيكي",
      description_en: "150g grilled chicken, bell peppers, mushroom, onions, tomato, and Mexican sauce",
      base_price: 25, discount: 10,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "/images/fajita-chicken-sandwich__umcuqi5n4f72jbb.jpg"
    },
    {
      name_ar: "ساندويش أسايدو",
      name_en: "Asado Sandwich",
      description_ar: "لحم عجل مطهو لأكثر من 5 ساعات . خس . بندورة وبصل مشوي . مخلل . صوص",
      description_en: "Slow-cooked veal for over 5 hours, lettuce, grilled tomato and onions, pickles, and sauce",
      base_price: 36, discount: 0,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "/images/asado-sandwich__wo23euzc8pcflgm.jpg"
    },
    {
      name_ar: "ساندويش حلومي",
      name_en: "Halloumi Sandwich",
      description_ar: "150 غرام . جبنة حلومي . صوص رانش . خس . بصل . بندورة . مخلل",
      description_en: "150g halloumi cheese, ranch sauce, lettuce, onions, tomato, pickles",
      base_price: 25, discount: 10,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "/images/halloumi-sandwich__1vuq1k5kk4zhdtn.jpg"
    },

    // Main Meals
    {
      name_ar: "ستيك دجاج مشوي",
      name_en: "Grilled Chicken Steak",
      description_ar: "خضار سوتيه . ماشد بوتيتو",
      description_en: "Sautéed vegetables, mashed potatoes",
      base_price: 45, discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      has_doneness_option: false,
      image_path: "/images/grilled-chicken-steak__1i9bertljdazgo6.jpg"
    },
    {
      name_ar: "ريب أي ستيك",
      name_en: "Ribeye Steak",
      description_ar: "ستيك ريب أي . خضار سوتيه . ماشد بوتيتو . وايت صوص",
      description_en: "Ribeye steak, sautéed vegetables, mashed potatoes, and white sauce",
      base_price: 90, discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      has_doneness_option: true,
      image_path: "/images/ribeye-steak__ug7of6vwzmplsva.jpg"
    },
    {
      name_ar: "فيليه ستيك",
      name_en: "Fillet Steak",
      description_ar: "ستيك فيليه . خضار سوتيه . ماشد بوتيتو . وايت صوص",
      description_en: "Fillet steak, sautéed vegetables, mashed potatoes, and white sauce",
      base_price: 70, discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      has_doneness_option: true,
      image_path: "/images/beef-fillet-steak__1z530ggv6hnt6g0.webp"
    },
    {
      name_ar: "دجاج فاهيتا مع أرز",
      name_en: "Fajita Chicken with Rice",
      description_ar: "دجاج . فلفل حلو . بصل . مشروم. صوص مكسيكي",
      description_en: "Chicken, bell peppers, onions, mushroom, and Mexican sauce",
      base_price: 45, discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-fajita-with-rice__2re3bdsltsnwkzv.jpg"
    },
    {
      name_ar: "ستروجانوف دجاج مع أرز",
      name_en: "Chicken Stroganoff with Rice",
      description_ar: "دجاج . فلفل حلو . بصل . مشروم. وايت صوص",
      description_en: "Chicken, bell peppers, onions, mushroom, and white sauce",
      base_price: 45, discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-stroganoff-with-rice__nl0w7mlpkeq6dl9.jpg"
    },
    {
      name_ar: "ستروجانوف لحمة مع أرز",
      name_en: "Beef Stroganoff with Rice",
      description_ar: "شرائح فيليه ستيك . فلفل حلو . بصل . مشروم. وايت صوص",
      description_en: "Fillet steak strips, bell peppers, onions, mushroom, and white sauce",
      base_price: 60, discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/beef-stroganoff-with-rice__pyr14b4rim9cnsg.jpg"
    },
    {
      name_ar: "فوتوتشيني مع دجاج",
      name_en: "Fettuccine with Chicken",
      description_ar: "دجاج مشوي . فوتوتشيني . مشروم. وايت صوص . جبنة بارميزان",
      description_en: "Grilled chicken, fettuccine, mushroom, white sauce, and parmesan cheese",
      base_price: 45,
      discount: 10,
      category_id: categoryMap["Main Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg"
    },

    // Pasta
    {
      name_ar: "سباجيتي ريد صوص",
      name_en: "Spaghetti Red Sauce",
      description_ar: "سباجيتي مع صلصة الطماطم الحمراء",
      description_en: "Spaghetti with red tomato sauce",
      base_price: 30,
      discount: 10,
      category_id: categoryMap["Pasta"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg"
    },
    {
      name_ar: "بينا أرابيتا",
      name_en: "Penne Arrabbiata",
      description_ar: "باستا بينا بصلصة حارة",
      description_en: "Penne pasta with spicy sauce",
      base_price: 30,
      discount: 10,
      category_id: categoryMap["Pasta"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg"
    },
    {
      name_ar: "سباجيتي وايت صوص",
      name_en: "Spaghetti White Sauce",
      description_ar: "سباجيتي مع الصلصة البيضاء الكريمية",
      description_en: "Spaghetti with creamy white sauce",
      base_price: 30,
      discount: 10,
      category_id: categoryMap["Pasta"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg"
    },

    // Wings
    {
      name_ar: "أجنحة مقلية مقرمشة",
      name_en: "Crispy Fried Wings",
      description_ar: "أجنحة دجاج مقلية مقرمشة",
      description_en: "Crispy fried chicken wings",
      base_price: 30, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/crispy-fried-wings__8a79zxxqhvr0ihm.jpg"
    },
    {
      name_ar: "أجنحة بصوص البافلو",
      name_en: "Buffalo Wings",
      description_ar: "أجنحة بصوص البافلو الحار",
      description_en: "Spicy buffalo wings",
      base_price: 28, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/buffalo-sauce-wings__hvhrz3c6wkwi56v.jpg"
    },
    {
      name_ar: "أجنحة بصوص الباربيكيو",
      name_en: "BBQ Wings",
      description_ar: "أجنحة بصوص الباربيكيو المدخن",
      description_en: "Smoked BBQ wings",
      base_price: 28, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/bbq-sauce-wings__ut71ovptawjn1ai.jpg"
    },
    {
      name_ar: "أجنحة بصوص التيراكي",
      name_en: "Teriyaki Wings",
      description_ar: "أجنحة بصوص التيراكي",
      description_en: "Teriyaki wings",
      base_price: 28, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/teriyaki-sauce-wings__lle6d5attaszh53.jpg"
    },
    {
      name_ar: "أجنحة بصوص وثوم وليمون وبارميزان",
      name_en: "Lemon Parmesan Wings",
      description_ar: "أجنحة بصوص والثوم والليمون وجبنة البارميزان",
      description_en: "Garlic, lemon and parmesan wings",
      base_price: 28, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/garlic-lemon-parmesan-wings__pu0bcxvhvsozf63.jpg"
    },
    {
      name_ar: "أجنحة بصوص الثومة والليمون",
      name_en: "Garlic Lemon Wings",
      description_ar: "أجنحة بصوص الثومة والليمون",
      description_en: "Garlic and lemon wings",
      base_price: 28, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/garlic-lemon-wings__871mbhqqt1p5bk7.jpg"
    },
    {
      name_ar: "أجنحة بصوص السويت شيلي",
      name_en: "Sweet Chili Wings",
      description_ar: "أجنحة بصوص السويت شيلي",
      description_en: "Sweet chili wings",
      base_price: 28, discount: 10,
      category_id: categoryMap["Wings"],
      is_active: true,
      all_branches: true,
      image_path: "/images/sweet-chili-wings__kdipx15msj2668u.jpg"
    },

    // Kids Meals
    {
      name_ar: "كيدز بيرجر لحمة",
      name_en: "Kids Beef Burger",
      description_ar: "الوجبة تشمل بطاطا مقلية وعصير",
      description_en: "Meal includes french fries and juice",
      base_price: 23, discount: 10,
      category_id: categoryMap["Kids Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/kids-beef-burger__vhek3ygzet469f2.jpg"
    },
    {
      name_ar: "كيدز بيرجر دجاج",
      name_en: "Kids Chicken Burger",
      description_ar: "الوجبة تشمل بطاطا مقلية وعصير",
      description_en: "Meal includes french fries and juice",
      base_price: 23, discount: 10,
      category_id: categoryMap["Kids Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/file-4d47862d-9ad6-4c84-bb82-b70d9f7ce255.webp"
    },
    {
      name_ar: "بوب كورن دجاج",
      name_en: "Chicken Popcorn",
      description_ar: "الوجبة تشمل بطاطا مقلية وعصير",
      description_en: "Meal includes french fries and juice",
      base_price: 23, discount: 10,
      category_id: categoryMap["Kids Meals"],
      is_active: true,
      all_branches: true,
      image_path: "/images/chicken-popcorn__8ql6ou2bhl45zed.jpg"
    },

    // Salads
    {
      name_ar: "سلطة سيزر",
      name_en: "Caesar Salad",
      description_ar: "خس . جبنة بارميزان . خبز محمص . صوص سيزر",
      description_en: "Lettuce, parmesan cheese, croutons, and Caesar dressing",
      base_price: 25, discount: 10,
      category_id: categoryMap["Salads"],
      is_active: true,
      all_branches: true,
      image_path: "/images/caesar-salad-kgn4gpstowx0mu9-c9d70a64-0049-4b14-974b-dc68ac07791c.jpg"
    },
    {
      name_ar: "سلطة يونانية",
      name_en: "Greek Salad",
      description_ar: "خس . فلفل ملون . خيار . زيتون أسود . بندورة . ليمون . زيت زيتون . جبنة فيتا",
      description_en: "Lettuce, bell peppers, cucumber, olives, tomato, lemon, olive oil, and feta cheese",
      base_price: 30, discount: 10,
      category_id: categoryMap["Salads"],
      is_active: true,
      all_branches: true,
      image_path: "/images/greek-salad__3ogmuh9isdbt41n.jpg"
    },
    {
      name_ar: "سلطة جرجير",
      name_en: "Arugula Salad",
      description_ar: "جرجير . بندورة شيري . بصل أحمر . ليمون . زيت زيتون . سماق",
      description_en: "Arugula, cherry tomatoes, red onion, lemon, olive oil, and sumac",
      base_price: 25, discount: 10,
      category_id: categoryMap["Salads"],
      is_active: true,
      all_branches: true,
      image_path: "/images/arugula-salad__pqxln7lhzdde5ww.jpg"
    },
    {
      name_ar: "سلطة حلومي",
      name_en: "Halloumi Salad",
      description_ar: "خس . بندورة شيري . جبنة حلومي . صوص رانش",
      description_en: "Lettuce, cherry tomatoes, halloumi cheese, and ranch dressing",
      base_price: 35, discount: 10,
      category_id: categoryMap["Salads"],
      is_active: true,
      all_branches: true,
      image_path: "/images/halloumi-salad__4yk717hcdec5vqt.jpg"
    },
    {
      name_ar: "سلطة كينوا",
      name_en: "Quinoa Salad",
      description_ar: "كينوا . بقدونس . عسل . دبس رمان . زيت زيتون . ليمون . كرانبري . جوز . أناناس",
      description_en: "Quinoa, parsley, honey, pomegranate molasses, olive oil, lemon, cranberry, walnut, and pineapple",
      base_price: 30, discount: 10,
      category_id: categoryMap["Salads"],
      is_active: true,
      all_branches: true,
      image_path: "/images/quinoa-salad__qr0exktqt76ov8j.jpg"
    },
    {
      name_ar: "سلطة فتوش",
      name_en: "Fattoush Salad",
      description_ar: "خس ناعم . بندورة . خيار . فلفل . بصل أبيض . نعنع . خبز محمص . سماق . ملح . دبس رمان",
      description_en: "Lettuce, tomato, cucumber, pepper, white onion, mint, fried bread, sumac, salt, and pomegranate molasses",
      base_price: 30, discount: 10,
      category_id: categoryMap["Salads"],
      is_active: true,
      all_branches: true,
      image_path: "/images/fattoush-salad__oxjgflscdmor62d.jpg"
    },

    // Cold Coffee
    { name_ar: "سبانش لاتيه", name_en: "Spanish Latte", description_ar: "بريك قهوة بارد ومنعش", description_en: "Refreshing cold coffee break", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/spanish-latte__0j9ew7pi59r1fb6.jpg" },
    { name_ar: "آيس كابتشينو", name_en: "Ice Cappuccino", description_ar: "كابتشينو مثلج مع رغوة كثيفة", description_en: "Iced cappuccino with thick foam", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-cappuccino__nh76n3rx78rmkfm.jpg" },
    { name_ar: "آيس لاتيه", name_en: "Ice Latte", description_ar: "لاتيه كلاسيكي مثلج", description_en: "Classic iced latte", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-latte__igw1jlq8obg8clj.jpg" },
    { name_ar: "آيس كوفي", name_en: "Ice Coffee", description_ar: "قهوة مثلجة منعشة", description_en: "Refreshing iced coffee", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-coffee__x9fwu0nnonmt1bf.jpg" },
    { name_ar: "آيس كارميل لاتيه", name_en: "Ice Caramel Latte", description_ar: "لاتيه مثلج مع صوص الكارميل", description_en: "Iced latte with caramel sauce", base_price: 19, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-caramel-latte__7s8czuyblnkgk6r.jpg" },
    { name_ar: "آيس أمريكانو", name_en: "Ice Americano", description_ar: "أمريكانو كلاسيكي مثلج", description_en: "Classic iced americano", base_price: 16, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-americano__2ignz0x5yz4sxhu.jpg" },
    { name_ar: "فرابتشينو", name_en: "Frappuccino", description_ar: "مشروب فرابتشينو الغني", description_en: "Rich frappuccino drink", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/frappuccino__11jotuwxtm2czjo.jpg" },
    { name_ar: "آيس موكا", name_en: "Ice Mocha", description_ar: "موكا مثلجة بلمسة شوكولاتة", description_en: "Iced mocha with a chocolate touch", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-mocha__shnp5dn9oggwun7.jpg" },
    { name_ar: "آيس وايت موكا", name_en: "Ice White Mocha", description_ar: "وايت موكا مثلجة", description_en: "Iced white mocha", base_price: 17, discount: 10, category_id: categoryMap["Cold Coffee"], is_active: true, all_branches: true, image_path: "/images/iced-white-mocha__rcg0h9ji0z1trnx.jpg" },

    // Natural Smoothie
    { name_ar: "سموذي طبيعي", name_en: "Natural Smoothie", description_ar: "تشكيلة سموذي فواكه طبيعية", description_en: "Assorted natural fruit smoothies", base_price: 17, discount: 10, category_id: categoryMap["Natural Smoothie"], is_active: true, all_branches: true, image_path: "/images/natural-smoothie__c9pnbwbvwhncuvs.jpg" },

    // Milkshake
    { name_ar: "ميلك شيك", name_en: "Milkshake", description_ar: "ميلك شيك غني بعدة نكهات", description_en: "Rich milkshakes in various flavors", base_price: 17, discount: 10, category_id: categoryMap["Milkshake"], is_active: true, all_branches: true, image_path: "/images/milkshakes__pgt1ljcxf6qma9t.jpg" },

    // Hot Drinks
    { name_ar: "شاي", name_en: "Tea", description_ar: "شاي كلاسيكي ساخن", description_en: "Classic hot tea", base_price: 8, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/tea__68ipsqrolope9un.jpg" },
    { name_ar: "اسبريسو", name_en: "Espresso", description_ar: "اسبريسو كلاسيكي", description_en: "Classic espresso", base_price: 8, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/espresso__e6jr0mu46qix1iw.jpg" },
    { name_ar: "قهوة عربية", name_en: "Arabic Coffee", description_ar: "قهوة عربية أصيلة", description_en: "Authentic Arabic coffee", base_price: 13, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/arabic-coffee__nrx56q4y8ik0dt1.jpg" },
    { name_ar: "أمريكانو", name_en: "Americano", description_ar: "قهوة أمريكانو ساخنة", description_en: "Hot Americano coffee", base_price: 13, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/americano__ikrmozgl4db883m.jpg" },
    { name_ar: "موكا", name_en: "Mocha", description_ar: "مزيج ساخن من القهوة والكاكاو", description_en: "Hot mix of coffee and cocoa", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/mocha__nruytezewx8c3t4.jpg" },
    { name_ar: "وايت موكا", name_en: "White Mocha", description_ar: "موكا ساخنة بالشوكولاتة البيضاء", description_en: "Hot white chocolate mocha", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/white-mocha__6ch77h9v3dnxy1k.jpg" },
    { name_ar: "كابتشينو", name_en: "Cappuccino", description_ar: "كابتشينو كلاسيكي ساخن", description_en: "Classic hot cappuccino", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/cappuccino__jzn3vtp7cja8809.webp" },
    { name_ar: "لاتيه", name_en: "Latte", description_ar: "لاتيه كلاسيكي ساخن", description_en: "Classic hot latte", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/latte__kgf531y5zc8pm74.jpg" },
    { name_ar: "شاي لاتيه", name_en: "Tea Latte", description_ar: "شاي بلمسة من الحليب", description_en: "Tea with a milky touch", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/tea-latte__lciq1bb4qgw7zfi.jpg" },
    { name_ar: "بندق", name_en: "Hazelnut Drink", description_ar: "مزيج ساخن بنكهة البندق", description_en: "Hot mix with hazelnut flavor", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/hazelnut__ru44q1bkipzkn48.jpg" },
    { name_ar: "هوت تشوكليت", name_en: "Hot Chocolate", description_ar: "شوكولاتة ساخنة غنية", description_en: "Rich hot chocolate", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/hot-chocolate__v09sja0o7rcic8x.jpg" },
    { name_ar: "إيطاليان تشوكليت", name_en: "Italian Chocolate", description_ar: "شوكولاتة إيطالية ساخنة كثيفة", description_en: "Thick Italian hot chocolate", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/italian-chocolate__x4nkeo37cxq9lab.jpg" },
    { name_ar: "مكس أعشاب", name_en: "Herbal Mix", description_ar: "مزيج أعشاب برية ساخنة", description_en: "Hot wild herbal mix", base_price: 10, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/herbal-mix__7hokmq4lw78tzn6.jpg" },
    { name_ar: "سبانش لاتيه", name_en: "Hot Spanish Latte", description_ar: "سبانش لاتيه ساخن", description_en: "Hot Spanish latte", base_price: 16, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/spanish-latte__8tnujlrujxfzigl.jpg" },
    { name_ar: "نسكافيه", name_en: "Nescafe", description_ar: "نسكافيه كلاسيكي ساخن", description_en: "Classic hot Nescafe", base_price: 13, discount: 10, category_id: categoryMap["Hot Drinks"], is_active: true, all_branches: true, image_path: "/images/nescafe__quyge4un0omih97.webp" },

    // Desserts
    { name_ar: "وافل مع آيس كريم", name_en: "Waffle with Ice Cream", description_ar: "وافل ساخن يقدم مع الآيس كريم", description_en: "Hot waffle served with ice cream", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/waffle-with-ice-cream__x29z7g0cy8sbot9.jpg" },
    { name_ar: "كريب مع شوكولاتة", name_en: "Crepe with Chocolate", description_ar: "كريب محشو بالشوكولاتة", description_en: "Crepe filled with chocolate", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/crepe-with-chocolate__6lfwdup297e7hd5.webp" },
    { name_ar: "سوفليه مع بوظة", name_en: "Souffle with Ice Cream", description_ar: "سوفليه شوكولاتة ساخن مع الآيس كريم", description_en: "Hot chocolate souffle with ice cream", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/souffle-with-ice-cream__o375y0v76qe0ehb.jpg" },
    { name_ar: "آيس كريم", name_en: "Ice Cream", description_ar: "3 سكوپ من نكهاتك المفضلة", description_en: "3 scoops of your favorite flavors", base_price: 15, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/ice-cream__ve92ex3v6cb5ol6.jpg" },
    { name_ar: "سان سباستيان تشيز كيك", name_en: "San Sebastian Cheesecake", description_ar: "تشيز كيك سان سباستيان الكريمي", description_en: "Creamy San Sebastian cheesecake", base_price: 30, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/san-sebastian-cheesecake__crjozhzu3bx2i1k.jpg" },
    { name_ar: "بلوبيري تشيز كيك", name_en: "Blueberry Cheesecake", description_ar: "تشيز كيك بلمسة بلوبيري", description_en: "Cheesecake with a blueberry touch", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/blueberry-cheesecake__163xoiwy7wlrfjb.jpg" },
    { name_ar: "لوتس تشيز كيك", name_en: "Lotus Cheesecake", description_ar: "تشيز كيك بطبقة اللوتس", description_en: "Cheesecake with a lotus layer", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/lotus-cheesecake__dy0dgdb9jiizmu3.jpg" },
    { name_ar: "تيراميسو", name_en: "Tiramisu", description_ar: "حلى التيراميسو الإيطالي", description_en: "Italian Tiramisu dessert", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/tiramisu__sxnp971n4vv4o5k.jpg" },
    { name_ar: "تشوكليت كيك", name_en: "Chocolate Cake", description_ar: "كيك شوكولاتة غني", description_en: "Rich chocolate cake", base_price: 22, discount: 10, category_id: categoryMap["Desserts"], is_active: true, all_branches: true, image_path: "/images/chocolate-cake__xb561uywo403igv.jpg" },

    // Cold Drinks
    { name_ar: "كولا", name_en: "Cola", description_ar: "علبة كولا", description_en: "Cola Can", base_price: 6, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/cola__f6o1p5tywou44t7.jpg" },
    { name_ar: "كولا زيرو", name_en: "Cola Zero", description_ar: "علبة كولا زيرو", description_en: "Cola Zero Can", base_price: 6, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/cola__f6o1p5tywou44t7.jpg" },
    { name_ar: "سبرايت دايت", name_en: "Sprite Diet", description_ar: "علبة سبرايت دايت", description_en: "Sprite Diet Can", base_price: 6, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/sprite__i4s36gw3g0d9m6i.jpg" },
    { name_ar: "كابي", name_en: "Cappy Juice", description_ar: "عصير كابي", description_en: "Cappy Juice bottle", base_price: 6, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/file-e09e95f3-e7b0-4c7e-8fc2-a0afa1d97e09.jpg" },
    { name_ar: "سبرايت", name_en: "Sprite", description_ar: "علبة سبرايت", description_en: "Sprite Can", base_price: 6, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/sprite__i4s36gw3g0d9m6i.jpg" },
    { name_ar: "فانتا", name_en: "Fanta", description_ar: "علبة فانتا", description_en: "Fanta Can", base_price: 6, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/fanta__qb9s0izcqjn38fr.jpg" },
    { name_ar: "ماء صغير", name_en: "Small Water", description_ar: "زجاجة مياه صغيرة", description_en: "Small water bottle", base_price: 5, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/small-water__retkduxc2891b17.jpg" },
    { name_ar: "بفاريا", name_en: "Bavaria", description_ar: "شراب بفاريا بر باردة", description_en: "Cold Bavaria drink", base_price: 8, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/bavaria__g0tdpqe9yr51l45.jpg" },
    { name_ar: "صودا", name_en: "Soda", description_ar: "ماء صودا", description_en: "Soda water", base_price: 8, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/soda__28xcya6e1tmloih.jpg" },
    { name_ar: "XL", name_en: "XL Energy Drink", description_ar: "مشروب طاقة XL", description_en: "XL Energy Drink", base_price: 8, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/xl__l07thqasq1gfrd8.jpg" },
    { name_ar: "آيس فانيلا", name_en: "Ice Vanilla", description_ar: "شراب منعش بنكهة الفانيلا", description_en: "Refreshing ice vanilla drink", base_price: 17, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/iced-vanilla__cf85firw7etrfpb.jpg" },
    { name_ar: "آيس تي", name_en: "Ice Tea", description_ar: "شاي مثلج منعش", description_en: "Refreshing iced tea", base_price: 17, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/iced-tea__7xvf02dww34t6g9.jpg" },
    { name_ar: "آيس تشوكليت", name_en: "Ice Chocolate", description_ar: "شوكولاتة مثلجة غنية", description_en: "Rich iced chocolate", base_price: 17, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/iced-chocolate__n5gge2vfh6dvahl.jpg" },
    { name_ar: "موميتو", name_en: "Mojito", description_ar: "موهيتو منعش للموميتو", description_en: "Refreshing mojito drink", base_price: 17, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/mojito__dnldrs18pec0our.jpg" },
    { name_ar: "عصير", name_en: "Juice", description_ar: "عصير فواكه طازج", description_en: "Fresh fruit juice", base_price: 16, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/juice__xe7kdad5ruvmdwq.jpg" },
    { name_ar: "كوكتيل مع بوظة", name_en: "Cocktail with Ice Cream", description_ar: "كوكتيل فواكه مع الآيس كريم", description_en: "Fruit cocktail with ice cream", base_price: 22, discount: 10, category_id: categoryMap["Cold Drinks"], is_active: true, all_branches: true, image_path: "/images/cocktail-with-ice-cream__8drtk81n7t43qxa.jpg" },

    // Hookah
    { name_ar: "أرجيلة", name_en: "Hookah", description_ar: "أرجيلة بنكهات متنوعة", description_en: "Hookah with various flavors", base_price: 30, discount: 10, category_id: categoryMap["Hookah"], is_active: true, all_branches: true, image_path: "/images/shisha__3rtwtm1vhjem729.jpg" },

    // Burgers
    // Burgers
    { name_ar: "كلاسيك تشيز بيرجر", name_en: "Classic Cheese Burger", description_ar: "120 غرام . جبنة تشيدر . خس . بندورة . بصل . صوص اب تاون", description_en: "120g, cheddar, lettuce, tomato, onions, uptown sauce", base_price: 25, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/classic-cheeseburger__0x1e3y1qv68eiip.jpg" },
    { name_ar: "سماش بيرجر", name_en: "Smash Burger", description_ar: "240 غرام . جبنة تشيدر . بندورة . بصل . صوص اب تاون", description_en: "240g, double cheddar, tomato, onions, uptown sauce", base_price: 35, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/smashed-burger__f4vm70uiqpdg28s.jpg" },
    { name_ar: "باربيكيو بيرجر", name_en: "BBQ Burger", description_ar: "150 غرام . خس . جبنة موزاريلا . مخلل . بصل . باربيكيو . صوص اب تاون", description_en: "150g, mozzarella, pickles, onions, bbq sauce, uptown sauce", base_price: 25, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/bbq-burger__qw0nxdtpwc5rbst.jpg" },
    { name_ar: "سويس مشروم بيرجر", name_en: "Swiss Mushroom Burger", description_ar: "150 غرام . جبنة سويسرية . خس . بندورة . بصل . مشروم. مخلل . صوص اب تاون", description_en: "150g, swiss cheese, lettuce, tomato, mushroom, onions, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/swiss-mushroom-burger__txtxxp1aifr4j8i.jpg" },
    { name_ar: "مشروم بيرجر", name_en: "Mushroom Burger", description_ar: "150 غرام . مشروم. خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g, mushroom, lettuce, tomato, pickles, onions, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/mushroom-burger__s07zohznm42itsy.jpg" },
    { name_ar: "مشروم وايت صوص بيرجر", name_en: "Mushroom White Sauce Burger", description_ar: "150 غرام . مشروم. وايت صوص . خس . بندورة . بصل . اب تاون صوص", description_en: "150g, mushroom, white sauce, lettuce, tomato, onions, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/mushroom-white-sauce-burger__4w37ua1o61radfn.jpg" },
    { name_ar: "مكسيكانو بيرجر", name_en: "Mexicano Burger", description_ar: "150 غرام . خس . جبنة تشيدر . بندورة . بصل . هالبينو . صوص مكسيكي", description_en: "150g, cheddar, tomato, onions, jalapeno, mexican sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/mexicano-burger__l76kbi9btmcrvey.jpg" },
    { name_ar: "أسايدو بيرجر", name_en: "Asado Burger", description_ar: "150 غرام . قطع لحم بقري فاخر مطهو لأكثر من 5 ساعات . خس . بندورة . بصل مشوي", description_en: "150g slow-cooked beef bits, lettuce, tomato, grilled onions", base_price: 36, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/asado-burger__2m81wutgpbyhv9z.jpg" },
    { name_ar: "ريب أي بيرجر", name_en: "Ribeye Burger", description_ar: "150 غرام . قطعة كلاسيك . شرائح ستيك ريب أي 60 غرام . خس . بندورة . بصل . جبنة", description_en: "150g patty + ribeye strips, lettuce, tomato, onions, cheese", base_price: 45, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/ribeye-burger__8w4my5hb4xqt6zg.jpg" },
    { name_ar: "أرابيكا بيرجر", name_en: "Arabica Burger", description_ar: "150 غرام . مكس من لحم الخاروف والعجل . خس . بندورة . بصل . مخلل . صوص", description_en: "150g lamb/veal mix, lettuce, tomato, onions, pickles, sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/arabica-burger__18bxeuobojgdvh9.jpg" },
    { name_ar: "بلو تشيز بيرجر", name_en: "Blue Cheese Burger", description_ar: "150 غرام . بلو تشيز . عسل . مكسرات . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g, blue cheese, honey, nuts, lettuce, tomato, onions, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/blue-cheese-burger__n6kolhf4bmk2o6c.jpg" },
    { name_ar: "فرايد ايغ بيرجر", name_en: "Fried Egg Burger", description_ar: "150 غرام . بيض مقلي . جبنة تشيدر . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g, fried egg, cheddar, lettuce, tomato, onions, pickles, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/fried-egg-burger__40j1tpwdob2wmoy.jpg" },
    { name_ar: "ستيك بيرجر", name_en: "Steak Burger", description_ar: "150 غرام . قطعة كلاسيك . شرائح ستيك فيليه 60 غرام . خس . بندورة . بصل . مخلل", description_en: "150g patty + fillet strips, lettuce, tomato, onions, pickles", base_price: 36, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/steak-burger__e825653zpga0dw0.jpg" },
    { name_ar: "دجاج كريسبي بيرجر", name_en: "Crispy Chicken Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g crispy chicken, lettuce, tomato, pickles, uptown sauce", base_price: 25, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/crispy-chicken-burger__49g1si6flsxx82w.jpg" },
    { name_ar: "دجاج مشوي بيرجر", name_en: "Grilled Chicken Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", description_en: "150g grilled chicken, lettuce, tomato, pickles, uptown sauce", base_price: 25, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/grilled-chicken-burger__bm22lgyfrl1ixtx.jpg" },
    { name_ar: "نباتي بيرجر", name_en: "Vegetarian Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون . صوص رانش . جبنة حلومي", description_en: "150g vegetable patty, lettuce, tomato, onions, pickles, halloumi cheese", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/vegetarian-burger__h0no3tubpyaxbs0.jpg" },
    { name_ar: "بصل مكرمل بيرجر", name_en: "Caramelized Onion Burger", description_ar: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون . بصل مكرمل", description_en: "150g, lettuce, tomato, onions, pickles, caramelized onion, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/caramelized-onion-burger__rpouw9135aroh54.jpg" },
    { name_ar: "هاواين بيرجر", name_en: "Hawaiian Burger", description_ar: "150 غرام . خس . بندورة . قطعتين أناناس . مخلل . صوص اب تاون", description_en: "150g, lettuce, tomato, pineapple rings (2), pickles, uptown sauce", base_price: 30, discount: 10, category_id: categoryMap["Burgers"], is_active: true, all_branches: true, has_meal_option: true, image_path: "/images/hawaiian-burger__ev2mcri9z6vgqev.jpg" },

    // Appetizers
    { name_ar: "أصابع موزاريلا", name_en: "Mozzarella Sticks", description_ar: "أصابع جبنة موزاريلا مقلية", description_en: "Deep fried mozzarella cheese sticks", base_price: 4, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/mozzarella-sticks-3-pcs__ilg2wr1vbnhdqns.jpg" },
    { name_ar: "أصابع موزاريلا 3 قطع", name_en: "Mozzarella Sticks 3pcs", description_ar: "3 قطع أصابع موزاريلا مقلية مقرمشة", description_en: "3 pieces of crispy fried mozzarella sticks", base_price: 12, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/mozzarella-sticks-3-pcs__ilg2wr1vbnhdqns.jpg" },
    { name_ar: "بوب كورن دجاج", name_en: "Chicken Popcorn (250g)", description_ar: "250 غرام من قطع الدجاج الصغيرة المقرمشة", description_en: "250g of small crispy chicken pieces", base_price: 22, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/popcorn-chicken__19q2tjl7h9lr4st.jpg" },
    { name_ar: "أصابع دجاج 5 قطع", name_en: "Chicken Fingers 5pcs", description_ar: "5 قطع من أصابع الدجاج المقلية", description_en: "5 pieces of fried chicken finger sticks", base_price: 22, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/chicken-fingers-5-pcs__1sqwat9myfpnpzw.jpg" },
    { name_ar: "تشيكن اند فرايز", name_en: "Chicken and Fries", description_ar: "قطع دجاج مقلية مع بطاطا", description_en: "Fried chicken pieces with french fries", base_price: 30, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/chicken-popcorn__8ql6ou2bhl45zed.jpg" },
    { name_ar: "حلقات بصل 8 قطع", name_en: "Onion Rings 8pcs", description_ar: "8 قطع من حلقات البصل الذهبية", description_en: "8 pieces of golden onion rings", base_price: 10, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/onion-rings-8-pcs__6yyl6nhstlciej0.jpg" },
    { name_ar: "بطاطا مقلية", name_en: "French Fries Appetizer", description_ar: "بطاطا مقلية كلاسيكية", description_en: "Classic crispy french fries", base_price: 7, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/french-fries__15besvty49y4dw2.jpg" },
    { name_ar: "علبة جبنة", name_en: "Cheese Cup Appetizer", description_ar: "علبة صوص الجبنة الغنية", description_en: "Rich cheese sauce cup", base_price: 5, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/cheese-box__h2jnlaey0uea720.jpg" },
    { name_ar: "بطاطا", name_en: "Specialty Potato Appetizer", description_ar: "بطاطا اب تاون الخاصة", description_en: "Special Uptown style potatoes", base_price: 12, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/img-2398-a9a9219e-ca4c-43ed-8365-127be873e542.jpeg" },
    { name_ar: "فرينش فانيلا", name_en: "French Vanilla Specialty", description_ar: "مشروب بنكهة الفانيلا الفرنسية", description_en: "French vanilla flavored drink", base_price: 15, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/french-vanilla__u8v2md0zal4nvo9.jpg" },
    { name_ar: "فيليه تشيز ستيك", name_en: "Philly Cheese Steak Specialty", description_ar: "180 غرام . لحم عجل فيليه مشوي . جبنة تشيدر . جبنة موزاريلا . صوص رانش . فلفل", description_en: "180g veal fillet, cheddar, mozzarella, ranch, peppers", base_price: 36, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/philly-cheesesteak-sandwich__zse9y6u7vbvhagu.jpg" },
    { name_ar: "تورتيلا دجاج مقلي مقرمش", name_en: "Crispy Chicken Tortilla Specialty", description_ar: "140 غرام . كريسبي راب او مشوي . خس . مخلل . بصل . صوص مكسيكي . صوص اب تاون", description_en: "140g crispy/grilled chicken, lettuce, pickles, onions, mexican sauce", base_price: 18, discount: 10, category_id: categoryMap["Appetizers"], is_active: true, all_branches: true, image_path: "/images/crispy-chicken-tortilla-wrap__uij6r0qhdp8qpni.jpg" },
  ];

  const { data: prodData, error: prodError } = await supabase
    .from("products")
    .upsert(products, { onConflict: 'name_en' })
    .select();

  if (prodError) {
    console.error("Error seeding products:", prodError);
  }

  // 3. Branches
  console.log("Deleting 'ramallah' branch if exists...");
  await supabase.from("branches").delete().eq("slug", "ramallah");

  const universalDeliveryZones = [
    { name_ar: "عين منجد", name_en: "Ein Munjed", fee: 18 },
    { name_ar: "الماصيون", name_en: "Al-Masyoun", fee: 16 },
    { name_ar: "رام الله التحتا", name_en: "Ramallah Al-Tahta", fee: 14 },
    { name_ar: "ام الشرايط", name_en: "Um Al-Sharayet", fee: 18 },
    { name_ar: "كفر عقب", name_en: "Kufr Aqab", fee: 27 },
    { name_ar: "سميراميس", name_en: "Semiramis", fee: 22 },
    { name_ar: "مخيم قلنديا", name_en: "Qalandia Camp", fee: 30 },
    { name_ar: "الرام", name_en: "Al-Ram", fee: 40 },
    { name_ar: "الطيرة", name_en: "Al-Tira", fee: 15 },
    { name_ar: "بطن الهوى", name_en: "Batn Al-Hawa", fee: 16 },
    { name_ar: "بيتونيا", name_en: "Beitunia", fee: 25 },
    { name_ar: "عين مصباح", name_en: "Ein Misbah", fee: 13 },
    { name_ar: "الارسال", name_en: "Al-Irsal", fee: 10 },
    { name_ar: "سطح مرحبا", name_en: "Satahi Marahaba", fee: 18 },
    { name_ar: "شارع القدس", name_en: "Jerusalem St.", fee: 15 },
    { name_ar: "الامعري", name_en: "Al-Amari", fee: 15 },
    { name_ar: "الشرفة", name_en: "Al-Shurfa", fee: 15 },
    { name_ar: "وسط البلد", name_en: "City Center", fee: 12 },
    { name_ar: "البالوع", name_en: "Al-Balou'", fee: 10 },
    { name_ar: "المصايف", name_en: "Al-Masayef", fee: 10 },
    { name_ar: "شارع نابلس", name_en: "Nablus St.", fee: 10 },
    { name_ar: "جبل الطويل - البيرة", name_en: "Jebel Al-Taweel - Al-Bireh", fee: 12 },
    { name_ar: "سردا", name_en: "Surda", fee: 16 },
    { name_ar: "ابو قش", name_en: "Abu Qash", fee: 25 },
    { name_ar: "الريحان", name_en: "Al-Rehan", fee: 25 },
    { name_ar: "الدبلوماسي", name_en: "Diplomatic Quarter", fee: 20 },
    { name_ar: "بيرزيت", name_en: "Birzeit", fee: 30 },
    { name_ar: "بير نبالا", name_en: "Bir Nabala", fee: 40 },
    { name_ar: "خارجي", name_en: "External", fee: 15 },
    { name_ar: "مفرق 17 بيتونيا", name_en: "Beitunia - Junction 17", fee: 25 },
    { name_ar: "صناعة بيتونيا", name_en: "Beitunia Industrial", fee: 17 },
    { name_ar: "بيتونيا السنابل", name_en: "Beitunia Al-Sanabel", fee: 17 },
    { name_ar: "مفرق الحتو بيتونيا", name_en: "Beitunia Al-Hatu Junction", fee: 20 },
    { name_ar: "البلدة القديمة بيتونيا", name_en: "Old City Beitunia", fee: 30 },
    { name_ar: "دوار الفواكه بيتونيا", name_en: "Fruit Roundabout Beitunia", fee: 20 },
    { name_ar: "بيتونيا دوار المدارس", name_en: "Beitunia Schools Roundabout", fee: 25 },
    { name_ar: "بيتونيا ملاهي مخماس", name_en: "Beitunia Mukhamas Park", fee: 18 },
    { name_ar: "شارع المعبر بيتونيا", name_en: "Beitunia Crossing St.", fee: 22 },
    { name_ar: "بالوع بيتونيا", name_en: "Beitunia Balou'", fee: 22 },
    { name_ar: "بلدية البيرة", name_en: "Al-Bireh Municipality", fee: 13 },
    { name_ar: "حي الجنان البيرة", name_en: "Al-Jenan - Al-Bireh", fee: 15 },
    { name_ar: "اسعاد الطفولة البيرة", name_en: "Is'ad Al-Tufula - Al-Bireh", fee: 13 },
    { name_ar: "المدرسة الهاشمية البيرة", name_en: "Hashemite School - Al-Bireh", fee: 13 },
    { name_ar: "الجلزون", name_en: "Jalazone", fee: 20 },
    { name_ar: "رافات", name_en: "Rafat", fee: 25 },
    { name_ar: "دوار رافات", name_en: "Rafat Roundabout", fee: 20 },
    { name_ar: "قلنديا البلد", name_en: "Qalandia Village", fee: 30 },
  ];

  const branches = [
    { name_ar: "الأرسال", name_en: "Al-Irsal", slug: "al-irsal", latitude: 31.9148, longitude: 35.2016, is_active: true, sort_order: 1, banner_image_path: "/images/alirsal.webp", delivery_zones: universalDeliveryZones },
    { name_ar: "الطيرة", name_en: "Al-Tira", slug: "al-tira", latitude: 31.9056, longitude: 35.1950, is_active: true, sort_order: 2, banner_image_path: "/images/altira.webp", delivery_zones: universalDeliveryZones },
  ];
  await supabase.from("branches").upsert(branches, { onConflict: 'slug' });

  // 3.5 Menu Banners
  const menuBanners = [
    { name: "Banner 1", image_path: "/images/panar1.jpeg", sort_order: 1, is_active: true },
    { name: "Banner 2", image_path: "/images/panar2.jpeg", sort_order: 2, is_active: true },
  ];
  await supabase.from("menu_banners").upsert(menuBanners, { onConflict: 'image_path' });

  // 4. Addon Groups
  const burgerCatId = categoryMap["Burgers"];
  if (burgerCatId) {
    // Clear existing groups first to ensure fresh data and avoid conflicts
    console.log("Cleaning up Burger groups...");
    await supabase.from("addon_groups").delete().eq("category_id", burgerCatId);

    const addonGroups = [
      { name_ar: "الحجم", name_en: "Size", category_id: burgerCatId, group_type: "sizes", is_required: true, allow_multiple: false, sort_order: 1, is_active: true },
      { name_ar: "النوع", name_en: "Type", category_id: burgerCatId, group_type: "types", is_required: true, allow_multiple: false, sort_order: 2, is_active: true },
      { name_ar: "➕ الإضافات", name_en: "Addons", category_id: burgerCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 3, is_active: true },
      { name_ar: "🚫 بدون", name_en: "Without", category_id: burgerCatId, group_type: "without", is_required: false, allow_multiple: true, sort_order: 4, is_active: true },
      // Meal Specific Selections
      { name_ar: "🥤 اختر المشروب (مطلوب – للوجبة فقط)", name_en: "Select Drink", category_id: burgerCatId, group_type: "MealDrink", is_required: true, allow_multiple: false, sort_order: 5, is_active: true },
      { name_ar: "🔄 تبديل المشروب", name_en: "Swap Drink", category_id: burgerCatId, group_type: "MealDrinkUpgrade", is_required: false, allow_multiple: false, sort_order: 6, is_active: true },
      { name_ar: "🍟 تبديل البطاطا", name_en: "Swap Fries", category_id: burgerCatId, group_type: "MealFries", is_required: false, allow_multiple: false, sort_order: 7, is_active: true },
    ];

    const { data: agData, error: agError } = await supabase.from("addon_groups").insert(addonGroups).select();
    if (!agError && agData) {
      const agMap = Object.fromEntries(agData.map(g => [g.group_type, g.id]));

      // Item mappings
      const items = [
        // Sizes
        { addon_group_id: agMap["sizes"], name_ar: "120 غرام", name_en: "120g", price: 25, sort_order: 1, is_active: true },
        { addon_group_id: agMap["sizes"], name_ar: "150 غرام", name_en: "150g", price: 27, sort_order: 2, is_active: true },
        { addon_group_id: agMap["sizes"], name_ar: "240 غرام", name_en: "240g", price: 35, sort_order: 3, is_active: true },
        { addon_group_id: agMap["sizes"], name_ar: "300 غرام", name_en: "300g", price: 40, sort_order: 4, is_active: true },
        // Types
        { addon_group_id: agMap["types"], name_ar: "بيرجر", name_en: "Burger", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: agMap["types"], name_ar: "وجبة (مع بطاطا ومشروب غازي)", name_en: "Meal (Fries & Drink)", price: 9, sort_order: 2, is_active: true },
        // Addons
        { addon_group_id: agMap["addons"], name_ar: "قطعة لحمة 120 غرام", name_en: "Extra Meat 120g", price: 12, sort_order: 1, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "قطعة لحمة 150 غرام", name_en: "Extra Meat 150g", price: 15, sort_order: 2, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "بورشن ريب آي", name_en: "Ribeye Portion", price: 15, sort_order: 3, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "بورشن فيليه", name_en: "Fillet Portion", price: 12, sort_order: 4, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "جبنة على البرغر", name_en: "Extra Cheese", price: 3, sort_order: 5, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "بصل مكرمل", name_en: "Caramelized Onion", price: 3, sort_order: 6, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "ماشروم", name_en: "Mushroom", price: 3, sort_order: 7, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "خبز خالي من الجلوتين", name_en: "Gluten Free Bread", price: 5, sort_order: 8, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "أفوكادو", name_en: "Avocado", price: 5, sort_order: 9, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "هالبينو", name_en: "Jalapeno", price: 3, sort_order: 10, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "أصبعين موزاريلا", name_en: "2 Mozzarella Sticks", price: 8, sort_order: 11, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "3 حلقات بصل", name_en: "3 Onion Rings", price: 5, sort_order: 12, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "وايت صوص", name_en: "White Sauce", price: 5, sort_order: 13, is_active: true },
        // Without
        { addon_group_id: agMap["without"], name_ar: "مخلل", name_en: "Pickles", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "بندورة", name_en: "Tomato", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "بصل", name_en: "Onion", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "جبنة", name_en: "Cheese", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "خس", name_en: "Lettuce", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "صوص", name_en: "Sauce", price: 0, sort_order: 6, is_active: true },
        // Drink Selection
        { addon_group_id: agMap["MealDrink"], name_ar: "كولا", name_en: "Cola", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "كولا زيرو", name_en: "Cola Zero", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "فانتا", name_en: "Fanta", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "سبرايت", name_en: "Sprite", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "سبرايت دايت", name_en: "Sprite Diet", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "كابي", name_en: "Cappy", price: 0, sort_order: 6, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "ماء", name_en: "Water", price: 0, sort_order: 7, is_active: true },
        // Drink Upgrades
        { addon_group_id: agMap["MealDrinkUpgrade"], name_ar: "XL", name_en: "XL", price: 4, sort_order: 1, is_active: true },
        { addon_group_id: agMap["MealDrinkUpgrade"], name_ar: "بافاريا", name_en: "Bavaria", price: 4, sort_order: 2, is_active: true },
        { addon_group_id: agMap["MealDrinkUpgrade"], name_ar: "صودا", name_en: "Soda", price: 4, sort_order: 3, is_active: true },
        // Fries Upgrades
        { addon_group_id: agMap["MealFries"], name_ar: "كيرلي", name_en: "Curly Fries", price: 5, sort_order: 1, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "ويدجز", name_en: "Wedges", price: 5, sort_order: 2, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "بطاطا حلوة", name_en: "Sweet Potato", price: 5, sort_order: 3, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "كرات بطاطا", name_en: "Potato Balls", price: 5, sort_order: 4, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.0 Sandwiches Addon Groups
  const sandwichCatId = categoryMap["Sandwiches"];
  if (sandwichCatId) {
    // Clear existing groups first to ensure fresh data and avoid conflicts
    console.log("Cleaning up Sandwich groups...");
    await supabase.from("addon_groups").delete().eq("category_id", sandwichCatId);

    const addonGroups = [
      { name_ar: "النوع", name_en: "Type", category_id: sandwichCatId, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1, is_active: true },
      { name_ar: "➕ الإضافات", name_en: "Addons", category_id: sandwichCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 2, is_active: true },
      { name_ar: "🚫 بدون", name_en: "Without", category_id: sandwichCatId, group_type: "without", is_required: false, allow_multiple: true, sort_order: 3, is_active: true },
      { name_ar: "🥤 اختر المشروب (مطلوب – للوجبة فقط)", name_en: "Select Drink", category_id: sandwichCatId, group_type: "MealDrink", is_required: true, allow_multiple: false, sort_order: 4, is_active: true },
      { name_ar: "🔄 تبديل المشروب", name_en: "Swap Drink", category_id: sandwichCatId, group_type: "MealDrinkUpgrade", is_required: false, allow_multiple: false, sort_order: 5, is_active: true },
      { name_ar: "🍟 تبديل البطاطا", name_en: "Swap Fries", category_id: sandwichCatId, group_type: "MealFries", is_required: false, allow_multiple: false, sort_order: 6, is_active: true },
    ];
    const { data: agData, error: agError } = await supabase.from("addon_groups").insert(addonGroups).select();
    if (!agError && agData) {
      const agMap = Object.fromEntries(agData.map(g => [g.group_type, g.id]));
      const items = [
        { addon_group_id: agMap["types"], name_ar: "ساندويش", name_en: "Sandwich", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: agMap["types"], name_ar: "وجبة (مع بطاطا ومشروب غازي)", name_en: "Meal (Fries & Drink)", price: 9, sort_order: 2, is_active: true },
        // Addons
        { addon_group_id: agMap["addons"], name_ar: "قطعة لحمة 120 غرام", name_en: "Extra Meat 120g", price: 12, sort_order: 1, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "قطعة لحمة 150 غرام", name_en: "Extra Meat 150g", price: 15, sort_order: 2, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "بورشن ريب آي", name_en: "Ribeye Portion", price: 15, sort_order: 3, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "بورشن فيليه", name_en: "Fillet Portion", price: 12, sort_order: 4, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "جبنة على البرغر", name_en: "Extra Cheese", price: 3, sort_order: 5, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "بصل مكرمل", name_en: "Caramelized Onion", price: 3, sort_order: 6, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "ماشروم", name_en: "Mushroom", price: 3, sort_order: 7, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "خبز خالي من الجلوتين", name_en: "Gluten Free Bread", price: 5, sort_order: 8, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "أفوكادو", name_en: "Avocado", price: 5, sort_order: 9, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "هالبينو", name_en: "Jalapeno", price: 3, sort_order: 10, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "أصبعين موزاريلا", name_en: "2 Mozzarella Sticks", price: 8, sort_order: 11, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "3 حلقات بصل", name_en: "3 Onion Rings", price: 5, sort_order: 12, is_active: true },
        { addon_group_id: agMap["addons"], name_ar: "وايت صوص", name_en: "White Sauce", price: 5, sort_order: 13, is_active: true },
        // Without
        { addon_group_id: agMap["without"], name_ar: "مخلل", name_en: "Pickles", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "بندورة", name_en: "Tomato", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "بصل", name_en: "Onion", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "جبنة", name_en: "Cheese", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "خس", name_en: "Lettuce", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: agMap["without"], name_ar: "صوص", name_en: "Sauce", price: 0, sort_order: 6, is_active: true },
        // Drinks
        { addon_group_id: agMap["MealDrink"], name_ar: "كولا", name_en: "Cola", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "كولا زيرو", name_en: "Cola Zero", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "فانتا", name_en: "Fanta", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "سبرايت", name_en: "Sprite", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "سبرايت دايت", name_en: "Sprite Diet", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "كابي", name_en: "Cappy", price: 0, sort_order: 6, is_active: true },
        { addon_group_id: agMap["MealDrink"], name_ar: "ماء", name_en: "Water", price: 0, sort_order: 7, is_active: true },
        // Swaps
        { addon_group_id: agMap["MealDrinkUpgrade"], name_ar: "XL", name_en: "XL", price: 4, sort_order: 1, is_active: true },
        { addon_group_id: agMap["MealDrinkUpgrade"], name_ar: "بافاريا", name_en: "Bavaria", price: 4, sort_order: 2, is_active: true },
        { addon_group_id: agMap["MealDrinkUpgrade"], name_ar: "صودا", name_en: "Soda", price: 4, sort_order: 3, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "كيرلي", name_en: "Curly Fries", price: 5, sort_order: 1, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "ويدجز", name_en: "Wedges", price: 5, sort_order: 2, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "بطاطا حلوة", name_en: "Sweet Potato", price: 5, sort_order: 3, is_active: true },
        { addon_group_id: agMap["MealFries"], name_ar: "كرات بطاطا", name_en: "Potato Balls", price: 5, sort_order: 4, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.1 Main Meals Addons
  const mainMealsCatId = categoryMap["Main Meals"];
  if (mainMealsCatId) {
    const addonGroups = [
      { name_ar: "إضافات", name_en: "Addons", category_id: mainMealsCatId, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 1 },
    ];
    const { data: agData } = await supabase.from("addon_groups").upsert(addonGroups, { onConflict: 'name_en,category_id' }).select();
    if (agData) {
      const items = [
        { addon_group_id: agData[0].id, name_ar: "صحن أرز", name_en: "Rice Plate", price: 10, sort_order: 1, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.1.5 Steaks specific (Doneness & Type) 
  const ribeye = prodData?.find(p => p.name_en === "Ribeye Steak");
  const fillet = prodData?.find(p => p.name_en === "Fillet Steak");
  const grilledChickenSteak = prodData?.find(p => p.name_en === "Grilled Chicken Steak");

  if (ribeye || fillet) {
    const donenessGroup = { name_ar: "درجة الاستواء", name_en: "Doneness", category_id: mainMealsCatId, group_type: "Doneness", is_required: true, allow_multiple: false, sort_order: 2 };
    const { data: dgData } = await supabase.from("addon_groups").upsert([donenessGroup], { onConflict: 'name_en,category_id' }).select();
    if (dgData) {
      const donenessItems = [
        { addon_group_id: dgData[0].id, name_ar: "ميديوم", name_en: "Medium", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: dgData[0].id, name_ar: "ميديوم ويل", name_en: "Medium Well", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: dgData[0].id, name_ar: "ويل دون", name_en: "Well Done", price: 0, sort_order: 3, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(donenessItems, { onConflict: 'addon_group_id,name_en' });
    }
  }

  if (grilledChickenSteak) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: mainMealsCatId, product_id: grilledChickenSteak.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 3 };
    const { data: tgData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (tgData) {
      const typeItems = [
        { addon_group_id: tgData[0].id, name_ar: "مع ثوم و ليمون", name_en: "With Garlic and Lemon", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: tgData[0].id, name_ar: "مع وايت صوص", name_en: "With White Sauce", price: 0, sort_order: 2, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(typeItems, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.3 Wings Sizes
  const wingsCatId = categoryMap["Wings"];
  if (wingsCatId) {
    const sizeGroup = { name_ar: "الحجم", name_en: "Size", category_id: wingsCatId, group_type: "sizes", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: sgData } = await supabase.from("addon_groups").upsert([sizeGroup], { onConflict: 'name_en,category_id' }).select();
    if (sgData) {
      const sizeItems = [
        { addon_group_id: sgData[0].id, name_ar: "١٠ قطع", name_en: "10 Pieces", price: 13, sort_order: 1, is_active: true },
        { addon_group_id: sgData[0].id, name_ar: "٢٠ قطعة", name_en: "20 Pieces", price: 25, sort_order: 2, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(sizeItems, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.4 Kids Burger Type
  const kidsChickenBurger = prodData?.find(p => p.name_en === "Kids Chicken Burger");
  if (kidsChickenBurger) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Kids Meals"], product_id: kidsChickenBurger.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: kgData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (kgData) {
      const items = [
        { addon_group_id: kgData[0].id, name_ar: "مشوي", name_en: "Grilled", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: kgData[0].id, name_ar: "مقلي", name_en: "Fried", price: 0, sort_order: 2, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.5 Appetizers - Mozzarella Sticks +1
  const mozzarellaSticks = prodData?.find(p => p.name_en === "Mozzarella Sticks 3pcs");
  if (mozzarellaSticks) {
    const addonGroup = { name_ar: "إضافات", name_en: "Addons", category_id: categoryMap["Appetizers"], product_id: mozzarellaSticks.id, group_type: "addons", is_required: false, allow_multiple: true, sort_order: 1 };
    const { data: magData } = await supabase.from("addon_groups").upsert([addonGroup], { onConflict: 'name_en,product_id' }).select();
    if (magData) {
      const items = [
        { addon_group_id: magData[0].id, name_ar: "+1", name_en: "+1", price: 4, sort_order: 1, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.6 Cold Drinks - Juice Type
  const juice = prodData?.find(p => p.name_en === "Juice");
  if (juice) {
    // Update base price to 15
    await supabase.from("products").update({ base_price: 15 }).eq("id", juice.id);
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Cold Drinks"], product_id: juice.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: jugData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (jugData) {
      const items = [
        { addon_group_id: jugData[0].id, name_ar: "برتقال", name_en: "Orange", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: jugData[0].id, name_ar: "ليمون", name_en: "Lemon", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: jugData[0].id, name_ar: "ليمون و نعنع", name_en: "Lemon & Mint", price: 0, sort_order: 3, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.7 Natural Smoothie Type
  const smoothie = prodData?.find(p => p.name_en === "Natural Smoothie");
  if (smoothie) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Natural Smoothie"], product_id: smoothie.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: smgData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (smgData) {
      const items = [
        { addon_group_id: smgData[0].id, name_ar: "فراولة", name_en: "Strawberry", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: smgData[0].id, name_ar: "مانجا", name_en: "Mango", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: smgData[0].id, name_ar: "اناناس", name_en: "Pineapple", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: smgData[0].id, name_ar: "مانجا مع اناناس", name_en: "Mango & Pineapple", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: smgData[0].id, name_ar: "مانجا مع مسفلورا", name_en: "Mango & Passion Fruit", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: smgData[0].id, name_ar: "بينك ليموند", name_en: "Pink Lemonade", price: 0, sort_order: 6, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.8 Milkshake Type
  const milkshake = prodData?.find(p => p.name_en === "Milkshake");
  if (milkshake) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Milkshake"], product_id: milkshake.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: msgData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (msgData) {
      const items = [
        { addon_group_id: msgData[0].id, name_ar: "فراولة", name_en: "Strawberry", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: msgData[0].id, name_ar: "فانيلا", name_en: "Vanilla", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: msgData[0].id, name_ar: "اوريو", name_en: "Oreo", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: msgData[0].id, name_ar: "لوتس", name_en: "Lotus", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: msgData[0].id, name_ar: "تشوكليت", name_en: "Chocolate", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: msgData[0].id, name_ar: "كوفي كراش", name_en: "Coffee Crush", price: 0, sort_order: 6, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.9 Hot Drinks - Espresso & Tea
  const espresso = prodData?.find(p => p.name_en === "Espresso");
  if (espresso) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Hot Drinks"], product_id: espresso.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: esgData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (esgData) {
      const items = [
        { addon_group_id: esgData[0].id, name_ar: "سنجل", name_en: "Single", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: esgData[0].id, name_ar: "دبل", name_en: "Double", price: 4, sort_order: 2, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  const tea = prodData?.find(p => p.name_en === "Tea");
  if (tea) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Hot Drinks"], product_id: tea.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 2 };
    const { data: tagData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (tagData) {
      const items = [
        { addon_group_id: tagData[0].id, name_ar: "عادي", name_en: "Regular", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: tagData[0].id, name_ar: "أخضر", name_en: "Green", price: 0, sort_order: 2, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  // 4.10 Hookah Type
  const hookah = prodData?.find(p => p.name_en === "Hookah");
  if (hookah) {
    const typeGroup = { name_ar: "النوع", name_en: "Type", category_id: categoryMap["Hookah"], product_id: hookah.id, group_type: "types", is_required: true, allow_multiple: false, sort_order: 1 };
    const { data: hogData } = await supabase.from("addon_groups").upsert([typeGroup], { onConflict: 'name_en,product_id' }).select();
    if (hogData) {
      const items = [
        { addon_group_id: hogData[0].id, name_ar: "ليمون و نعنع", name_en: "Lemon & Mint", price: 0, sort_order: 1, is_active: true },
        { addon_group_id: hogData[0].id, name_ar: "تفاحتين", name_en: "Two Apples", price: 0, sort_order: 2, is_active: true },
        { addon_group_id: hogData[0].id, name_ar: "مسكة و قرفة", name_en: "Mastic & Cinnamon", price: 0, sort_order: 3, is_active: true },
        { addon_group_id: hogData[0].id, name_ar: "بلوبري", name_en: "Blueberry", price: 0, sort_order: 4, is_active: true },
        { addon_group_id: hogData[0].id, name_ar: "بطيخ و نعنع", name_en: "Watermelon & Mint", price: 0, sort_order: 5, is_active: true },
        { addon_group_id: hogData[0].id, name_ar: "تفاحتين نخلة", name_en: "Palm Two Apples", price: 10, sort_order: 6, is_active: true },
      ];
      await supabase.from("addon_group_items").upsert(items, { onConflict: 'addon_group_id,name_en' });
    }
  }

  console.log("Seeding complete!");
}
