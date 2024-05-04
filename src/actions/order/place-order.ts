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
  { country, ...address }: Address
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
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);
      if (!product) throw new Error(`${item.productId} not found - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;
      return totals;
    },
    {
      subTotal: 0,
      tax: 0,
      total: 0,
    }
  );

  // Crear la transaccion
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        //Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, product) => acc + product.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar valores negativos en las existencias = no hay stock

      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock suficiente`);
        }
      });

      // 2. Crear la ordern - Encabezado - Detalle
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map(({ productId, quantity, size }) => ({
                quantity,
                size,
                productId,
                price:
                  products.find((product) => product.id === productId)?.price ??
                  0,
              })),
            },
          },
        },
      });

      // Validar, si el price es cero, entonces, lanzar un error
      // 3. Crear la direccion de la orden

      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          countryId: country,
          ...address,
        },
      });
      return {
        order,
        updatedProducts,
        orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
