export const revalidate = 60; // 60 secondsre

import { Pagination, ProductGrid, Title } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { Gender } from '@prisma/client';

interface Props {
  params: {
    gender: Gender;
  };
  searchParams: {
    page?: string;
  };
}

const label: Record<Gender, string> = {
  men: 'Hombres',
  women: 'Mujeres',
  kid: 'Niños',
  unisex: 'Unisex',
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page) ?? 1;
  const { gender } = params;

  // if (!label[gender]) {
  //   notFound();
  // }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender,
  });

  return (
    <div>
      <Title
        title={`Articulos de ${label[gender]}`}
        subtitle={`productos para ${label[gender]}`}
        className="mb-2 px-3"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
