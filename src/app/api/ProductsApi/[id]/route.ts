import { NextResponse } from "next/server";
import { getProductById } from "@/lib/data";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    descriptionAr: product.descriptionAr,
    descriptionEn: product.descriptionEn,
    basePrice: product.basePrice,
    discount: product.discount,
    imagePath: product.imagePath,
    categoryId: product.categoryId,
    branchId: product.branchId,
    categoryNameAr: product.categoryNameAr,
    categoryNameEn: product.categoryNameEn,
    allBranches: product.allBranches,
    hasMealOption: product.hasMealOption,
    hasDonenessOption: product.hasDonenessOption,
    sortOrder: product.sortOrder,
    isActive: product.isActive,
    sizes: product.sizes.map((size: any) => ({
      id: size.id,
      nameAr: size.nameAr,
      nameEn: size.nameEn,
      price: size.price
    })),
    types: product.types.map((type: any) => ({
      id: type.id,
      nameAr: type.nameAr,
      nameEn: type.nameEn,
      price: type.price,
      description: type.description
    })),
    addonGroups: (product as any).addonGroups?.map((group: any) => ({
      id: group.id,
      nameAr: group.nameAr,
      nameEn: group.nameEn,
      groupType: group.groupType,
      isRequired: group.isRequired,
      allowMultiple: group.allowMultiple,
      items: group.items.map((item: any) => ({
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        price: item.price
      }))
    })),

    simpleAddons: (product.simpleAddons || []).map((addon: any) => ({   // ← أضف هاد
      id: addon.id,
      nameAr: addon.nameAr,
      nameEn: addon.nameEn,
      price: addon.price
    })),
    branchDiscounts: (product as any).branchDiscounts || {}
  });
}
