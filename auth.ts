import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/action/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  events: {
    async signIn({ user, account }): Promise<void> {
      if (account?.provider !== "credentials") return;
      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) return;
    }
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role: 'ADMIN' | 'USER' }).role;
      } else if (token.sub) {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          token.role = existingUser.role;
        }
      }
      return token;
    }
  },

  ...authConfig
});
