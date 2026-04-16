import { getSupabaseAdmin } from "./src/lib/supabase";

async function run() {
  const supabase = getSupabaseAdmin();
  
  // 1. Fetch all items in Category 3's groups
  const { data: groups } = await supabase.from("addon_groups").select("id").eq("category_id", 3);
  if (!groups) return;
  const groupIds = groups.map(g => g.id);

  const { data: items, error } = await supabase
    .from("addon_group_items")
    .select("id, name_ar, addon_group_id")
    .in("addon_group_id", groupIds);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Found items in Category 3 groups:", JSON.stringify(items, null, 2));

  // 2. Identify target items
  const targetNames = ["أرز إضافي", "خبز إضافي", "صوص إضافي"];
  const idsToRemove = items
    .filter(i => targetNames.some(name => i.name_ar?.includes(name)))
    .map(i => i.id);

  if (idsToRemove.length === 0) {
    console.log("No matching items found.");
    return;
  }

  console.log("Deleting items:", idsToRemove);

  // 3. Delete or deactivate
  const { error: deleteError } = await supabase
    .from("addon_group_items")
    .delete()
    .in("id", idsToRemove);

  if (deleteError) {
    console.error("Delete Error:", deleteError);
  } else {
    console.log("Successfully removed the specified addons.");
  }
}

run();
