'use server';

import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    if (!userAddress) {
      return {
        ok: false,
        message: 'No se encontro la dirección',
      };
    }
    const deletedAddress = await prisma.userAddress.delete({
      where: {
        userId,
      },
    });

    return {
      ok: true,
      deletedAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la dirección',
    };
  }
};
