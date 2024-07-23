"use server";

import { z } from 'zod';
import { resetPasswordSchema } from '@/schemas';
import { getUserByEmail } from '@/action/user';
import { generatePasswordToken } from '@/lib/tokens';
import { sendEmail } from '@/lib/mail';

export async function resetPassword(values: z.infer<typeof resetPasswordSchema>) {
    const validateFields = resetPasswordSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: validateFields.error.errors[0].message };
    }

    const { email } = validateFields.data;

    const user = await getUserByEmail(email);

    if (!user) {
        return { error: "User not found" };
    }

    const passwordToken = await generatePasswordToken(email);
    await sendEmail(passwordToken.email, "resetPassword", passwordToken.token);
    return { success: "Password reset instructions sent to your email" };

}   