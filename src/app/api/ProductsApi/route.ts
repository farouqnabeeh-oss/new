import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";
import { ProductSize, ProductType } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchSlug = searchParams.get("branchSlug");
  const categoryId = searchParams.get("categoryId");
  const products = await getProducts(branchSlug, categoryId ? Number(categoryId) : null);

  return NextResponse.json(
    products.map((product) => ({
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
      allBranches: product.allBranches,
      hasMealOption: product.hasMealOption,
      hasDonenessOption: product.hasDonenessOption,
      sortOrder: product.sortOrder,
      isActive: product.isActive,
      sizes: (product.sizes || []).map((size: ProductSize) => ({
        id: size.id,
        nameAr: size.nameAr,
        nameEn: size.nameEn,
        price: size.price
      })),
      types: (product.types || []).map((type: ProductType) => ({
        id: type.id,
        nameAr: type.nameAr,
        nameEn: type.nameEn,
        price: type.price,
        description: type.description
      }))
    }))
  );
}
