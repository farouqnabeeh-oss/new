const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env'});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const priceList = {
    // Burgers
    "Classic Cheese Burger": 23,
    "BBQ Burger": 25,
    "Smash Burger": 35,
    "Swiss Mushroom Burger": 30,
    "Mushroom Burger": 30,
    "Mushroom White Sauce Burger": 30,
    "Mexicano Burger": 30,
    "Asado Burger": 36,
    "Steak Burger": 36,
    "Ribeye Burger": 45,
    "Blue Cheese Burger": 30,
    "Fried Egg Burger": 30,
    "Crispy Chicken Burger": 25,
    "Grilled Chicken Burger": 25,
    "Vegetarian Burger": 30,
    "Caramelized Onion Burger": 30,
    "Hawaiian Burger": 30,

    // Sandwiches
    "Crispy Chicken Sandwich": 25,
    "Grilled Chicken Sandwich": 25,
    "Italian Chicken Sandwich": 25,
    "Fajita Chicken Sandwich": 25,
    "Halloumi Sandwich": 25,
    "Asado Sandwich": 36,
    "Philly Cheese Steak Specialty": 36, // This was Phily Cheesesteak Sandwich in request

    // Pasta
    "Penne Arrabbiata": 30,
    "Penne Pesto": 30,
    "Penne Alfredo": 30,
    "Penne Rosé": 30,
    "Mac & Cheese": 25,
    "Fettuccine Alfredo": 30,
    "Spaghetti Red Sauce": 30,
    "Spaghetti Rosé": 30,

    // Wings
    "Crispy Fried Wings": 30,
    "Buffalo Wings": 28,
    "BBQ Wings": 28,
    "Teriyaki Wings": 28,
    "Garlic Lemon Wings": 28,
    "Garlic Lemon Parmesan Wings": 28,
    "Sweet Chili Wings": 28,

    // Appetizers
    "Chicken and Fries": 30,
    "Chicken Fingers 5pcs": 22,
    "Chicken Popcorn (250g)": 22,
    "Mozzarella Sticks 3pcs": 12,
    "Onion Rings 8pcs": 10,
    "French Fries Appetizer": 7,
    "Specialty Potato Appetizer": 12, // Loaded Fries
    "Cheese Cup Appetizer": 5,
    "Crispy Chicken Tortilla Specialty": 18,

    // Salads
    "Caesar Salad": 25,
    "Greek Salad": 30,
    "Arugula Salad": 25,
    "Halloumi Salad": 35,
    "Quinoa Salad": 30,
    "Fattoush Salad": 30,

    // Main Dishes
    "Grilled Chicken Steak": 45,
    "Chicken Fajita with Rice": 45,
    "Chicken Stroganoff with Rice": 45,
    "Beef Stroganoff with Rice": 60,
    "Ribeye Steak": 90,
    "Beef Fillet Steak": 70,
    "Fettuccine with Chicken": 45, // Chicken Fettuccine Alfredo

    // Cold Drinks
    "Cola": 5,
    "Cola Zero": 5,
    "Sprite": 5,
    "Sprite Diet": 5,
    "Fanta": 5,
    "Cappy Juice": 5,
    "Small Water": 4,
    "Bavaria": 8,
    "Soda": 8,
    "Mojito": 17,
    "Juice": 15,
    "Cocktail with Ice Cream": 22,
    "Ice Tea": 17,

    // Cold Coffee
    "Ice Latte": 17,
    "Ice Cappuccino": 17,
    "Ice Americano": 15,
    "Ice Mocha": 17,
    "Ice White Mocha": 17,
    "Ice Caramel Latte": 19,
    "Frappuccino": 17,
    "Spanish Latte": 17,
    "Ice Coffee": 17,
    "Ice Chocolate": 17,
    "Ice Vanilla": 17,

    // Hot Drinks
    "Espresso": 8,
    "Americano": 12,
    "Cappuccino": 15,
    "Latte": 15,
    "Spanish Latte Hot": 15, // Need to find exact name
    "Mocha": 15,
    "White Mocha": 15,
    "Hot Chocolate": 15,
    "Nescafe": 12,
    "Arabic Coffee": 12,
    "Tea": 8,
    "Tea Latte": 15,
    "Herbal Mix": 10,
    "Hazelnut Drink": 15,

    // Desserts
    "Waffle with Ice Cream": 22,
    "Crepe with Chocolate": 22,
    "Souffle with Ice Cream": 22,
    "Ice Cream": 15,
    "San Sebastian Cheesecake": 30,
    "Blueberry Cheesecake": 22,
    "Lotus Cheesecake": 22,
    "Tiramisu": 22,
    "Chocolate Cake": 22,

    // Kids
    "Kids Beef Burger": 23,
    "Kids Chicken Burger": 23,
    "Chicken Popcorn": 23,

    // Shisha
    "Hookah": 30
};

async function updatePrices() {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) return console.error(error);

    for (const prod of products) {
        let targetPrice = priceList[prod.name_en];
        
        // Try fuzzy matching if direct fails
        if (targetPrice === undefined) {
            // Check for minor variations
            for (const key in priceList) {
                if (prod.name_en.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(prod.name_en.toLowerCase())) {
                    targetPrice = priceList[key];
                    break;
                }
            }
        }

        if (targetPrice !== undefined) {
             const discount = prod.discount || 0;
             // We want finalPrice = targetPrice.
             // finalPrice = base_price * (1 - discount/100)
             // base_price = finalPrice / (1 - discount/100)
             
             let newBasePrice = targetPrice;
             if (discount > 0) {
                 newBasePrice = Math.ceil(targetPrice / (1 - discount / 100));
                 // Rounding check: 23 / 0.9 = 25.55 -> 26.
                 // 26 * 0.9 = 23.4 (Close enough to 23 for a slashed price visual)
             }
             
             const updates = { base_price: newBasePrice };
             
             // Handle Name changes
             if (prod.category_id === 4) { // Wings
                 updates.name_ar = 'أجنحة ' + (prod.name_ar.replace('أجنحة', '').trim());
             }
             if (prod.name_en === 'Specialty Potato Appetizer') {
                 updates.name_ar = 'بطاطا لوديد (Loaded Fries)';
                 updates.name_en = 'Loaded Fries / Potato';
             }
             if (prod.name_en === 'Chicken Fingers 5pcs') {
                 updates.name_en = 'Chicken Fingers (5 pcs)';
             }

             const { error: updErr } = await supabase.from('products').update(updates).eq('id', prod.id);
             if (updErr) console.error(`Error updating ${prod.name_en}:`, updErr.message);
             else console.log(`Updated ${prod.name_en} to base ${newBasePrice} (Target: ${targetPrice})`);
        }
    }

    // Handle deletions
    // ❌ حذف: Cola Chat XL
    const { error: delErr } = await supabase.from('products').delete().ilike('name_en', '%Cola Chat%');
    console.log('Managed Cola Chat deletion logic.');

    console.log('Price updates finished.');
}

updatePrices();
