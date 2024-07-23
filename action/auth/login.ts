"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { loginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/action/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mail";

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
    if (!existingUser || !existingUser.password || !existingUser.email) {
        return { error: "Email not found" };
    }
    if(!existingUser.emailVerified) {
        const token = await generateVerificationToken(normalizedEmail);
        await sendEmail(normalizedEmail, "verifyEmail", token.token);
        return { error: "Please verify your email" };
    }


    try {
        await signIn("credentials", { email, password, redirect: false });
        return { message: "Login successful" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" };
                default:
                    return { error: error.message };
            }
        }
        return { error: "Something went wrong" };
    }
}
