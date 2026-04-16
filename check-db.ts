import { getSupabaseAdmin } from "./src/lib/supabase";

async function checkDatabase() {
  const supabase = getSupabaseAdmin();
  
  console.log("--- CATEGORIES ---");
  const { data: cats } = await supabase.from("categories").select("*").order("sort_order");
  console.table(cats?.map(c => ({ id: c.id, name_ar: c.name_ar, is_active: c.is_active })));

  console.log("\n--- PRODUCTS ---");
  const { data: prods } = await supabase.from("products").select("id, name_ar, category_id, is_active").order("id");
  console.table(prods?.map(p => ({ id: p.id, name_ar: p.name_ar, category_id: p.category_id, is_active: p.is_active })));
  
  console.log("\n--- ADDON GROUPS ---");
  const { data: groups } = await supabase.from("addon_groups").select("id, name_ar, is_required, allow_multiple");
  console.table(groups?.map(g => ({ id: g.id, name_ar: g.name_ar, is_required: g.is_required })));
}

checkDatabase();
