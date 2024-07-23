"use server";

import { z } from 'zod';
import { newPasswordSchema } from '@/schemas';
import { getUserByEmail } from '@/action/user';
import { getPasswordTokenByToken } from '@/data/passwordToken';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function resetpassword(values: z.infer<typeof newPasswordSchema>, token: string | null) {
    if(!token){
        return { error: "No token found" };
    }
    const validateFields = newPasswordSchema.safeParse(values);
    
    if (!validateFields.success) {
        return { error: validateFields.error.errors[0].message };
    }
    const { newpassword, confirmpassword  } = validateFields.data
    
    const existingToken = await getPasswordTokenByToken(token);
    if(!existingToken){
        return { error: "Invalid token" };
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if(hasExpired){
        return { error: "Token has expired" };
    }

    const user = await getUserByEmail(existingToken.email);
    if(!user){
        return { error: "Email does not exist" };
    }
    await db.passwordToken.delete({
        where: { token: existingToken.token, email: existingToken.email },
    })
    
    const hashedPassword = await hash(newpassword, 10);
    await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    })    

    return { success: "Password reset successfully" };
}   