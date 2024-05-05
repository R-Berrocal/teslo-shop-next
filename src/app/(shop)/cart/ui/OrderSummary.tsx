'use client';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const { subTotal, tax, total, totalItems } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && totalItems === 0) {
      // Llama a redirect dentro de un useEffect separado
      redirect('/empty');
    }
  }, [loaded, totalItems]);

  if (!loaded) return <p>Cargando...</p>;

  return (
    loaded && (
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {totalItems} {totalItems > 1 ? 'articulos' : 'articulo'}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="text-2xl mt-5">Total: </span>
        <span className="text-2xl mt-5 text-right">
          {currencyFormat(total)}
        </span>
      </div>
    )
  );
};
