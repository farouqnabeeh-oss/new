export const mockBranches = [
  {
    id: 1,
    slug: "al-irsal",
    nameAr: "الأرسال",
    nameEn: "Al-Irsal",
    phone: "0599123456",
    whatsApp: "+970599123456",
    bannerImagePath: "/images/alirsal.webp",
    discountPercent: 10,
    isActive: true,
    sortOrder: 1,
    latitude: 31.906,
    longitude: 35.203,
    openingTime: "09:00",
    closingTime: "23:00",
    deliveryFee: 10,
    deliveryZones: [
      { name: "الارسال", fee: 10 },
      { name: "سطح مرحبا", fee: 18 },
      { name: "شارع القدس", fee: 15 },
      { name: "الامعري", fee: 15 },
      { name: "الشرفة", fee: 15 },
      { name: "وسط البلد", fee: 12 },
      { name: "البالوع", fee: 10 },
      { name: "المصايف", fee: 10 },
      { name: "شارع نابلس", fee: 10 },
      { name: "جبل الطويل - البيرة", fee: 12 },
      { name: "سردا", fee: 16 },
      { name: "ابو قش", fee: 25 },
      { name: "الريحان", fee: 25 },
      { name: "الدبلوماسي", fee: 20 },
      { name: "بيرزيت", fee: 30 },
      { name: "بير نبالا", fee: 40 },
      { name: "خارجي", fee: 15 },
      { name: "مفرق 17 بيتونيا", fee: 25 },
      { name: "صناعة بيتونيا", fee: 17 },
      { name: "بيتونيا السنابل", fee: 17 },
      { name: "مفرق الحتو بيتونيا", fee: 20 },
      { name: "البلدة القديمة بيتونيا", fee: 30 },
      { name: "دوار الفواكه بيتونيا", fee: 20 },
      { name: "بيتونيا دوار المدارس", fee: 25 },
      { name: "بيتونيا ملاهي مخماس", fee: 18 },
      { name: "شارع المعبر بيتونيا", fee: 22 },
      { name: "بالوع بيتونيا", fee: 22 },
      { name: "بلدية البيرة", fee: 13 },
      { name: "حي الجنان البيرة", fee: 15 },
      { name: "اسعاد الطفولة البيرة", fee: 13 },
      { name: "المدرسة الهاشمية البيرة", fee: 13 },
      { name: "الجلزون", fee: 20 },
      { name: "رافات", fee: 25 },
      { name: "دوار رافات", fee: 20 },
      { name: "قلنديا البلد", fee: 30 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    slug: "al-tira",
    nameAr: "الطيرة",
    nameEn: "Al-Tira",
    phone: "0599123457",
    whatsApp: "+970599123457",
    bannerImagePath: "/images/altira.webp",
    discountPercent: 0,
    isActive: true,
    sortOrder: 2,
    latitude: 31.902,
    longitude: 35.1873,
    openingTime: "10:00",
    closingTime: "02:00",
    deliveryFee: 15,
    deliveryZones: [
      { name: "الارسال", fee: 10 },
      { name: "سطح مرحبا", fee: 18 },
      { name: "شارع القدس", fee: 15 },
      { name: "الامعري", fee: 15 },
      { name: "الشرفة", fee: 15 },
      { name: "وسط البلد", fee: 12 },
      { name: "البالوع", fee: 10 },
      { name: "المصايف", fee: 10 },
      { name: "شارع نابلس", fee: 10 },
      { name: "جبل الطويل - البيرة", fee: 12 },
      { name: "سردا", fee: 16 },
      { name: "ابو قش", fee: 25 },
      { name: "الريحان", fee: 25 },
      { name: "الدبلوماسي", fee: 20 },
      { name: "بيرزيت", fee: 30 },
      { name: "بير نبالا", fee: 40 },
      { name: "خارجي", fee: 15 },
      { name: "مفرق 17 بيتونيا", fee: 25 },
      { name: "صناعة بيتونيا", fee: 17 },
      { name: "بيتونيا السنابل", fee: 17 },
      { name: "مفرق الحتو بيتونيا", fee: 20 },
      { name: "البلدة القديمة بيتونيا", fee: 30 },
      { name: "دوار الفواكه بيتونيا", fee: 20 },
      { name: "بيتونيا دوار المدارس", fee: 25 },
      { name: "بيتونيا ملاهي مخماس", fee: 18 },
      { name: "شارع المعبر بيتونيا", fee: 22 },
      { name: "بالوع بيتونيا", fee: 22 },
      { name: "بلدية البيرة", fee: 13 },
      { name: "حي الجنان البيرة", fee: 15 },
      { name: "اسعاد الطفولة البيرة", fee: 13 },
      { name: "المدرسة الهاشمية البيرة", fee: 13 },
      { name: "الجلزون", fee: 20 },
      { name: "رافات", fee: 25 },
      { name: "دوار رافات", fee: 20 },
      { name: "قلنديا البلد", fee: 30 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockCategories = [
  { id: 113, nameAr: "بيرجر", nameEn: "Burgers", branchId: null, sortOrder: 13, iconClass: "🍔", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 18 },
  { id: 101, nameAr: "ساندويشات", nameEn: "Sandwiches", branchId: null, sortOrder: 1, iconClass: "🥪", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 6 },
  { id: 102, nameAr: "وجبات رئيسية", nameEn: "Main Meals", branchId: null, sortOrder: 2, iconClass: "🍽️", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 7 },
  { id: 103, nameAr: "أجنحة", nameEn: "Wings", branchId: null, sortOrder: 3, iconClass: "🍗", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 7 },
  { id: 104, nameAr: "وجبات الأطفال", nameEn: "Kids Meals", branchId: null, sortOrder: 4, iconClass: "🧸", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 3 },
  { id: 105, nameAr: "سلطات", nameEn: "Salads", branchId: null, sortOrder: 5, iconClass: "🥗", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 6 },
  { id: 106, nameAr: "قهوة باردة", nameEn: "Cold Coffee", branchId: null, sortOrder: 6, iconClass: "🧊", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 9 },
  { id: 107, nameAr: "سموذي طبيعي", nameEn: "Natural Smoothie", branchId: null, sortOrder: 7, iconClass: "🥤", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 1 },
  { id: 108, nameAr: "ميلك شيك", nameEn: "Milkshake", branchId: null, sortOrder: 8, iconClass: "🥤", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 1 },
  { id: 109, nameAr: "مشروبات ساخنة", nameEn: "Hot Drinks", branchId: null, sortOrder: 9, iconClass: "☕", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 15 },
  { id: 110, nameAr: "حلويات", nameEn: "Desserts", branchId: null, sortOrder: 10, iconClass: "🍰", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 9 },
  { id: 111, nameAr: "مشروبات باردة", nameEn: "Cold Drinks", branchId: null, sortOrder: 11, iconClass: "🥤", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 18 },
  { id: 112, nameAr: "أراجيل", nameEn: "Hookah", branchId: null, sortOrder: 12, iconClass: "💨", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 1 },
  { id: 114, nameAr: "مقبلات", nameEn: "Appetizers", branchId: null, sortOrder: 14, iconClass: "🍟", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 11 },
  { id: 115, nameAr: "باستا", nameEn: "Pasta", branchId: null, sortOrder: 15, iconClass: "🍝", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), productCount: 3 }
];

export const mockProducts = [
  // Sandwiches (101)
  {
    id: 1001, nameAr: "ساندويش دجاج مقلي مقرمش (كريسبي)", nameEn: "Crispy Chicken Sandwich", descriptionAr: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", descriptionEn: "150g crispy chicken, lettuce, tomato, onions, pickles, and Uptown sauce",
    basePrice: 25, discount: 10, categoryId: 101, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/crispy-fried-chicken-sandwich__nxer45s6cek81pp.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1002, nameAr: "ساندويش دجاج مشوي", nameEn: "Grilled Chicken Sandwich", descriptionAr: "150 غرام . خس . بندورة . مخلل . بصل . صوص اب تاون", descriptionEn: "150g grilled chicken, lettuce, tomato, pickles, onions, and Uptown sauce",
    basePrice: 25, discount: 10, categoryId: 101, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/grilled-chicken-sandwich__0p8n3eb1fxkz4e1.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1003, nameAr: "ساندويش دجاج إيطالي", nameEn: "Italian Chicken Sandwich", descriptionAr: "150 غرام . دجاج مشوي . مشروم وايت صوص . خس . مخلل . بصل . صوص اب تاون", descriptionEn: "150g grilled chicken, mushroom white sauce, lettuce, pickles, onions, and Uptown sauce",
    basePrice: 25, discount: 10, categoryId: 101, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/italian-chicken-sandwich__v8h8fvt2k4dudl7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1004, nameAr: "ساندويش مسحب فاهيتا", nameEn: "Fajita Chicken Sandwich", descriptionAr: "150 غرام . دجاج مشوي . فلفل حلو ملون . مشروم. بصل . بندورة . صوص مكسيكي", descriptionEn: "150g grilled chicken, bell peppers, mushroom, onions, tomato, and Mexican sauce",
    basePrice: 25, discount: 10, categoryId: 101, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/fajita-chicken-sandwich__umcuqi5n4f72jbb.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1005, nameAr: "ساندويش أسايدو", nameEn: "Asado Sandwich", descriptionAr: "لحم عجل مطهو لأكثر من 5 ساعات . خس . بندورة وبصل مشوي . مخلل . صوص", descriptionEn: "Slow-cooked veal for over 5 hours, lettuce, grilled tomato and onions, pickles, and sauce",
    basePrice: 36, discount: 0, categoryId: 101, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/asado-sandwich__wo23euzc8pcflgm.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1006, nameAr: "ساندويش حلومي", nameEn: "Halloumi Sandwich", descriptionAr: "150 غرام . جبنة حلومي . صوص رانش . خس . بصل . بندورة . مخلل", descriptionEn: "150g halloumi cheese, ranch sauce, lettuce, onions, tomato, pickles",
    basePrice: 25, discount: 10, categoryId: 101, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/halloumi-sandwich__1vuq1k5kk4zhdtn.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Main Meals (102)
  {
    id: 1021, nameAr: "ستيك دجاج مشوي", nameEn: "Grilled Chicken Steak", descriptionAr: "خضار سوتيه . ماشد بوتيتو", descriptionEn: "Sautéed vegetables, mashed potatoes",
    basePrice: 45, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    types: []
  },
  {
    id: 1022, nameAr: "ريب أي ستيك", nameEn: "Ribeye Steak", descriptionAr: "ستيك ريب أي . خضار سوتيه . ماشد بوتيتو . وايت صوص", descriptionEn: "Ribeye steak, sautéed vegetables, mashed potatoes, and white sauce",
    basePrice: 90, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: true, sortOrder: 2, isActive: true,
    imagePath: "/images/ribeye-steak__ug7of6vwzmplsva.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1023, nameAr: "فيليه ستيك", nameEn: "Fillet Steak", descriptionAr: "ستيك فيليه . خضار سوتيه . ماشد بوتيتو . وايت صوص", descriptionEn: "Fillet steak, sautéed vegetables, mashed potatoes, and white sauce",
    basePrice: 70, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: true, sortOrder: 3, isActive: true,
    imagePath: "/images/beef-fillet-steak__1z530ggv6hnt6g0.webp", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1024, nameAr: "دجاج فاهيتا مع أرز", nameEn: "Fajita Chicken with Rice", descriptionAr: "دجاج . فلفل حلو . بصل . مشروم. صوص مكسيكي", descriptionEn: "Chicken, bell peppers, onions, mushroom, and Mexican sauce",
    basePrice: 45, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/chicken-fajita-with-rice__2re3bdsltsnwkzv.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1025, nameAr: "ستروجانوف دجاج مع أرز", nameEn: "Chicken Stroganoff with Rice", descriptionAr: "دجاج . فلفل حلو . بصل . مشروم. وايت صوص", descriptionEn: "Chicken, bell peppers, onions, mushroom, and white sauce",
    basePrice: 45, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/chicken-stroganoff-with-rice__nl0w7mlpkeq6dl9.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1026, nameAr: "ستروجانوف لحمة مع أرز", nameEn: "Beef Stroganoff with Rice", descriptionAr: "شرائح فيليه ستيك . فلفل حلو . بصل . مشروم. وايت صوص", descriptionEn: "Fillet steak strips, bell peppers, onions, mushroom, and white sauce",
    basePrice: 60, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/beef-stroganoff-with-rice__pyr14b4rim9cnsg.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1027, nameAr: "فوتوتشيني مع دجاج", nameEn: "Fettuccine with Chicken", descriptionAr: "دجاج مشوي . فوتوتشيني . مشروم. وايت صوص . جبنة بارميزان", descriptionEn: "Grilled chicken, fettuccine, mushroom, white sauce, and parmesan cheese",
    basePrice: 45, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1028, nameAr: "ستيك اللحمة", nameEn: "Beef Steak", descriptionAr: "ستيك لحمة مشوي يقدم مع الخضار والبطاطا", descriptionEn: "Grilled beef steak served with vegetables and potatoes",
    basePrice: 85, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: true, sortOrder: 8, isActive: true,
    imagePath: "/images/beef-fillet-steak__1z530ggv6hnt6g0.webp", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1029, nameAr: "صحن أرز", nameEn: "Rice Plate", descriptionAr: "صحن أرز جانبي", descriptionEn: "Side rice plate",
    basePrice: 10, discount: 10, categoryId: 102, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/chicken-fajita-with-rice__2re3bdsltsnwkzv.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Pasta (115)
  {
    id: 1151, nameAr: "سباجيتي ريد صوص", nameEn: "Spaghetti Red Sauce", descriptionAr: "سباجيتي مع صلصة الطماطم الحمراء", descriptionEn: "Spaghetti with red tomato sauce",
    basePrice: 30, discount: 10, categoryId: 115, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1152, nameAr: "بينا أرابيتا", nameEn: "Penne Arrabbiata", descriptionAr: "باستا بينا بصلصة حارة", descriptionEn: "Penne pasta with spicy sauce",
    basePrice: 30, discount: 10, categoryId: 115, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1153, nameAr: "سباجيتي وايت صوص", nameEn: "Spaghetti White Sauce", descriptionAr: "سباجيتي مع الصلصة البيضاء الكريمية", descriptionEn: "Spaghetti with creamy white sauce",
    basePrice: 30, discount: 10, categoryId: 115, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/chicken-fettuccine-alfredo__id5pl49u8j1t3kj.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  // Wings (103)
  {
    id: 1031, nameAr: "أجنحة مقلية مقرمشة", nameEn: "Crispy Fried Wings", descriptionAr: "أجنحة دجاج مقلية مقرمشة", descriptionEn: "Crispy fried chicken wings",
    basePrice: 30, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/crispy-fried-wings__8a79zxxqhvr0ihm.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    sizes: [
      { id: 10311, nameAr: "١٠ قطع", nameEn: "10 Pieces", price: 13 },
      { id: 10312, nameAr: "٢٠ قطعة", nameEn: "20 Pieces", price: 25 }
    ], types: []
  },
  {
    id: 1032, nameAr: "أجنحة بصوص البافلو", nameEn: "Buffalo Wings", descriptionAr: "أجنحة بصوص البافلو الحار", descriptionEn: "Spicy buffalo wings",
    basePrice: 28, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/buffalo-sauce-wings__hvhrz3c6wkwi56v.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1033, nameAr: "أجنحة بصوص الباربيكيو", nameEn: "BBQ Wings", descriptionAr: "أجنحة بصوص الباربيكيو المدخن", descriptionEn: "Smoked BBQ wings",
    basePrice: 28, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/bbq-sauce-wings__ut71ovptawjn1ai.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1034, nameAr: "أجنحة بصوص التيراكي", nameEn: "Teriyaki Wings", descriptionAr: "أجنحة بصوص التيراكي", descriptionEn: "Teriyaki wings",
    basePrice: 28, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/teriyaki-sauce-wings__lle6d5attaszh53.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1035, nameAr: "أجنحة بصوص وثوم وليمون وبارميزان", nameEn: "Lemon Parmesan Wings", descriptionAr: "أجنحة بصوص والثوم والليمون وجبنة البارميزان", descriptionEn: "Garlic, lemon and parmesan wings",
    basePrice: 28, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/garlic-lemon-parmesan-wings__pu0bcxvhvsozf63.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1036, nameAr: "أجنحة بصوص الثومة والليمون", nameEn: "Garlic Lemon Wings", descriptionAr: "أجنحة بصوص الثومة والليمون", descriptionEn: "Garlic and lemon wings",
    basePrice: 28, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/garlic-lemon-wings__871mbhqqt1p5bk7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1037, nameAr: "أجنحة بصوص السويت شيلي", nameEn: "Sweet Chili Wings", descriptionAr: "أجنحة بصوص السويت شيلي", descriptionEn: "Sweet chili wings",
    basePrice: 28, discount: 10, categoryId: 103, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/sweet-chili-wings__kdipx15msj2668u.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Kids Meals (104)
  {
    id: 1041, nameAr: "كيدز بيرجر لحمة", nameEn: "Kids Beef Burger", descriptionAr: "الوجبة تشمل بطاطا مقلية وعصير", descriptionEn: "Meal includes french fries and juice",
    basePrice: 23, discount: 10, categoryId: 104, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/kids-beef-burger__vhek3ygzet469f2.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1042, nameAr: "كيدز بيرجر دجاج", nameEn: "Kids Chicken Burger", descriptionAr: "الوجبة تشمل بطاطا مقلية وعصير", descriptionEn: "Meal includes french fries and juice",
    basePrice: 23, discount: 10, categoryId: 104, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    types: []
  },
  {
    id: 1043, nameAr: "بوب كورن دجاج", nameEn: "Chicken Popcorn", descriptionAr: "الوجبة تشمل بطاطا مقلية وعصير", descriptionEn: "Meal includes french fries and juice",
    basePrice: 23, discount: 10, categoryId: 104, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/chicken-popcorn__8ql6ou2bhl45zed.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Salads (105)
  {
    id: 1051, nameAr: "سلطة سيزر", nameEn: "Caesar Salad", descriptionAr: "خس . جبنة بارميزان . خبز محمص . صوص سيزر", descriptionEn: "Lettuce, parmesan cheese, croutons, and Caesar dressing",
    basePrice: 25, discount: 10, categoryId: 105, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/caesar-salad-kgn4gpstowx0mu9-c9d70a64-0049-4b14-974b-dc68ac07791c.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1052, nameAr: "سلطة يونانية", nameEn: "Greek Salad", descriptionAr: "خس . فلفل ملون . خيار . زيتون أسود . بندورة . ليمون . زيت زيتون . جبنة فيتا", descriptionEn: "Lettuce, bell peppers, cucumber, olives, tomato, lemon, olive oil, and feta cheese",
    basePrice: 30, discount: 10, categoryId: 105, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/greek-salad__3ogmuh9isdbt41n.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1053, nameAr: "سلطة جرجير", nameEn: "Arugula Salad", descriptionAr: "جرجير . بندورة شيري . بصل أحمر . ليمون . زيت زيتون . سماق", descriptionEn: "Arugula, cherry tomatoes, red onion, lemon, olive oil, and sumac",
    basePrice: 25, discount: 10, categoryId: 105, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/arugula-salad__pqxln7lhzdde5ww.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1054, nameAr: "سلطة حلومي", nameEn: "Halloumi Salad", descriptionAr: "خس . بندورة شيري . جبنة حلومي . صوص رانش", descriptionEn: "Lettuce, cherry tomatoes, halloumi cheese, and ranch dressing",
    basePrice: 35, discount: 10, categoryId: 105, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/halloumi-salad__4yk717hcdec5vqt.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1055, nameAr: "سلطة كينوا", nameEn: "Quinoa Salad", descriptionAr: "كينوا . بقدونس . عسل . دبس رمان . زيت زيتون . ليمون . كرانبري . جوز . أناناس", descriptionEn: "Quinoa, parsley, honey, pomegranate molasses, olive oil, lemon, cranberry, walnut, and pineapple",
    basePrice: 30, discount: 10, categoryId: 105, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/quinoa-salad__qr0exktqt76ov8j.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1056, nameAr: "سلطة فتوش", nameEn: "Fattoush Salad", descriptionAr: "خس ناعم . بندورة . خيار . فلفل . بصل أبيض . نعنع . خبز محمص . سماق . ملح . دبس رمان", descriptionEn: "Lettuce, tomato, cucumber, pepper, white onion, mint, fried bread, sumac, salt, and pomegranate molasses",
    basePrice: 30, discount: 10, categoryId: 105, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/fattoush-salad__oxjgflscdmor62d.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Cold Coffee (106)
  {
    id: 1061, nameAr: "سبانش لاتيه", nameEn: "Spanish Latte", descriptionAr: "بريك قهوة بارد ومنعش", descriptionEn: "Refreshing cold coffee break",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/spanish-latte__0j9ew7pi59r1fb6.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1062, nameAr: "آيس كابتشينو", nameEn: "Ice Cappuccino", descriptionAr: "كابتشينو مثلج مع رغوة كثيفة", descriptionEn: "Iced cappuccino with thick foam",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/iced-cappuccino__nh76n3rx78rmkfm.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1063, nameAr: "آيس لاتيه", nameEn: "Ice Latte", descriptionAr: "لاتيه كلاسيكي مثلج", descriptionEn: "Classic iced latte",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/iced-latte__igw1jlq8obg8clj.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1064, nameAr: "آيس كوفي", nameEn: "Ice Coffee", descriptionAr: "قهوة مثلجة منعشة", descriptionEn: "Refreshing iced coffee",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/iced-coffee__x9fwu0nnonmt1bf.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1065, nameAr: "آيس كارميل لاتيه", nameEn: "Ice Caramel Latte", descriptionAr: "لاتيه مثلج مع صوص الكارميل", descriptionEn: "Iced latte with caramel sauce",
    basePrice: 19, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/iced-caramel-latte__7s8czuyblnkgk6r.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1066, nameAr: "آيس أمريكانو", nameEn: "Ice Americano", descriptionAr: "أمريكانو كلاسيكي مثلج", descriptionEn: "Classic iced americano",
    basePrice: 16, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/iced-americano__2ignz0x5yz4sxhu.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1067, nameAr: "فرابتشينو", nameEn: "Frappuccino", descriptionAr: "مشروب فرابتشينو الغني", descriptionEn: "Rich frappuccino drink",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/frappuccino__11jotuwxtm2czjo.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1068, nameAr: "آيس موكا", nameEn: "Ice Mocha", descriptionAr: "موكا مثلجة بلمسة شوكولاتة", descriptionEn: "Iced mocha with a chocolate touch",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 8, isActive: true,
    imagePath: "/images/iced-mocha__shnp5dn9oggwun7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1069, nameAr: "آيس وايت موكا", nameEn: "Ice White Mocha", descriptionAr: "وايت موكا مثلجة", descriptionEn: "Iced white mocha",
    basePrice: 17, discount: 10, categoryId: 106, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/iced-white-mocha__rcg0h9ji0z1trnx.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Natural Smoothie (107)
  {
    id: 1071, nameAr: "سموذي طبيعي", nameEn: "Natural Smoothie", descriptionAr: "تشكيلة سموذي فواكه طبيعية", descriptionEn: "Assorted natural fruit smoothies",
    basePrice: 17, discount: 10, categoryId: 107, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    types: []
  },

  // Milkshake (108)
  {
    id: 1081, nameAr: "ميلك شيك", nameEn: "Milkshake", descriptionAr: "ميلك شيك غني بعدة نكهات", descriptionEn: "Rich milkshakes in various flavors",
    basePrice: 17, discount: 10, categoryId: 108, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    types: []
  },

  // Hot Drinks (109)
  {
    id: 1091, nameAr: "شاي", nameEn: "Tea", descriptionAr: "شاي كلاسيكي ساخن", descriptionEn: "Classic hot tea",
    basePrice: 8, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    types: []
  },
  {
    id: 1092, nameAr: "اسبريسو", nameEn: "Espresso", descriptionAr: "اسبريسو كلاسيكي", descriptionEn: "Classic espresso",
    basePrice: 8, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    types: []
  },
  {
    id: 1093, nameAr: "قهوة عربية", nameEn: "Arabic Coffee", descriptionAr: "قهوة عربية أصيلة", descriptionEn: "Authentic Arabic coffee",
    basePrice: 13, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/arabic-coffee__nrx56q4y8ik0dt1.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1094, nameAr: "أمريكانو", nameEn: "Americano", descriptionAr: "قهوة أمريكانو ساخنة", descriptionEn: "Hot Americano coffee",
    basePrice: 13, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/americano__ikrmozgl4db883m.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11412, nameAr: "أصابع موزاريلا", nameEn: "Mozzarella Sticks", descriptionAr: "أصابع جبنة موزاريلا مقلية", descriptionEn: "Deep fried mozzarella cheese sticks",
    basePrice: 4, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 12, isActive: true,
    imagePath: "/images/cheese-box__h2jnlaey0uea720.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1095, nameAr: "موكا", nameEn: "Mocha", descriptionAr: "مزيج ساخن من القهوة والكاكاو", descriptionEn: "Hot mix of coffee and cocoa",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/mocha__nruytezewx8c3t4.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1096, nameAr: "وايت موكا", nameEn: "White Mocha", descriptionAr: "موكا ساخنة بالشوكولاتة البيضاء", descriptionEn: "Hot white chocolate mocha",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/white-mocha__6ch77h9v3dnxy1k.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1097, nameAr: "كابتشينو", nameEn: "Cappuccino", descriptionAr: "كابتشينو كلاسيكي ساخن", descriptionEn: "Classic hot cappuccino",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/cappuccino__jzn3vtp7cja8809.webp", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1098, nameAr: "لاتيه", nameEn: "Latte", descriptionAr: "لاتيه كلاسيكي ساخن", descriptionEn: "Classic hot latte",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 8, isActive: true,
    imagePath: "/images/latte__kgf531y5zc8pm74.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1099, nameAr: "شاي لاتيه", nameEn: "Tea Latte", descriptionAr: "شاي بلمسة من الحليب", descriptionEn: "Tea with a milky touch",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/tea-latte__lciq1bb4qgw7zfi.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1100, nameAr: "بندق", nameEn: "Hazelnut Drink", descriptionAr: "مزيج ساخن بنكهة البندق", descriptionEn: "Hot mix with hazelnut flavor",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 10, isActive: true,
    imagePath: "/images/hazelnut__ru44q1bkipzkn48.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1101, nameAr: "هوت تشوكليت", nameEn: "Hot Chocolate", descriptionAr: "شوكولاتة ساخنة غنية", descriptionEn: "Rich hot chocolate",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 11, isActive: true,
    imagePath: "/images/hot-chocolate__v09sja0o7rcic8x.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1102, nameAr: "إيطاليان تشوكليت", nameEn: "Italian Chocolate", descriptionAr: "شوكولاتة إيطالية ساخنة كثيفة", descriptionEn: "Thick Italian hot chocolate",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 12, isActive: true,
    imagePath: "/images/italian-chocolate__x4nkeo37cxq9lab.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1103, nameAr: "مكس أعشاب", nameEn: "Herbal Mix", descriptionAr: "مزيج أعشاب برية ساخنة", descriptionEn: "Hot wild herbal mix",
    basePrice: 10, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 13, isActive: true,
    imagePath: "/images/herbal-mix__7hokmq4lw78tzn6.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1104, nameAr: "سبانش لاتيه", nameEn: "Hot Spanish Latte", descriptionAr: "سبانش لاتيه ساخن", descriptionEn: "Hot Spanish latte",
    basePrice: 16, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 14, isActive: true,
    imagePath: "/images/spanish-latte__8tnujlrujxfzigl.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1105, nameAr: "نسكافيه", nameEn: "Nescafe", descriptionAr: "نسكافيه كلاسيكي ساخن", descriptionEn: "Classic hot Nescafe",
    basePrice: 13, discount: 10, categoryId: 109, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 15, isActive: true,
    imagePath: "/images/nescafe__quyge4un0omih97.webp", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Desserts (110)
  {
    id: 1106, nameAr: "وافل مع آيس كريم", nameEn: "Waffle with Ice Cream", descriptionAr: "وافل ساخن يقدم مع الآيس كريم", descriptionEn: "Hot waffle served with ice cream",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/waffle-with-ice-cream__x29z7g0cy8sbot9.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1107, nameAr: "كريب مع شوكولاتة", nameEn: "Crepe with Chocolate", descriptionAr: "كريب محشو بالشوكولاتة", descriptionEn: "Crepe filled with chocolate",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/crepe-with-chocolate__6lfwdup297e7hd5.webp", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1108, nameAr: "سوفليه مع بوظة", nameEn: "Souffle with Ice Cream", descriptionAr: "سوفليه شوكولاتة ساخن مع الآيس كريم", descriptionEn: "Hot chocolate souffle with ice cream",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/souffle-with-ice-cream__o375y0v76qe0ehb.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1109, nameAr: "آيس كريم", nameEn: "Ice Cream", descriptionAr: "3 سكوپ من نكهاتك المفضلة", descriptionEn: "3 scoops of your favorite flavors",
    basePrice: 15, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/ice-cream__ve92ex3v6cb5ol6.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1110, nameAr: "سان سباستيان تشيز كيك", nameEn: "San Sebastian Cheesecake", descriptionAr: "تشيز كيك سان سباستيان الكريمي", descriptionEn: "Creamy San Sebastian cheesecake",
    basePrice: 30, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/san-sebastian-cheesecake__crjozhzu3bx2i1k.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1111, nameAr: "بلوبيري تشيز كيك", nameEn: "Blueberry Cheesecake", descriptionAr: "تشيز كيك بلمسة بلوبيري", descriptionEn: "Cheesecake with a blueberry touch",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/blueberry-cheesecake__163xoiwy7wlrfjb.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1112, nameAr: "لوتس تشيز كيك", nameEn: "Lotus Cheesecake", descriptionAr: "تشيز كيك بطبقة اللوتس", descriptionEn: "Cheesecake with a lotus layer",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/lotus-cheesecake__dy0dgdb9jiizmu3.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1113, nameAr: "تيراميسو", nameEn: "Tiramisu", descriptionAr: "حلى التيراميسو الإيطالي", descriptionEn: "Italian Tiramisu dessert",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 8, isActive: true,
    imagePath: "/images/tiramisu__sxnp971n4vv4o5k.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1114, nameAr: "تشوكليت كيك", nameEn: "Chocolate Cake", descriptionAr: "كيك شوكولاتة غني", descriptionEn: "Rich chocolate cake",
    basePrice: 22, discount: 10, categoryId: 110, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/chocolate-cake__xb561uywo403igv.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Cold Drinks (111)
  {
    id: 1111, nameAr: "كولا", nameEn: "Cola", descriptionAr: "علبة كولا", descriptionEn: "Cola Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/cola__f6o1p5tywou44t7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1112, nameAr: "كولا زيرو", nameEn: "Cola Zero", descriptionAr: "علبة كولا زيرو", descriptionEn: "Cola Zero Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/cola__f6o1p5tywou44t7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1113, nameAr: "كولا تشات", nameEn: "Cola Chat", descriptionAr: "علبة كولا تشات", descriptionEn: "Cola Chat Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/cola__f6o1p5tywou44t7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1114, nameAr: "كولا تشات زيرو", nameEn: "Cola Chat Zero", descriptionAr: "علبة كولا تشات زيرو", descriptionEn: "Cola Chat Zero Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/cola__f6o1p5tywou44t7.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1115, nameAr: "سبرايت دايت", nameEn: "Sprite Diet", descriptionAr: "علبة سبرايت دايت", descriptionEn: "Sprite Diet Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/sprite__i4s36gw3g0d9m6i.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1116, nameAr: "كابي", nameEn: "Cappy Juice", descriptionAr: "عصير كابي", descriptionEn: "Cappy Juice bottle",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/file-e09e95f3-e7b0-4c7e-8fc2-a0afa1d97e09.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1117, nameAr: "سبرايت", nameEn: "Sprite", descriptionAr: "علبة سبرايت", descriptionEn: "Sprite Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/file-043bfd7e-021f-4dbf-aed9-ff810cc95e49.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1118, nameAr: "فانتا", nameEn: "Fanta", descriptionAr: "علبة فانتا", descriptionEn: "Fanta Can",
    basePrice: 6, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 8, isActive: true,
    imagePath: "/images/fanta__qb9s0izcqjn38fr.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1119, nameAr: "ماء صغير", nameEn: "Small Water", descriptionAr: "زجاجة مياه صغيرة", descriptionEn: "Small water bottle",
    basePrice: 5, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/small-water__retkduxc2891b17.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1120, nameAr: "بفاريا", nameEn: "Bavaria", descriptionAr: "شراب بفاريا بر باردة", descriptionEn: "Cold Bavaria drink",
    basePrice: 8, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 10, isActive: true,
    imagePath: "/images/bavaria__g0tdpqe9yr51l45.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1121, nameAr: "صودا", nameEn: "Soda", descriptionAr: "ماء صودا", descriptionEn: "Soda water",
    basePrice: 8, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 11, isActive: true,
    imagePath: "/images/soda__28xcya6e1tmloih.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1122, nameAr: "XL", nameEn: "XL Energy Drink", descriptionAr: "مشروب طاقة XL", descriptionEn: "XL Energy Drink",
    basePrice: 8, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 12, isActive: true,
    imagePath: "/images/xl__l07thqasq1gfrd8.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1123, nameAr: "آيس فانيلا", nameEn: "Ice Vanilla", descriptionAr: "شراب منعش بنكهة الفانيلا", descriptionEn: "Refreshing ice vanilla drink",
    basePrice: 17, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 13, isActive: true,
    imagePath: "/images/iced-vanilla__cf85firw7etrfpb.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1124, nameAr: "آيس تي", nameEn: "Ice Tea", descriptionAr: "شاي مثلج منعش", descriptionEn: "Refreshing iced tea",
    basePrice: 17, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 14, isActive: true,
    imagePath: "/images/iced-tea__7xvf02dww34t6g9.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1125, nameAr: "آيس تشوكليت", nameEn: "Ice Chocolate", descriptionAr: "شوكولاتة مثلجة غنية", descriptionEn: "Rich iced chocolate",
    basePrice: 17, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 15, isActive: true,
    imagePath: "/images/iced-chocolate__n5gge2vfh6dvahl.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1126, nameAr: "موميتو", nameEn: "Mojito", descriptionAr: "موهيتو منعش للموميتو", descriptionEn: "Refreshing mojito drink",
    basePrice: 17, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 16, isActive: true,
    imagePath: "/images/mojito__dnldrs18pec0our.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1127, nameAr: "عصير", nameEn: "Juice", descriptionAr: "عصير فواكه طازج", descriptionEn: "Fresh fruit juice",
    basePrice: 15, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 17, isActive: true,
    imagePath: "/images/juice__xe7kdad5ruvmdwq.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1128, nameAr: "كوكتيل مع بوظة", nameEn: "Cocktail with Ice Cream", descriptionAr: "كوكتيل فواكه مع الآيس كريم", descriptionEn: "Fruit cocktail with ice cream",
    basePrice: 22, discount: 10, categoryId: 111, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 18, isActive: true,
    imagePath: "/images/cocktail-with-ice-cream__8drtk81n7t43qxa.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Hookah (112)
  {
    id: 1112, nameAr: "أرجيلة", nameEn: "Hookah", descriptionAr: "أرجيلة بنكهات متنوعة", descriptionEn: "Hookah with various flavors",
    basePrice: 30, discount: 10, categoryId: 112, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/shisha__3rtwtm1vhjem729.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [],
    types: []
  },

  // Burgers (113)
  {
    id: 1131, nameAr: "كلاسيك تشيز بيرجر", nameEn: "Classic Cheese Burger", descriptionAr: "120 غرام . جبنة تشيدر . خس . بندورة . بصل . صوص اب تاون", descriptionEn: "120g, cheddar, lettuce, tomato, onions, uptown sauce",
    basePrice: 25, discount: 10, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 1, isActive: true,
    imagePath: "/images/classic-cheeseburger__0x1e3y1qv68eiip.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1132, nameAr: "سماش بيرجر", nameEn: "Smash Burger", descriptionAr: "240 غرام . جبنة تشيدر . بندورة . بصل . صوص اب تاون", descriptionEn: "240g, double cheddar, tomato, onions, uptown sauce",
    basePrice: 35, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 2, isActive: true,
    imagePath: "/images/smashed-burger__f4vm70uiqpdg28s.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1133, nameAr: "باربيكيو بيرجر", nameEn: "BBQ Burger", descriptionAr: "150 غرام . خس . جبنة موزاريلا . مخلل . بصل . باربيكيو . صوص اب تاون", descriptionEn: "150g, mozzarella, pickles, onions, bbq sauce, uptown sauce",
    basePrice: 25, discount: 10, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 3, isActive: true,
    imagePath: "/images/bbq-burger__qw0nxdtpwc5rbst.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1134, nameAr: "سويس مشروم بيرجر", nameEn: "Swiss Mushroom Burger", descriptionAr: "150 غرام . جبنة سويسرية . خس . بندورة . بصل . مشروم. مخلل . صوص اب تاون", descriptionEn: "150g, swiss cheese, lettuce, tomato, mushroom, onions, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 4, isActive: true,
    imagePath: "/images/swiss-mushroom-burger__txtxxp1aifr4j8i.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1135, nameAr: "مشروم بيرجر", nameEn: "Mushroom Burger", descriptionAr: "150 غرام . مشروم. خس . بندورة . بصل . مخلل . صوص اب تاون", descriptionEn: "150g, mushroom, lettuce, tomato, pickles, onions, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/mushroom-burger__s07zohznm42itsy.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1136, nameAr: "مشروم وايت صوص بيرجر", nameEn: "Mushroom White Sauce Burger", descriptionAr: "150 غرام . مشروم. وايت صوص . خس . بندورة . بصل . اب تاون صوص", descriptionEn: "150g, mushroom, white sauce, lettuce, tomato, onions, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/mushroom-white-sauce-burger__4w37ua1o61radfn.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1137, nameAr: "مكسيكانو بيرجر", nameEn: "Mexicano Burger", descriptionAr: "150 غرام . خس . جبنة تشيدر . بندورة . بصل . هالبينو . صوص مكسيكي", descriptionEn: "150g, cheddar, tomato, onions, jalapeno, mexican sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/mexicano-burger__l76kbi9btmcrvey.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1138, nameAr: "أسايدو بيرجر", nameEn: "Asado Burger", descriptionAr: "150 غرام . قطع لحم بقري فاخر مطهو لأكثر من 5 ساعات . خس . بندورة . بصل مشوي", descriptionEn: "150g slow-cooked beef bits, lettuce, tomato, grilled onions",
    basePrice: 36, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 8, isActive: true,
    imagePath: "/images/asado-burger__2m81wutgpbyhv9z.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1139, nameAr: "ريب أي بيرجر", nameEn: "Ribeye Burger", descriptionAr: "150 غرام . قطعة كلاسيك . شرائح ستيك ريب أي 60 غرام . خس . بندورة . بصل . جبنة", descriptionEn: "150g patty + ribeye strips, lettuce, tomato, onions, cheese",
    basePrice: 45, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/ribeye-burger__8w4my5hb4xqt6zg.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1140, nameAr: "أرابيكا بيرجر", nameEn: "Arabica Burger", descriptionAr: "150 غرام . مكس من لحم الخاروف والعجل . خس . بندورة . بصل . مخلل . صوص", descriptionEn: "150g lamb/veal mix, lettuce, tomato, onions, pickles, sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 10, isActive: true,
    imagePath: "/images/arabica-burger__18bxeuobojgdvh9.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1141, nameAr: "بلو تشيز بيرجر", nameEn: "Blue Cheese Burger", descriptionAr: "150 غرام . بلو تشيز . عسل . مكسرات . خس . بندورة . بصل . مخلل . صوص اب تاون", descriptionEn: "150g, blue cheese, honey, nuts, lettuce, tomato, onions, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 11, isActive: true,
    imagePath: "/images/blue-cheese-burger__n6kolhf4bmk2o6c.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1142, nameAr: "فرايد ايغ بيرجر", nameEn: "Fried Egg Burger", descriptionAr: "150 غرام . بيض مقلي . جبنة تشيدر . خس . بندورة . بصل . مخلل . صوص اب تاون", descriptionEn: "150g, fried egg, cheddar, lettuce, tomato, onions, pickles, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 12, isActive: true,
    imagePath: "/images/fried-egg-burger__40j1tpwdob2wmoy.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1143, nameAr: "ستيك بيرجر", nameEn: "Steak Burger", descriptionAr: "150 غرام . قطعة كلاسيك . شرائح ستيك فيليه 60 غرام . خس . بندورة . بصل . مخلل", descriptionEn: "150g patty + fillet strips, lettuce, tomato, onions, pickles",
    basePrice: 36, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 13, isActive: true,
    imagePath: "/images/steak-burger__e825653zpga0dw0.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1144, nameAr: "دجاج كريسبي بيرجر", nameEn: "Crispy Chicken Burger", descriptionAr: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", descriptionEn: "150g crispy chicken, lettuce, tomato, pickles, uptown sauce",
    basePrice: 25, discount: 10, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 14, isActive: true,
    imagePath: "/images/crispy-chicken-burger__49g1si6flsxx82w.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1145, nameAr: "دجاج مشوي بيرجر", nameEn: "Grilled Chicken Burger", descriptionAr: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون", descriptionEn: "150g grilled chicken, lettuce, tomato, pickles, uptown sauce",
    basePrice: 25, discount: 10, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 15, isActive: true,
    imagePath: "/images/grilled-chicken-burger__bm22lgyfrl1ixtx.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1146, nameAr: "نباتي بيرجر", nameEn: "Vegetarian Burger", descriptionAr: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون . صوص رانش . جبنة حلومي", descriptionEn: "150g vegetable patty, lettuce, tomato, onions, pickles, halloumi cheese",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 16, isActive: true,
    imagePath: "/images/vegetarian-burger__h0no3tubpyaxbs0.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1147, nameAr: "بصل مكرمل بيرجر", nameEn: "Caramellized Onion Burger", descriptionAr: "150 غرام . خس . بندورة . بصل . مخلل . صوص اب تاون . بصل مكرمل", descriptionEn: "150g, lettuce, tomato, onions, pickles, caramelized onion, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 17, isActive: true,
    imagePath: "/images/caramelized-onion-burger__rpouw9135aroh54.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 1148, nameAr: "هاواين بيرجر", nameEn: "Hawaiian Burger", descriptionAr: "150 غرام . خس . بندورة . قطعتين أناناس . مخلل . صوص اب تاون", descriptionEn: "150g, lettuce, tomato, pineapple rings (2), pickles, uptown sauce",
    basePrice: 30, discount: 0, categoryId: 113, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 18, isActive: true,
    imagePath: "/images/hawaiian-burger__ev2mcri9z6vgqev.jpg", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },

  // Appetizers (114)
  {
    id: 11405, nameAr: "حلقات بصل", nameEn: "Onion Rings", descriptionAr: "ثمانية حلقات بصل مقلية مقرمشة", descriptionEn: "Eight crispy fried onion rings",
    basePrice: 10, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 5, isActive: true,
    imagePath: "/images/onion-rings__h7c0z7e9sc37r4j.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11406, nameAr: "بطاطا مقلية", nameEn: "French Fries", descriptionAr: "بطاطا مقلية كلاسيكية", descriptionEn: "Classic crispy french fries",
    basePrice: 7, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 6, isActive: true,
    imagePath: "/images/french-fries__c5eiz0v8y8m9ihc.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11407, nameAr: "علبة جبنة", nameEn: "Cheese Cup", descriptionAr: "علبة صوص الجبنة الغنية", descriptionEn: "Rich cheese sauce cup",
    basePrice: 5, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 7, isActive: true,
    imagePath: "/images/cheese-box__h2jnlaey0uea720.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11408, nameAr: "بطاطا", nameEn: "Specialty Potato", descriptionAr: "بطاطا اب تاون الخاصة", descriptionEn: "Special Uptown style potatoes",
    basePrice: 12, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 8, isActive: true,
    imagePath: "/images/specialty-potato__8b3q7u0970t9n9s.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11409, nameAr: "فرينش فانيلا", nameEn: "French Vanilla", descriptionAr: "مشروب بنكهة الفانيلا الفرنسية", descriptionEn: "French vanilla flavored drink",
    basePrice: 15, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: false, hasDonenessOption: false, sortOrder: 9, isActive: true,
    imagePath: "/images/iced-vanilla__cf85firw7etrfpb.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11410, nameAr: "فيليه تشيز ستيك", nameEn: "Philly Cheese Steak", descriptionAr: "180 غرام . لحم عجل فيليه مشوي . جبنة تشيدر . جبنة موزاريلا . صوص رانش . فلفل", descriptionEn: "180g veal fillet, cheddar, mozzarella, ranch, peppers",
    basePrice: 36, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 10, isActive: true,
    imagePath: "/images/philly-cheesesteak__7f59d0v89t5x0ou.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  },
  {
    id: 11411, nameAr: "تورتيلا دجاج مقلي مقرمش", nameEn: "Crispy Chicken Tortilla", descriptionAr: "140 غرام . كريسبي راب او مشوي . خس . مخلل . بصل . صوص مكسيكي . صوص اب تاون", descriptionEn: "140g crispy/grilled chicken, lettuce, pickles, onions, mexican sauce",
    basePrice: 18, discount: 10, categoryId: 114, branchId: null, allBranches: true, hasMealOption: true, hasDonenessOption: false, sortOrder: 11, isActive: true,
    imagePath: "/images/crispy-chicken-tortilla__8f8rsw0xpv9z5rk.jpg",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sizes: [], types: []
  }
];

export const mockAddonGroups = [
  {
    id: 1, nameAr: "الحجم", nameEn: "Size", categoryId: 113, productId: null, groupType: "sizes", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 101, nameAr: "120 غرام", nameEn: "120g", price: 25, sortOrder: 1, isActive: true },
      { id: 102, nameAr: "150 غرام", nameEn: "150g", price: 27, sortOrder: 2, isActive: true },
      { id: 103, nameAr: "240 غرام", nameEn: "240g", price: 35, sortOrder: 3, isActive: true },
      { id: 104, nameAr: "300 غرام", nameEn: "300g", price: 40, sortOrder: 4, isActive: true }
    ]
  },
  {
    id: 2, nameAr: "النوع", nameEn: "Type", categoryId: 113, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 2, isActive: true,
    items: [
      { id: 201, nameAr: "بيرجر", nameEn: "Burger", price: 0, sortOrder: 1, isActive: true },
      { id: 202, nameAr: "وجبة (مع بطاطا ومشروب غازي)", nameEn: "Meal (Fries & Drink)", price: 9, sortOrder: 2, isActive: true }
    ]
  },
  {
    id: 3, nameAr: "➕ الإضافات", nameEn: "Addons", categoryId: 113, productId: null, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 3, isActive: true,
    items: [
      { id: 301, nameAr: "قطعة لحمة 120 غرام", nameEn: "Extra Meat 120g", price: 12, sortOrder: 1, isActive: true },
      { id: 302, nameAr: "قطعة لحمة 150 غرام", nameEn: "Extra Meat 150g", price: 15, sortOrder: 2, isActive: true },
      { id: 303, nameAr: "بورشن ريب آي", nameEn: "Ribeye Portion", price: 15, sortOrder: 3, isActive: true },
      { id: 304, nameAr: "بورشن فيليه", nameEn: "Fillet Portion", price: 12, sortOrder: 4, isActive: true },
      { id: 305, nameAr: "جبنة على البرغر", nameEn: "Extra Cheese", price: 3, sortOrder: 5, isActive: true },
      { id: 306, nameAr: "بصل مكرمل", nameEn: "Caramelized Onion", price: 3, sort_order: 6, isActive: true },
      { id: 307, nameAr: "ماشروم", nameEn: "Mushroom", price: 3, sort_order: 7, isActive: true },
      { id: 308, nameAr: "خبز خالي من الجلوتين", nameEn: "Gluten Free Bread", price: 5, sort_order: 8, isActive: true },
      { id: 309, nameAr: "أفوكادو", nameEn: "Avocado", price: 5, sort_order: 9, isActive: true },
      { id: 310, nameAr: "هالبينو", nameEn: "Jalapeno", price: 3, sort_order: 10, isActive: true },
      { id: 311, nameAr: "أصبعين موزاريلا", nameEn: "2 Mozzarella Sticks", price: 8, sort_order: 11, isActive: true },
      { id: 312, nameAr: "3 حلقات بصل", nameEn: "3 Onion Rings", price: 5, sort_order: 12, isActive: true },
      { id: 313, nameAr: "وايت صوص", nameEn: "White Sauce", price: 5, sort_order: 13, isActive: true }
    ]
  },
  {
    id: 4, nameAr: "🚫 بدون", nameEn: "Without", categoryId: 113, productId: null, groupType: "without", isRequired: false, allowMultiple: true, sortOrder: 4, isActive: true,
    items: [
      { id: 401, nameAr: "مخلل", nameEn: "Pickles", price: 0, sortOrder: 1, isActive: true },
      { id: 402, nameAr: "بندورة", nameEn: "Tomato", price: 0, sortOrder: 2, isActive: true },
      { id: 403, nameAr: "بصل", nameEn: "Onion", price: 0, sortOrder: 3, isActive: true },
      { id: 404, nameAr: "جبنة", nameEn: "Cheese", price: 0, sortOrder: 4, isActive: true },
      { id: 405, nameAr: "خس", nameEn: "Lettuce", price: 0, sortOrder: 5, isActive: true },
      { id: 406, nameAr: "صوص", nameEn: "Sauce", price: 0, sortOrder: 6, isActive: true }
    ]
  },
  {
    id: 5, nameAr: "🥤 اختر المشروب (مطلوب – للوجبة فقط)", nameEn: "Select Drink", categoryId: 113, productId: null, groupType: "MealDrink", isRequired: true, allowMultiple: false, sortOrder: 5, isActive: true,
    items: [
      { id: 501, nameAr: "كولا", nameEn: "Cola", price: 0, sortOrder: 1, isActive: true },
      { id: 502, nameAr: "كولا زيرو", nameEn: "Cola Zero", price: 0, sortOrder: 2, isActive: true },
      { id: 503, nameAr: "فانتا", nameEn: "Fanta", price: 0, sortOrder: 3, isActive: true },
      { id: 504, nameAr: "سبرايت", nameEn: "Sprite", price: 0, sortOrder: 4, isActive: true },
      { id: 505, nameAr: "سبرايت دايت", nameEn: "Sprite Diet", price: 0, sortOrder: 5, isActive: true },
      { id: 506, nameAr: "كابي", nameEn: "Cappy", price: 0, sortOrder: 6, isActive: true },
      { id: 507, nameAr: "ماء", nameEn: "Water", price: 0, sortOrder: 7, isActive: true },
      { id: 508, nameAr: "كولا تشات", nameEn: "Cola Chat", price: 0, sortOrder: 8, isActive: true },
      { id: 509, nameAr: "كولا تشات زيرو", nameEn: "Cola Chat Zero", price: 0, sortOrder: 9, isActive: true },
      { id: 510, nameAr: "سبرايت تشات", nameEn: "Sprite Chat", price: 0, sortOrder: 10, isActive: true }
    ]
  },
  {
    id: 6, nameAr: "🔄 تبديل المشروب", nameEn: "Swap Drink", categoryId: 113, productId: null, groupType: "MealDrinkUpgrade", isRequired: false, allowMultiple: false, sortOrder: 6, isActive: true,
    items: [
      { id: 601, nameAr: "XL", nameEn: "XL", price: 4, sortOrder: 1, isActive: true },
      { id: 602, nameAr: "بافاريا", nameEn: "Bavaria", price: 4, sortOrder: 2, isActive: true },
      { id: 603, nameAr: "صودا", nameEn: "Soda", price: 4, sortOrder: 3, isActive: true }
    ]
  },
  {
    id: 7, nameAr: "🍟 تبديل البطاطا", nameEn: "Swap Fries", categoryId: 113, productId: null, groupType: "MealFries", isRequired: false, allowMultiple: false, sortOrder: 7, isActive: true,
    items: [
      { id: 701, nameAr: "كيرلي", nameEn: "Curly Fries", price: 5, sortOrder: 1, isActive: true },
      { id: 702, nameAr: "ويدجز", nameEn: "Wedges", price: 5, sortOrder: 2, isActive: true },
      { id: 703, nameAr: "بطاطا حلوة", nameEn: "Sweet Potato", price: 5, sortOrder: 3, isActive: true },
      { id: 704, nameAr: "كرات بطاطا", nameEn: "Potato Balls", price: 5, sortOrder: 4, isActive: true }
    ]
  },
  // Sandwiches (101) - Meal Groups
  {
    id: 8, nameAr: "النوع", nameEn: "Type", categoryId: 101, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 801, nameAr: "ساندويش", nameEn: "Sandwich", price: 0, sortOrder: 1, isActive: true },
      { id: 802, nameAr: "وجبة (مع بطاطا ومشروب غازي)", nameEn: "Meal (Fries & Drink)", price: 9, sortOrder: 2, isActive: true }
    ]
  },
  {
    id: 9, nameAr: "🥤 اختر المشروب (مطلوب – للوجبة فقط)", nameEn: "Select Drink", categoryId: 101, productId: null, groupType: "MealDrink", isRequired: true, allowMultiple: false, sortOrder: 3, isActive: true,
    items: [
      { id: 901, nameAr: "كولا", nameEn: "Cola", price: 0, sortOrder: 1, isActive: true },
      { id: 902, nameAr: "كولا زيرو", nameEn: "Cola Zero", price: 0, sortOrder: 2, isActive: true },
      { id: 903, nameAr: "فانتا", nameEn: "Fanta", price: 0, sortOrder: 3, isActive: true },
      { id: 904, nameAr: "سبرايت", nameEn: "Sprite", price: 0, sortOrder: 4, isActive: true },
      { id: 905, nameAr: "سبرايت دايت", nameEn: "Sprite Diet", price: 0, sortOrder: 5, isActive: true },
      { id: 906, nameAr: "كابي", nameEn: "Cappy", price: 0, sortOrder: 6, isActive: true },
      { id: 907, nameAr: "ماء", nameEn: "Water", price: 0, sortOrder: 7, isActive: true },
      { id: 908, nameAr: "كولا تشات", nameEn: "Cola Chat", price: 0, sortOrder: 8, isActive: true },
      { id: 909, nameAr: "كولا تشات زيرو", nameEn: "Cola Chat Zero", price: 0, sortOrder: 9, isActive: true },
      { id: 910, nameAr: "سبرايت تشات", nameEn: "Sprite Chat", price: 0, sortOrder: 10, isActive: true }
    ]
  },
  {
    id: 10, nameAr: "🍟 تبديل البطاطا", nameEn: "Swap Fries", categoryId: 101, productId: null, groupType: "MealFries", isRequired: false, allowMultiple: false, sortOrder: 4, isActive: true,
    items: [
      { id: 1001, nameAr: "كيرلي", nameEn: "Curly Fries", price: 5, sortOrder: 1, isActive: true },
      { id: 1002, nameAr: "ويدجز", nameEn: "Wedges", price: 5, sortOrder: 2, isActive: true },
      { id: 1003, nameAr: "بطاطا حلوة", nameEn: "Sweet Potato", price: 5, sortOrder: 3, isActive: true },
      { id: 1004, nameAr: "كرات بطاطا", nameEn: "Potato Balls", price: 5, sortOrder: 4, isActive: true }
    ]
  },
  {
    id: 12, nameAr: "🔄 تبديل المشروب", nameEn: "Swap Drink", categoryId: 101, productId: null, groupType: "MealDrinkUpgrade", isRequired: false, allowMultiple: false, sortOrder: 5, isActive: true,
    items: [
      { id: 1201, nameAr: "XL", nameEn: "XL", price: 4, sortOrder: 1, isActive: true },
      { id: 1202, nameAr: "بافاريا", nameEn: "Bavaria", price: 4, sortOrder: 2, isActive: true },
      { id: 1203, nameAr: "صودا", nameEn: "Soda", price: 4, sortOrder: 3, isActive: true }
    ]
  },
  {
    id: 11, nameAr: "بدون", nameEn: "Without", categoryId: 101, productId: null, groupType: "without", isRequired: false, allowMultiple: true, sortOrder: 6, isActive: true,
    items: [
      { id: 1101, nameAr: "مخلل", nameEn: "Pickles", price: 0, sortOrder: 1, isActive: true },
      { id: 1102, nameAr: "بندورة", nameEn: "Tomato", price: 0, sortOrder: 2, isActive: true },
      { id: 1103, nameAr: "بصل", nameEn: "Onion", price: 0, sortOrder: 3, isActive: true },
      { id: 1104, nameAr: "جبنة", nameEn: "Cheese", price: 0, sortOrder: 4, isActive: true },
      { id: 1105, nameAr: "خس", nameEn: "Lettuce", price: 0, sortOrder: 5, isActive: true },
      { id: 1106, nameAr: "صوص", nameEn: "Sauce", price: 0, sortOrder: 6, isActive: true }
    ]
  },
  // Sandwiches (101)
  {
    id: 5, nameAr: "➕ الإضافات", nameEn: "Addons", categoryId: 101, productId: null, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 1, isActive: true,
    items: [
      { id: 501, nameAr: "قطعة لحمة 120 غرام", nameEn: "Extra Meat 120g", price: 12, sortOrder: 1, isActive: true },
      { id: 502, nameAr: "قطعة لحمة 150 غرام", nameEn: "Extra Meat 150g", price: 15, sortOrder: 2, isActive: true },
      { id: 503, nameAr: "بورشن ريب آي", nameEn: "Ribeye Portion", price: 15, sortOrder: 3, isActive: true },
      { id: 504, nameAr: "بورشن فيليه", nameEn: "Fillet Portion", price: 12, sortOrder: 4, isActive: true },
      { id: 505, nameAr: "جبنة على البرغر", nameEn: "Extra Cheese", price: 3, sortOrder: 5, isActive: true },
      { id: 506, nameAr: "بصل مكرمل", nameEn: "Caramelized Onion", price: 3, sortOrder: 6, isActive: true },
      { id: 507, nameAr: "ماشروم", nameEn: "Mushroom", price: 3, sortOrder: 7, isActive: true },
      { id: 508, nameAr: "خبز خالي من الجلوتين", nameEn: "Gluten Free Bread", price: 5, sortOrder: 8, isActive: true },
      { id: 509, nameAr: "أفوكادو", nameEn: "Avocado", price: 5, sortOrder: 9, isActive: true },
      { id: 510, nameAr: "هالبينو", nameEn: "Jalapeno", price: 3, sortOrder: 10, isActive: true },
      { id: 511, nameAr: "أصبعين موزاريلا", nameEn: "2 Mozzarella Sticks", price: 8, sortOrder: 11, isActive: true },
      { id: 512, nameAr: "3 حلقات بصل", nameEn: "3 Onion Rings", price: 5, sortOrder: 12, isActive: true },
      { id: 513, nameAr: "وايت صوص", nameEn: "White Sauce", price: 5, sortOrder: 13, isActive: true }
    ]
  },
  {
    id: 6, nameAr: "🚫 بدون", nameEn: "Without", categoryId: 101, productId: null, groupType: "without", isRequired: false, allowMultiple: true, sortOrder: 2, isActive: true,
    items: [
      { id: 601, nameAr: "مخلل", nameEn: "Pickles", price: 0, sortOrder: 1, isActive: true },
      { id: 602, nameAr: "بندورة", nameEn: "Tomato", price: 0, sortOrder: 2, isActive: true },
      { id: 603, nameAr: "بصل", nameEn: "Onion", price: 0, sortOrder: 3, isActive: true },
      { id: 604, nameAr: "جبنة", nameEn: "Cheese", price: 0, sortOrder: 4, isActive: true },
      { id: 605, nameAr: "خس", nameEn: "Lettuce", price: 0, sortOrder: 5, isActive: true },
      { id: 606, nameAr: "صوص", nameEn: "Sauce", price: 0, sortOrder: 6, isActive: true }
    ]
  },
  // Wings (103)
  {
    id: 7, nameAr: "اختر الصوص", nameEn: "Select Sauce", categoryId: 103, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 701, nameAr: "بافالو", nameEn: "Buffalo", price: 0, sortOrder: 1, isActive: true },
      { id: 702, nameAr: "باربيكيو", nameEn: "BBQ", price: 0, sortOrder: 2, isActive: true },
      { id: 703, nameAr: "هني ماسترد", nameEn: "Honey Mustard", price: 0, sortOrder: 3, isActive: true }
    ]
  },
  // Desserts (110)
  {
    id: 8, nameAr: "إضافات الحلويات", nameEn: "Dessert Addons", categoryId: 110, productId: null, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 1, isActive: true,
    items: [
      { id: 801, nameAr: "سكوپ بوظة إضافي", nameEn: "Extra Ice Cream Scoop", price: 5, sortOrder: 1, isActive: true },
      { id: 802, nameAr: "شوكولاتة نوتيلا إضافية", nameEn: "Extra Nutella", price: 5, sortOrder: 2, isActive: true },
      { id: 803, nameAr: "صوص لوتس", nameEn: "Lotus Sauce", price: 5, sortOrder: 3, isActive: true }
    ]
  },
  // Appetizers (114)
  {
    id: 9, nameAr: "صوص جانبي", nameEn: "Side Sauce", categoryId: 114, productId: null, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 1, isActive: true,
    items: [
      { id: 901, nameAr: "صوص حار", nameEn: "Spicy Sauce", price: 3, sortOrder: 1, isActive: true },
      { id: 902, nameAr: "صوص الثوم", nameEn: "Garlic Sauce", price: 3, sortOrder: 2, isActive: true },
      { id: 903, nameAr: "صوص الجبنة", nameEn: "Cheese Sauce", price: 5, sortOrder: 3, isActive: true }
    ]
  },
  // Main Meals (102)
  {
    id: 10, nameAr: "إضافات", nameEn: "Addons", categoryId: 102, productId: null, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 1, isActive: true,
    items: [
      { id: 1001, nameAr: "صحن أرز", nameEn: "Rice Plate", price: 10, sortOrder: 1, isActive: true }
    ]
  },
  {
    id: 11, nameAr: "درجة الاستواء", nameEn: "Doneness", categoryId: 102, productId: null, groupType: "Doneness", isRequired: true, allowMultiple: false, sortOrder: 2, isActive: true,
    items: [
      { id: 1101, nameAr: "ميديوم", nameEn: "Medium", price: 0, sortOrder: 1, isActive: true },
      { id: 1102, nameAr: "ميديوم ويل", nameEn: "Medium Well", price: 0, sortOrder: 2, isActive: true },
      { id: 1103, nameAr: "ويل دون", nameEn: "Well Done", price: 0, sortOrder: 3, isActive: true }
    ]
  },
  {
    id: 12, nameAr: "النوع", nameEn: "Type", categoryId: 102, productId: 1021, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 3, isActive: true,
    items: [
      { id: 1201, nameAr: "مع ثوم و ليمون", nameEn: "With Garlic and Lemon", price: 0, sortOrder: 1, isActive: true },
      { id: 1202, nameAr: "مع وايت صوص", nameEn: "With White Sauce", price: 0, sortOrder: 2, isActive: true }
    ]
  },
  // Wings (103)
  {
    id: 13, nameAr: "الحجم", nameEn: "Size", categoryId: 103, productId: null, groupType: "sizes", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 1301, nameAr: "١٠ قطع", nameEn: "10 Pieces", price: 13, sortOrder: 1, isActive: true },
      { id: 1302, nameAr: "٢٠ قطعة", nameEn: "20 Pieces", price: 25, sortOrder: 2, isActive: true }
    ]
  },
  // Kids Meals (104)
  {
    id: 14, nameAr: "النوع", nameEn: "Type", categoryId: 104, productId: 1042, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 1401, nameAr: "مشوي", nameEn: "Grilled", price: 0, sortOrder: 1, isActive: true },
      { id: 1402, nameAr: "مقلي", nameEn: "Fried", price: 0, sortOrder: 2, isActive: true }
    ]
  },
  // Appetizers (114) - Mozzarella
  {
    id: 15, nameAr: "إضافات", nameEn: "Addons", categoryId: 114, productId: 11401, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 1, isActive: true,
    items: [
      { id: 1501, nameAr: "+1", nameEn: "+1", price: 4, sortOrder: 1, isActive: true }
    ]
  },
  // Cold Drinks (111) - Juice
  {
    id: 16, nameAr: "النوع", nameEn: "Type", categoryId: 111, productId: 1127, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 1601, nameAr: "برتقال", nameEn: "Orange", price: 0, sortOrder: 1, isActive: true },
      { id: 1602, nameAr: "ليمون", nameEn: "Lemon", price: 0, sortOrder: 2, isActive: true },
      { id: 1603, nameAr: "ليمون و نعنع", nameEn: "Lemon & Mint", price: 0, sortOrder: 3, isActive: true }
    ]
  },
  // Natural Smoothie (107)
  {
    id: 17, nameAr: "النوع", nameEn: "Type", categoryId: 107, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 1701, nameAr: "فراولة", nameEn: "Strawberry", price: 0, sortOrder: 1, isActive: true },
      { id: 1702, nameAr: "مانجا", nameEn: "Mango", price: 0, sortOrder: 2, isActive: true },
      { id: 1703, nameAr: "اناناس", nameEn: "Pineapple", price: 0, sortOrder: 3, isActive: true },
      { id: 1704, nameAr: "مانجا مع اناناس", nameEn: "Mango & Pineapple", price: 0, sortOrder: 4, isActive: true },
      { id: 1705, nameAr: "مانجا مع مسفلورا", nameEn: "Mango & Passion Fruit", price: 0, sortOrder: 5, isActive: true },
      { id: 1706, nameAr: "بينك ليموند", nameEn: "Pink Lemonade", price: 0, sortOrder: 6, isActive: true }
    ]
  },
  // Milkshake (108)
  {
    id: 18, nameAr: "النوع", nameEn: "Type", categoryId: 108, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 1801, nameAr: "فراولة", nameEn: "Strawberry", price: 0, sortOrder: 1, isActive: true },
      { id: 1802, nameAr: "فانيلا", nameEn: "Vanilla", price: 0, sortOrder: 2, isActive: true },
      { id: 1803, nameAr: "اوريو", nameEn: "Oreo", price: 0, sortOrder: 3, isActive: true },
      { id: 1804, nameAr: "لوتس", nameEn: "Lotus", price: 0, sortOrder: 4, isActive: true },
      { id: 1805, nameAr: "تشوكليت", nameEn: "Chocolate", price: 0, sortOrder: 5, isActive: true },
      { id: 1806, nameAr: "كوفي كراش", nameEn: "Coffee Crush", price: 0, sortOrder: 6, isActive: true }
    ]
  },
  // Hot Drinks (109)
  {
    id: 19, nameAr: "النوع", nameEn: "Type", categoryId: 109, productId: 1092, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 1901, nameAr: "سنجل", nameEn: "Single", price: 0, sortOrder: 1, isActive: true },
      { id: 1902, nameAr: "دبل", nameEn: "Double", price: 4, sortOrder: 2, isActive: true }
    ]
  },
  {
    id: 20, nameAr: "النوع", nameEn: "Type", categoryId: 109, productId: 1091, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 2, isActive: true,
    items: [
      { id: 2001, nameAr: "عادي", nameEn: "Regular", price: 0, sortOrder: 1, isActive: true },
      { id: 2002, nameAr: "أخضر", nameEn: "Green", price: 0, sortOrder: 2, isActive: true }
    ]
  },
  // Hookah (112)
  {
    id: 21, nameAr: "النوع", nameEn: "Type", categoryId: 112, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 2101, nameAr: "ليمون و نعنع", nameEn: "Lemon & Mint", price: 0, sortOrder: 1, isActive: true },
      { id: 2102, nameAr: "تفاحتين", nameEn: "Two Apples", price: 0, sortOrder: 2, isActive: true },
      { id: 2103, nameAr: "مسكة و قرفة", nameEn: "Mastic & Cinnamon", price: 0, sortOrder: 3, isActive: true },
      { id: 2104, nameAr: "بلوبري", nameEn: "Blueberry", price: 0, sortOrder: 4, isActive: true },
      { id: 2105, nameAr: "بطيخ و نعنع", nameEn: "Watermelon & Mint", price: 0, sortOrder: 5, isActive: true },
      { id: 2106, nameAr: "تفاحتين نخلة", nameEn: "Palm Two Apples", price: 10, sortOrder: 6, isActive: true }
    ]
  },
  // Pasta (115)
  {
    id: 22, nameAr: "النوع", nameEn: "Type", categoryId: 115, productId: null, groupType: "types", isRequired: true, allowMultiple: false, sortOrder: 1, isActive: true,
    items: [
      { id: 2201, nameAr: "عادي", nameEn: "Regular", price: 0, sortOrder: 1, isActive: true },
      { id: 2202, nameAr: "حار", nameEn: "Spicy", price: 0, sortOrder: 2, isActive: true }
    ]
  },
  {
    id: 23, nameAr: "إضافات", nameEn: "Addons", categoryId: 115, productId: null, groupType: "addons", isRequired: false, allowMultiple: true, sortOrder: 2, isActive: true,
    items: [
      { id: 2301, nameAr: "دجاج", nameEn: "Chicken", price: 8, sortOrder: 1, isActive: true }
    ]
  }
];

export const mockSettings = {
  id: 1,
  siteName: "UPTOWN",
  siteNameAr: "أبتاون",
  logoUrl: null,
  currencySymbol: "₪",
  primaryColor: "#c8151d",
  secondaryColor: "#1a1a1a",
  footerText: "By Menuna",
  ogImageUrl: null,
  metaDescriptionAr: "أبتاون - مطعم برجر وساندويتشات فاخرة",
  metaDescriptionEn: "UPTOWN - Premium burgers and sandwiches restaurant",
  tiktokUrl: null,
  instagramUptownUrl: null,
  facebookUptownUrl: null,
  facebookPastaUrl: null,
  instagramPastaUrl: null,
  updatedAt: new Date().toISOString()
};

export const mockBanners = [
  {
    id: 1,
    name: "Banner 1",
    imagePath: "/images/panar1.jpeg",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Banner 2",
    imagePath: "/images/panar2.jpeg",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
