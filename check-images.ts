import { getSupabaseAdmin } from "./src/lib/supabase";

async function check() {
  const supabase = getSupabaseAdmin();
  const { data: prods } = await supabase.from("products").select("*").eq("category_id", 3);
  console.log("--- CAT 3 PRODUCTS ---");
  prods?.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name_ar}, Image: ${p.image_path}`);
  });
}

check();
