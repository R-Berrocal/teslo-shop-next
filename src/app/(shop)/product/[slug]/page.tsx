export const revalidate = 10080; //7 days

import { Metadata, ResolvingMetadata } from 'next';

import { titleFont } from '@/config/fonts';
import { notFound } from 'next/navigation';
import {
  ProductSlideShow,
  ProductSlideShowMobile,
  StockLabel,
} from '@/components';
import { getProductBySlug } from '@/actions';
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  return {
    metadataBase: new URL('http://localhost:3000'),
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid-cols-1 grid md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">
        {/* Slideshow Mobile */}
        <ProductSlideShowMobile
          className="block md:hidden"
          images={product.images}
          title={product.title}
        />

        {/* Slideshow Desktop*/}
        <ProductSlideShow
          className="hidden md:block"
          images={product.images}
          title={product.title}
        />
      </div>
      {/* Details */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />
        <h1 className={`${titleFont.className} antialiased text-xl font-bold`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
