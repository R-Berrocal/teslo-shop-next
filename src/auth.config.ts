import NextAuth, { type NextAuthConfig } from 'next-auth';
import z from 'zod';
import bcryptjs from 'bcryptjs';
import prisma from './lib/prisma';
import credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // const isLoggedIn = !!auth?.user;
      // const isOnDashBoard = nextUrl.pathname.startsWith('/board');
      // if (isOnDashBoard) {
      //   if (isLoggedIn) return true;
      //   return false;
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/board', nextUrl));
      // }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    session({ session, token, user }) {
      session.user = token.data as any;
      return session;
    },
  },
  providers: [
    credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        if (!bcryptjs.compareSync(password, user.password)) return null;

        const { password: _, ...rest } = user;
        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
