import { getSupabaseAdmin } from "../src/lib/supabase";

async function cleanup() {
  const supabase = getSupabaseAdmin();
  console.log("Deleting 'ramallah' branch...");
  const { error } = await supabase
    .from("branches")
    .delete()
    .eq("slug", "ramallah");
    
  if (error) {
    console.error("Error deleting branch:", error);
  } else {
    console.log("Branch 'ramallah' deleted successfully.");
  }
}

cleanup();
