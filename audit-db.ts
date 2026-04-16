import { getSupabaseAdmin } from "./src/lib/supabase";

async function check() {
  const supabase = getSupabaseAdmin();
  
  // 1. Check Settings
  const { data: settings } = await supabase.from("settings").select("*").single();
  console.log("--- SITE SETTINGS ---");
  console.log(settings);

  // 2. Check Categories
  const { data: cats } = await supabase.from("categories").select("*").eq("id", 3);
  console.log("\n--- CATEGORY 3 ---");
  console.log(cats);

  // 3. Check Products in Cat 3
  const { data: prods } = await supabase.from("products").select("*").eq("category_id", 3);
  console.log("\n--- CAT 3 PRODUCTS ---");
  prods?.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name_ar}, Image: ${p.image_path}, Active: ${p.is_active}`);
  });
}

check();
