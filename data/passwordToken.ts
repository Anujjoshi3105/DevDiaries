import { db } from "@/lib/db";

export const getPasswordTokenByEmail = async (email: string) => {
    try {
        const passwordToken = await db.passwordToken.findFirst({
            where: { email: email }
        });
        return passwordToken;
    } catch (error: any) {
        return null;
    }
}
export const getPasswordTokenByToken = async (token: string) => {
    try {
        const passwordToken = await db.passwordToken.findFirst({
            where: { token: token }
        });
        return passwordToken;
    } catch (error: any) {
        return null;
    }
}