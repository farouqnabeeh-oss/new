import { NextResponse } from "next/server";
import { getBranchBySlug } from "@/lib/data";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: branch.id,
    slug: branch.slug,
    nameAr: branch.nameAr,
    nameEn: branch.nameEn,
    phone: branch.phone,
    whatsApp: branch.whatsApp,
    bannerImagePath: branch.bannerImagePath,
    discountPercent: branch.discountPercent
  });
}
