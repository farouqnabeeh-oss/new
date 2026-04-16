import { getSupabaseAdmin } from "./src/lib/supabase";

async function run() {
  const supabase = getSupabaseAdmin();
  
  console.log("Restoring Main Meals Category...");
  
  // 1. Activate Category 3
  const { error: catError } = await supabase
    .from("categories")
    .update({ is_active: true })
    .eq("id", 3);
  
  if (catError) console.error("Error activating category:", catError);
  else console.log("Category 3 activated.");

  // 2. Activate all products in Category 3 and set all_branches = true
  const { error: prodError } = await supabase
    .from("products")
    .update({ is_active: true, all_branches: true })
    .eq("category_id", 3);

  if (prodError) console.error("Error activating products:", prodError);
  else console.log("Products in Category 3 activated.");

  // 3. Fix Rice Plate ( صحن أرز ) Image (ID 1308)
  const { error: imgError } = await supabase
    .from("products")
    .update({ 
      image_path: "/images/chicken-fajita-with-rice__2re3bdsltsnwkzv.jpg" 
    })
    .eq("id", 1308);

  if (imgError) console.error("Error updating Rice Plate image:", imgError);
  else console.log("Rice Plate image updated.");

  console.log("Database Restoration Complete.");
}

run();
