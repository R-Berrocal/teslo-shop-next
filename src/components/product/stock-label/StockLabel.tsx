'use client';
import { getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts';
import { useEffect, useState } from 'react';

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStock();
  });

  const getStock = async () => {
    const inStock = await getStockBySlug(slug);
    setStock(inStock);
    setIsLoading(false);
  };

  console.log(stock);
  return (
    <>
      {isLoading ? (
        // LoadingSkeleton
        <h1
          className={`${titleFont.className} antialiased text-lg font-bold animate-pulse bg-gray-200`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased text-lg font-bold`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
