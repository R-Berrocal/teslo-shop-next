'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const changeUserRole = async (userId: string, role: string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar logueado como administrador',
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role as 'admin' | 'user',
      },
    });

    revalidatePath('/admin/users');
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo cambiar el rol',
    };
  }
};
