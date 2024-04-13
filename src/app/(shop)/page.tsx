export const revalidate = 60; // 60 seconds

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: {
    page?: string;
    take?: string;
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const page = Number(searchParams.page) ?? 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  if (products.length === 0) {
    redirect('/');
  }
  return (
    <main>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2 px-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </main>
  );
}
