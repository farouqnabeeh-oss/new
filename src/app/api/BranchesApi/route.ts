import { NextResponse } from "next/server";
import { getActiveBranches } from "@/lib/data";

export async function GET() {
  const branches = await getActiveBranches();
  return NextResponse.json(
    branches.map((branch) => ({
      id: branch.id,
      slug: branch.slug,
      nameAr: branch.nameAr,
      nameEn: branch.nameEn,
      phone: branch.phone,
      whatsApp: branch.whatsApp,
      bannerImagePath: branch.bannerImagePath,
      discountPercent: branch.discountPercent
    }))
  );
}
