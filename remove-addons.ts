import { getSupabaseAdmin } from "./src/lib/supabase";

async function run() {
  const supabase = getSupabaseAdmin();
  
  // 1. Find the addon groups linked to Category 3 (وجبات رئيسية)
  const { data: groups, error } = await supabase
    .from("addon_groups")
    .select("id, name_ar, category_id")
    .eq("category_id", 3);

  if (error) {
    console.error("Error fetching groups:", error);
    return;
  }

  console.log("Groups in Category 3:", JSON.stringify(groups, null, 2));

  // 2. Identify target groups and deactivate them or remove category link
  const targetNames = ["أرز إضافي", "خبز إضافي", "صوص إضافي"];
  const idsToProcess = groups
    .filter(g => targetNames.some(name => g.name_ar?.includes(name)))
    .map(g => g.id);

  if (idsToProcess.length === 0) {
    console.log("No matching groups found to delete.");
    return;
  }

  console.log("Processing IDs:", idsToProcess);

  // Deactivate them so they don't show up
  const { error: updateError } = await supabase
    .from("addon_groups")
    .update({ is_active: false, category_id: null })
    .in("id", idsToProcess);

  if (updateError) {
    console.error("Error updating groups:", updateError);
  } else {
    console.log("Addon groups removed/deactivated successfully.");
  }
}

run();
