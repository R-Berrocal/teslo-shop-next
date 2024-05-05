'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            id: true,
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error(`${id} no existe`);
    }

    if (session.user.role === 'user' && order.userId !== session.user.id) {
      throw new Error(`Usuario no autorizado`);
    }
    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'orden no existe' };
  }
};
