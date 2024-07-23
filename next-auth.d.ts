import NextAuth, { type DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
    role: userRole;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;

    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        role: "ADMIN" | "USER";
    }
}