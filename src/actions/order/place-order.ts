'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import type { Address, Size } from '@/interfaces';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  //Verificar sesion de usuario
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesion de usuario',
    };
  }

  //Obtener la infomracion de los productos
  // Nota: recordar que podemos llevar 2+ productos con el mismo ID

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  });

  // Calcular los montos
  const itemsInOrder = productIds.reduce(
    (count, product) => count + product.quantity,
    0
  );

  // Los totales de tax, subTotal, total
  const { subtotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);
      if (!product) throw new Error(`${item.productId} not found - 500`);

      const subtotal = product.price * productQuantity;

      totals.subtotal += subtotal;
      totals.tax += subtotal * 0.15;
      totals.total += subtotal * 1.15;
      return totals;
    },
    {
      subtotal: 0,
      tax: 0,
      total: 0,
    }
  );

  // Crear la transaccion

};
