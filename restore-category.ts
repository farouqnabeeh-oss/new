import { getSupabaseAdmin } from "./src/lib/supabase";

async function restoreMainMeals() {
  const supabase = getSupabaseAdmin();

  console.log("🚀 Restoring 'Main Meals' Category...");

  // 1. Check if category already exists
  const { data: existingCat } = await supabase
    .from("categories")
    .select("id")
    .eq("name_ar", "وجبات رئيسية")
    .maybeSingle();

  let categoryId = existingCat?.id;

  if (!categoryId) {
    const { data: newCat, error: catErr } = await supabase
      .from("categories")
      .insert({
        name_ar: "وجبات رئيسية",
        name_en: "Main Meals",
        sort_order: 4,
        icon_class: "🍽️",
        is_active: true
      })
      .select()
      .single();

    if (catErr) {
      console.error("❌ Error creating category:", catErr);
      return;
    }
    categoryId = newCat.id;
    console.log("✅ Created Category 'Main Meals' with ID:", categoryId);
  } else {
    console.log("ℹ️ Category already exists with ID:", categoryId);
  }

  // 2. Ensure "Rice Plate" (صحن أرز) is linked and active
  const { data: existingPlate } = await supabase
    .from("products")
    .select("id")
    .eq("name_ar", "صحن أرز")
    .maybeSingle();

  if (existingPlate) {
    await supabase.from("products").update({ 
      category_id: categoryId, 
      is_active: true,
      all_branches: true 
    }).eq("id", existingPlate.id);
    console.log("✅ Updated existing 'Rice Plate' (ID: " + existingPlate.id + ") to link to category 3 and marked as global.");
  } else {
    const { error: prodErr } = await supabase
      .from("products")
      .insert({
        name_ar: "صحن أرز",
        name_en: "Rice Plate",
        description_ar: "صحن أرز جانبي",
        description_en: "Side rice plate",
        base_price: 15,
        discount: 0,
        category_id: categoryId,
        all_branches: true,
        is_active: true,
        sort_order: 1,
        image_path: "/images/chicken-fajita-with-rice__2re3bdsltsnwkzv.jpg"
      });

    if (prodErr) {
      console.error("❌ Error creating product:", prodErr);
    } else {
      console.log("✅ Created Product 'Rice Plate' (صحن أرز)");
    }
  }

  console.log("✨ Restore Complete!");
}

restoreMainMeals();
