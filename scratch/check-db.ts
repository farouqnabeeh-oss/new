import { getSupabaseAdmin } from "../src/lib/supabase";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkDB() {
    console.log("Connecting to Supabase...");
    const supabase = getSupabaseAdmin();
    
    const { count: catCount, error: catError } = await supabase.from("categories").select("*", { count: 'exact', head: true });
    const { count: prodCount, error: prodError } = await supabase.from("products").select("*", { count: 'exact', head: true });
    const { data: branches, error: branchError } = await supabase.from("branches").select("name_en");

    if (catError || prodError || branchError) {
        console.error("Error fetching data:", catError || prodError || branchError);
        return;
    }

    console.log("Total Categories in DB:", catCount);
    console.log("Total Products in DB:", prodCount);
    console.log("Branches in DB:", branches?.map(b => b.name_en).join(", "));
    
    // Check if site_settings has data
    const { data: settings } = await supabase.from("site_settings").select("*").limit(1);
    console.log("Site Settings found:", settings && settings.length > 0 ? "Yes" : "No");
}

checkDB();
