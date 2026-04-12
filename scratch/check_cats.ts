import { getSupabaseAdmin } from "../src/lib/supabase";

async function check() {
  const supabase = getSupabaseAdmin();
  const { data: cats } = await supabase.from("categories").select("id, name_en, name_ar");
  console.log("Categories in DB:", JSON.stringify(cats, null, 2));
}

check();
