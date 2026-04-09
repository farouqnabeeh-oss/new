import { getSupabaseAdmin } from "./supabase";

export async function seedRestaurantData() {
  const supabase = getSupabaseAdmin();

  // 1. Categories based on real menu
  const categories = [
    { name_ar: "برجر لحم", name_en: "Beef Burgers", sort_order: 1, is_active: true, icon_class: "🍔" },
    { name_ar: "برجر دجاج", name_en: "Chicken Burgers", sort_order: 2, is_active: true, icon_class: "🍗" },
    { name_ar: "ساندويتشات", name_en: "Sandwiches", sort_order: 3, is_active: true, icon_class: "🥪" },
    { name_ar: "وجبات عائلية وبوكسات", name_en: "Family Meals & Boxes", sort_order: 4, is_active: true, icon_class: "🍱" },
    { name_ar: "مقبلات", name_en: "Appetizers", sort_order: 5, is_active: true, icon_class: "🍟" },
    { name_ar: "مشروبات باردة", name_en: "Cold Drinks", sort_order: 6, is_active: true, icon_class: "🥤" },
    { name_ar: "مشروبات ساخنة", name_en: "Hot Drinks", sort_order: 7, is_active: true, icon_class: "☕" },
    { name_ar: "حلويات", name_en: "Desserts", sort_order: 8, is_active: true, icon_class: "🍰" },
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
    // Beef Burgers
    {
      name_ar: "أبتاون برجر",
      name_en: "Uptown Burger",
      description_ar: "شريحة لحم دبل، بصل مكرمل، خس، طماطم، جبنة شيدر، وصوص أبتاون",
      description_en: "Double beef patty, caramelized onions, lettuce, tomato, cheddar cheese, and Uptown sauce",
      base_price: 35,
      category_id: categoryMap["Beef Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "ترافل برجر",
      name_en: "Truffle Burger",
      description_ar: "شريحة لحم بصوص الترافل الفاخر، مشروم، جبنة سويسرية",
      description_en: "Beef patty with premium truffle sauce, mushrooms, and Swiss cheese",
      base_price: 37,
      category_id: categoryMap["Beef Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "سموك هاوس برجر",
      name_en: "Smokehouse Burger",
      description_ar: "شريحة لحم، بيكون بقري، حلقات بصل مقلية، صوص الباربكيو المدخن",
      description_en: "Beef patty, beef bacon, fried onion rings, smoked BBQ sauce",
      base_price: 33,
      category_id: categoryMap["Beef Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "كلاسيك برجر",
      name_en: "Classic Burger",
      description_ar: "برجر كلاسيكي مع خس، طماطم، مخلل وصوص خاص",
      description_en: "Classic burger with lettuce, tomato, pickles, and special sauce",
      base_price: 28,
      category_id: categoryMap["Beef Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800&auto=format&fit=crop"
    },
    // Chicken Burgers
    {
        name_ar: "دجاج كرسبي",
        name_en: "Crispy Chicken",
        description_ar: "صدر دجاج مقرمش مع الخس والمايونيز والجبنة",
        description_en: "Crispy chicken breast with lettuce, mayonnaise, and cheese",
        base_price: 25,
        category_id: categoryMap["Chicken Burgers"],
        is_active: true,
        has_meal_option: true,
        image_path: "https://images.unsplash.com/photo-1606755962773-d32172e7a202?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "بوفالو دجاج برجر",
        name_en: "Buffalo Chicken Burger",
        description_ar: "دجاج مقرمش مغمس بصوص البوفالو الحار مع المخلل والمايونيز",
        description_en: "Crispy chicken tossed in spicy buffalo sauce with pickles and mayonnaise",
        base_price: 27,
        category_id: categoryMap["Chicken Burgers"],
        is_active: true,
        has_meal_option: true,
        image_path: "https://images.unsplash.com/photo-1615486171448-4fdcf594d215?q=80&w=800&auto=format&fit=crop"
    },
    // Sandwiches
    {
        name_ar: "ساندويتش فيلي ستيك",
        name_en: "Philly Steak Sandwich",
        description_ar: "شرائح لحم بقري ريب آي مع البصل والمشروم والفلفل والجبنة المذابة",
        description_en: "Ribeye steak slices with onions, mushrooms, peppers and melted cheese",
        base_price: 30,
        category_id: categoryMap["Sandwiches"],
        is_active: true,
        has_meal_option: true,
        image_path: "https://images.unsplash.com/photo-1628198539209-77f6bbfd0ec5?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "ساندويتش فاهيتا دجاج",
        name_en: "Chicken Fajita Sandwich",
        description_ar: "دجاج متبل على الطريقة المكسيكية مع الفلفل الألوان والبصل والجبنة",
        description_en: "Mexican spiced chicken with bell peppers, onions and cheese",
        base_price: 25,
        category_id: categoryMap["Sandwiches"],
        is_active: true,
        has_meal_option: true,
        image_path: "https://images.unsplash.com/photo-1626244405389-7008cf585d82?q=80&w=800&auto=format&fit=crop"
    },
    // Family Boxes
    {
        name_ar: "بوكس التوفير",
        name_en: "Saver Box",
        description_ar: "4 برجر كلاسيك، 2 بطاطس حجم عائلي، 1 بيبسي لتر",
        description_en: "4 Classic burgers, 2 family fries, 1L Pepsi",
        base_price: 110,
        category_id: categoryMap["Family Meals & Boxes"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop"
    },
    // Appetizers
    {
        name_ar: "بطاطا مقلية صينية",
        name_en: "French Fries",
        description_ar: "بطاطا مقرمشة ذهبية",
        description_en: "Golden crispy french fries",
        base_price: 10,
        category_id: categoryMap["Appetizers"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "أصابع الموزاريلا",
        name_en: "Mozzarella Sticks",
        description_ar: "أصابع موزاريلا مقرمشة تقدم مع صوص المارينارا (5 قطع)",
        description_en: "Crispy mozzarella sticks served with marinara sauce (5 pieces)",
        base_price: 15,
        category_id: categoryMap["Appetizers"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1531749668029-2be8c962bda5?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "أجنحة الدجاج",
        name_en: "Chicken Wings",
        description_ar: "أجنحة دجاج مقلية بصوص البافلو أو الباربكيو (6 قطع)",
        description_en: "Fried chicken wings tossed in buffalo or BBQ sauce (6 pieces)",
        base_price: 20,
        category_id: categoryMap["Appetizers"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1565299585323-38d1b7371a58?q=80&w=800&auto=format&fit=crop"
    },
    // Drinks
    {
        name_ar: "بيبسي",
        name_en: "Pepsi",
        description_ar: "علبة بيبسي",
        description_en: "Pepsi Can",
        base_price: 4,
        category_id: categoryMap["Cold Drinks"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "سفن أب",
        name_en: "7up",
        description_ar: "علبة سفن أب",
        description_en: "7up Can",
        base_price: 4,
        category_id: categoryMap["Cold Drinks"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "ماء",
        name_en: "Water",
        description_ar: "زجاجة مياه معدنية صغيرة",
        description_en: "Small mineral water bottle",
        base_price: 3,
        category_id: categoryMap["Cold Drinks"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop"
    },
    // Desserts
    {
        name_ar: "تشيز كيك نيويورك",
        name_en: "New York Cheesecake",
        description_ar: "قطعة من التشيز كيك الكلاسيكي بصوص الفراولة",
        description_en: "A slice of classic cheesecake with strawberry sauce",
        base_price: 20,
        category_id: categoryMap["Desserts"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop"
    },
    {
        name_ar: "مولتن شوكليت كيك",
        name_en: "Molten Chocolate Cake",
        description_ar: "كيك الشوكولاتة الدافئ مع الآيس كريم",
        description_en: "Warm chocolate cake with ice cream",
        base_price: 22,
        category_id: categoryMap["Desserts"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "أولد سكول برجر",
      name_en: "Old School Burger",
      description_ar: "شريحة لحم كلاسيكية مع إضافات أبتاون الأصلية",
      description_en: "Classic beef patty with original Uptown additions",
      base_price: 35,
      category_id: categoryMap["Beef Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "سماش برجر",
      name_en: "Smash Burger",
      description_ar: "شريحتين رقيقتين من اللحم المشوي، جبنة، صوص سماش",
      description_en: "Two thin smashed beef patties, cheese, smash sauce",
      base_price: 32,
      category_id: categoryMap["Beef Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "فيليه دجاج برجر",
      name_en: "Chicken Filet Burger",
      description_ar: "فيليه دجاج مشوي مع الخس والطماطم",
      description_en: "Grilled chicken filet with lettuce and tomato",
      base_price: 28,
      category_id: categoryMap["Chicken Burgers"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1606755962773-d32172e7a202?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "ساندويش حبش مدخن",
      name_en: "Smoked Turkey Sandwich",
      description_ar: "شرائح الحبش المدخن مع الجبنة والخس",
      description_en: "Smoked turkey slices with cheese and lettuce",
      base_price: 20,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1628198539209-77f6bbfd0ec5?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "زنجر ساندويتش",
      name_en: "Zinger Sandwich",
      description_ar: "دجاج زنجر حار ومقرمش",
      description_en: "Spicy and crispy Zinger chicken",
      base_price: 22,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1626244405389-7008cf585d82?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "شاورما دجاج بخبز التورتيلا",
      name_en: "Chicken Shawarma Wrap",
      description_ar: "شاورما دجاج الطازجة في خبز التورتيلا والمثومة",
      description_en: "Fresh chicken shawarma in tortilla bread with garlic sauce",
      base_price: 15,
      category_id: categoryMap["Sandwiches"],
      is_active: true,
      all_branches: true,
      has_meal_option: true,
      image_path: "https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "ودجز",
      name_en: "Wedges",
      description_ar: "بطاطس ودجز المتبلة",
      description_en: "Seasoned potato wedges",
      base_price: 12,
      category_id: categoryMap["Appetizers"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "حلقات البصل",
      name_en: "Onion Rings",
      description_ar: "حلقات بصل مقرمشة وذهبية",
      description_en: "Crispy golden onion rings",
      base_price: 14,
      category_id: categoryMap["Appetizers"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "ناجتس الدجاج",
      name_en: "Chicken Nuggets",
      description_ar: "قطع الناجتس (8 قطع)",
      description_en: "Chicken nuggets (8 pieces)",
      base_price: 16,
      category_id: categoryMap["Appetizers"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "ميرندا",
      name_en: "Miranda",
      description_ar: "ميرندا برتقال باردة",
      description_en: "Cold orange miranda",
      base_price: 4,
      category_id: categoryMap["Cold Drinks"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop"
    },
    {
      name_ar: "ميلك شيك فراولة",
      name_en: "Strawberry Milkshake",
      description_ar: "ميلك شيك منعش بنكهة الفراولة",
      description_en: "Refreshing strawberry milkshake",
      base_price: 18,
      category_id: categoryMap["Cold Drinks"],
      is_active: true,
      all_branches: true,
      has_meal_option: false,
      image_path: "https://images.unsplash.com/photo-1579954115545-a95f9ab7a4ea?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const { error: prodError } = await supabase
    .from("products")
    .upsert(products, { onConflict: 'name_en' });

  if (prodError) {
    console.error("Error seeding products:", prodError);
  } else {
    console.log("Seeding complete!");
  }
}

