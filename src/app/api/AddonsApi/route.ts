import { NextResponse } from 'next/server';
import { getAddonGroups } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const productId = searchParams.get('productId');

  if (!categoryId && !productId) {
    return NextResponse.json('Either categoryId or productId is required.', { status: 400 });
  }

  const groups = await getAddonGroups(
    categoryId ? Number(categoryId) : null,
    productId ? Number(productId) : null
  );

  return NextResponse.json(
    groups.map(group => ({
      id: group.id,
      nameAr: group.nameAr,
      nameEn: group.nameEn,
      productId: group.productId,
      groupType: group.groupType,
      isRequired: group.isRequired,
      allowMultiple: group.allowMultiple,
      items: group.items.map(item => ({
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        price: item.price
      }))
    }))
  );
}
