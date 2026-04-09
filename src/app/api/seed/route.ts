import { NextResponse } from "next/server";
import { seedRestaurantData } from "@/lib/seed-data";

export async function GET() {
    try {
        await seedRestaurantData();
        return NextResponse.json({ success: true, message: "Data seeded successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
