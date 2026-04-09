// ===== Language Module =====
const TRANSLATIONS = {
    ar: {
        // UI & General
        welcomeTitle: 'مرحباً بكم في UPTOWN',
        selectBranch: 'اختر الفرع',
        selectBranchSub: 'اختر الفرع الأقرب لك',
        menu: 'المنيو',
        size: 'الحجم',
        type: 'النوع',
        addOns: 'الإضافات',
        without: 'بدون',
        doneness: 'درجة النضج',
        mealOption: 'عرض الوجبة',
        chooseDrink: 'اختر المشروب',
        changeDrink: 'تغيير المشروب',
        changeFries: 'تغيير البطاطا',
        addToCart: 'أضف للسلة',
        save: 'حفظ',
        cart: 'سلة المشتريات',
        emptyCart: 'السلة فارغة',
        continueShopping: 'متابعة التسوق',
        quantity: 'الكمية',
        subtotal: 'المجموع الفرعي',
        total: 'الإجمالي',
        edit: 'تعديل',
        delete: 'حذف',
        checkout: 'إتمام الطلب',
        orderType: 'نوع الطلب',
        inRestaurant: 'داخل المطعم',
        delivery: 'توصيل',
        name: 'الاسم',
        phone: 'رقم الهاتف',
        address: 'العنوان',
        tableNumber: 'رقم الطاولة',
        pickup: 'استلام',
        notes: 'ملاحظات',
        addNote: 'أضف ملاحظة',
        placeOrder: 'تأكيد الطلب عبر واتساب',
        price: 'السعر',
        discount: 'خصم',
        search: 'بحث...',
        noProducts: 'لا توجد منتجات',
        loading: 'جاري التحميل...',
        required: 'مطلوب',
        optional: 'اختياري',
        pickupTime: 'وقت الاستلام',

        // Navigation
        navHome: 'الرئيسية',
        navBranches: 'الفروع',
        navAbout: 'من نحن',
        navContact: 'تواصل معنا',
        orderNow: 'اطلب الآن',

        // Footer
        footerDesc: 'تجربة طعام عالمية تنبع من قلب فلسطين. أبتون تجمع بين الجودة، الفخامة، والمذاق الأصيل لنصنع لك ذكريات لا تُنسى.',
        quickLinks: 'روابط سريعة',
        support: 'الدعم والمعلومات',
        privacy: 'سياسة الخصوصية',
        returnPolicy: 'سياسة الإرجاع والتبديل',
        faq: 'الأسئلة الشائعة',
        paymentMethods: 'وسائل الدفع',
        developedBy: 'تم التطوير بكل ❤️ بواسطة',
        allRightsReserved: 'جميع الحقوق محفوظة لشركة أبتون كافيه.',

        // Home Page
        heroTag: 'فن المذاق',
        heroTitle: 'نصنع السعادة في كل وجبة',
        heroSub: 'اكتشف مذاقاً لا يُنسى مع تشكيلتنا الواسعة من البرجر والساندوتشات المعدة بكل حب وشغف في قلب رام الله.',
        exploreBranches: 'استكشف فروعنا',
        ourStory: 'قصتنا',
        aboutUptown: 'عن أبتون',
        storyTitle: 'شغف بالتميز لا يعرف الحدود',
        storyDesc: 'في أبتون، نحن لا نقدم مجرد وجبات، بل نصنع ذكريات. بدأت رحلتنا من قلب مدينة رام الله، مدفوعة بالرغبة في تحويل كل لقمة إلى احتفال بالحواس.',
        mealsServed: 'وجبة قدمت بكل حب',
        distinguishedBranches: 'فروع متميزة تخدمكم',
        bestInPalestine: 'الأفضل في فلسطين',
        ourDestinations: 'وجهاتنا',
        exceptionalBranches: 'فروعنا الاستثنائية',
        chooseBranchSub: 'اختر فرعك المفضل وانطلق في رحلة مذاق لا يُنسى',
        
        // Features
        qualityIngredients: 'جودة المكونات',
        qualityDesc: 'نستخدم أجود أنواع اللحوم الطازجة والخضروات المختارة بعناية يومياً لنضمن لك طعماً لا يضاهى.',
        fastDelivery: 'توصيل فائق السرعة',
        deliveryDesc: 'نعدك بوصول طلبك ساخناً وطازجاً في أقصر وقت ممكن من خلال أسطول توصيل محترف.',
        exceptionalExp: 'تجربة استثنائية',
        experienceDesc: 'من اللحظة الأولى للطلب وحتى آخر لقمة، نحن هنا لنضمن لك تجربة طعام استثنائية بكل معانيها.',

        // Branch Grid
        openNow: 'مفتوح الآن',
        closedNow: 'مغلق حالياً',
        ramallah: 'رام الله',
        city: 'رام الله',
    },
    en: {
        // UI & General
        welcomeTitle: 'Welcome to UPTOWN',
        selectBranch: 'Select Branch',
        selectBranchSub: 'Choose the nearest branch to you',
        menu: 'Menu',
        size: 'Size',
        type: 'Type',
        addOns: 'Add-ons',
        without: 'Without',
        doneness: 'Doneness',
        mealOption: 'Meal Offer',
        chooseDrink: 'Choose Drink',
        changeDrink: 'Change Drink',
        changeFries: 'Change Fries',
        addToCart: 'Add to Cart',
        save: 'Save',
        cart: 'Shopping Cart',
        emptyCart: 'Your cart is empty',
        continueShopping: 'Continue Shopping',
        quantity: 'Quantity',
        subtotal: 'Subtotal',
        total: 'Total',
        edit: 'Edit',
        delete: 'Delete',
        checkout: 'Complete Order',
        orderType: 'Order Type',
        inRestaurant: 'In Restaurant',
        delivery: 'Delivery',
        name: 'Name',
        phone: 'Phone',
        address: 'Address',
        tableNumber: 'Table Number',
        pickup: 'Pickup',
        notes: 'Notes',
        addNote: 'Add a note',
        placeOrder: 'Confirm Order via WhatsApp',
        price: 'Price',
        discount: 'Discount',
        search: 'Search...',
        noProducts: 'No products found',
        loading: 'Loading...',
        required: 'Required',
        optional: 'Optional',
        pickupTime: 'Pickup Time',

        // Navigation
        navHome: 'Home',
        navBranches: 'Branches',
        navAbout: 'About Us',
        navContact: 'Contact Us',
        orderNow: 'Order Now',

        // Footer
        footerDesc: 'A global dining experience from the heart of Palestine. Uptown combines quality, luxury, and authentic taste to create unforgettable memories.',
        quickLinks: 'Quick Links',
        support: 'Support & Information',
        privacy: 'Privacy Policy',
        returnPolicy: 'Return & Exchange Policy',
        faq: 'FAQ',
        paymentMethods: 'Payment Methods',
        developedBy: 'Developed with ❤️ by',
        allRightsReserved: 'All rights reserved to Uptown Cafe.',

        // Home Page
        heroTag: 'The Art of Flavor',
        heroTitle: 'Crafting Happiness in Every Meal',
        heroSub: 'Discover an unforgettable taste with our wide selection of burgers and sandwiches, prepared with love and passion in the heart of Ramallah.',
        exploreBranches: 'Explore Branches',
        ourStory: 'Our Story',
        aboutUptown: 'About Uptown',
        storyTitle: 'Unbounded Passion for Excellence',
        storyDesc: 'At Uptown, we don\'t just serve meals; we create memories. Our journey began in the heart of Ramallah, driven by the desire to turn every bite into a celebration of the senses.',
        mealsServed: 'Meals served with love',
        distinguishedBranches: 'Distinguished branches serving you',
        bestInPalestine: 'The Best in Palestine',
        ourDestinations: 'Our Destinations',
        exceptionalBranches: 'Our Exceptional Branches',
        chooseBranchSub: 'Choose your favorite branch and embark on an unforgettable taste journey',

        // Features
        qualityIngredients: 'Ingredient Quality',
        qualityDesc: 'We use the finest fresh meats and carefully selected vegetables daily to guarantee an unparalleled taste.',
        fastDelivery: 'Ultra-Fast Delivery',
        deliveryDesc: 'We promise your order arrives hot and fresh as quickly as possible through a professional delivery fleet.',
        exceptionalExp: 'Exceptional Experience',
        experienceDesc: 'From the first moment of ordering until the last bite, we are here to ensure an exceptional dining experience.',

        // Branch Grid
        openNow: 'Open Now',
        closedNow: 'Currently Closed',
        ramallah: 'Ramallah',
        city: 'Ramallah',
    }
};

const Lang = {
    _getCookie(name) {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },

    _setCookie(name, value) {
        if (typeof document === 'undefined') return;
        const d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()};SameSite=Lax`;
    },

    _lang: null,
    _listeners: [],

    get current() { 
        if (!this._lang) {
            this._lang = this._getCookie('language') || (typeof localStorage !== 'undefined' ? localStorage.getItem('language') : 'ar') || 'ar';
        }
        return this._lang; 
    },
    get isAr() { return this.current === 'ar'; },

    t(key) {
        return TRANSLATIONS[this.current]?.[key] || key;
    },

    toggle() {
        const newLang = this.current === 'ar' ? 'en' : 'ar';
        this._lang = newLang;
        this._setCookie('language', newLang);
        if (typeof localStorage !== 'undefined') localStorage.setItem('language', newLang);
        this._apply();
        this._listeners.forEach(fn => fn(newLang));
        // Force reload to update all server-rendered content
        window.location.reload();
    },

    onChange(fn) { this._listeners.push(fn); },

    _apply() {
        if (typeof document === 'undefined') return;
        const lang = this.current;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        const btnAr = document.getElementById('lang-toggle-ar');
        const btnEn = document.getElementById('lang-toggle-en');
        
        if (btnAr && btnEn) {
            btnAr.classList.toggle('active', lang === 'ar');
            btnEn.classList.toggle('active', lang === 'en');
        }

        // Translate all elements with data-t attribute
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (TRANSLATIONS[lang][key]) {
                el.textContent = TRANSLATIONS[lang][key];
            }
        });
    },

    init() {
        this._apply();
        const btnAr = document.getElementById('lang-toggle-ar');
        const btnEn = document.getElementById('lang-toggle-en');
        
        if (btnAr) btnAr.addEventListener('click', () => { if(this.current !== 'ar') this.toggle(); });
        if (btnEn) btnEn.addEventListener('click', () => { if(this.current !== 'en') this.toggle(); });
    },

    localized(ar, en) {
        return this.current === 'ar' ? (ar || en) : (en || ar);
    }
};

if (typeof window !== 'undefined') {
    window.Lang = Lang;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Lang.init(), { once: true });
    } else {
        Lang.init();
    }
}

// Export for server use if needed in later architecture (though currently used via script tags)
if (typeof module !== 'undefined') module.exports = { TRANSLATIONS, Lang };
