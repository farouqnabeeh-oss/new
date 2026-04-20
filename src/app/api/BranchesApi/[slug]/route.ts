import { NextResponse } from "next/server";
import { getBranchBySlug } from "@/lib/data";

// هذا السطر هو الحل لمنع الخطأ أثناء الـ Build في Next.js 15
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    // في Next.js 15 يجب عمل await لـ params
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

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
  } catch (error) {
    console.error("Error in BranchesApi:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}