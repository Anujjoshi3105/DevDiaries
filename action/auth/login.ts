"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { loginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/action/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function login(data: z.infer<typeof loginSchema>) {
    const validateFields = loginSchema.safeParse(data);

    if (!validateFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validateFields.data;
    if(!email || !password) {
        return { error: "All fields required!" };
    }
    const normalizedEmail = email.toLowerCase();
    const existingUser = await getUserByEmail(normalizedEmail);
    if (!existingUser ||  !existingUser.email) {
        return { error: "Email not found" };
    }
    if(!existingUser.emailVerified) {
        const token = await generateVerificationToken(normalizedEmail);
        await sendEmail(normalizedEmail, "verifyEmail", token.token);
        return { error: "Please verify your email" };
    }

    try {
        const signInResponse = await signIn("credentials", { email: normalizedEmail, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
        if (!signInResponse) {
            return { error: "Invalid Credentials" };
        }
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.message };
        }
        throw error;
    }
}
