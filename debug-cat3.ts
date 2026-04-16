import { getSupabaseAdmin } from "./src/lib/supabase";

async function checkCategory3() {
  const supabase = getSupabaseAdmin();
  
  console.log("--- CATEGORY 3 INFO ---");
  const { data: cat } = await supabase.from("categories").select("*").eq("id", 3).maybeSingle();
  console.log("CATEGORY 3:", cat);

  console.log("\n--- PRODUCTS IN CATEGORY 3 ---");
  const { data: prods } = await supabase.from("products").select("*").eq("category_id", 3);
  console.log("PRODUCTS COUNT:", prods?.length);
  prods?.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name_ar}, Active: ${p.is_active}, CategoryID: ${p.category_id}`);
  });
}

checkCategory3();
