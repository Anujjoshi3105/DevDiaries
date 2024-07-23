"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/action/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";

export async function verifyEmail(token: string) {
    const verificationToken = await getVerificationTokenByToken(token);
    if (!verificationToken) {
        return { error: "Token doesn't exist or expired" };
    }

    if (verificationToken.expires < new Date()) {
        return { error: "Token expired" };
    }

    const user = await getUserByEmail(verificationToken.email);
    if (!user) {
        return { error: "User doesn't exist" };
    }

    await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({ where: { token: verificationToken.token } });

    return { success: "Email verified" };
}
