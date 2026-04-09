import { NextResponse } from "next/server";
import { getCategories } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchSlug = searchParams.get("branchSlug");
  const categories = await getCategories(branchSlug);

  return NextResponse.json(
    categories.map((category) => ({
      id: category.id,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      branchId: category.branchId,
      sortOrder: category.sortOrder,
      iconClass: category.iconClass,
      productCount: category.productCount ?? 0
    }))
  );
}
