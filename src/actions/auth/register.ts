'use server';

import bcryptjs from 'bcryptjs';
import prisma from '@/lib/prisma';

interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterProps) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLocaleLowerCase(),
        password: bcryptjs.hashSync(password, 10),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      message: 'User created successfully',
      user,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Something went wrong',
    };
  }
};
