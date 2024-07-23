"use server";

import { db } from "@/lib/db";
import { hash } from 'bcryptjs';
import { registerSchema } from '@/schemas';
import { getUserByEmail, getUserByName } from "@/action/user";
import { z } from 'zod';
import { generateVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mail";

interface UserData {
    name: string;
    email: string;
    password: string;
}

export async function registerUser(values: z.infer<typeof registerSchema>) {
    const validateFields = registerSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: validateFields.error.errors[0].message };
    }

    const { name, email, password } = validateFields.data;

    const normalizedName = name.toLowerCase();
    const normalizedEmail = email.toLowerCase();
    const existingEmail = await getUserByEmail(normalizedEmail);
    if (existingEmail) {
        return { error: "Email already exists" };
    }

    const existingName = await getUserByName(normalizedName);
    if (existingName) {
        return { error: "Username already exists" };
    }

    const hashedPassword = await hash(password, 10);

    const userData: UserData = {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
    };

    await db.user.create({
        data: userData,
    });

    const verificationToken = await generateVerificationToken(email);
    const res = await sendEmail(verificationToken.email, "verifyEmail", verificationToken.token);

    return { message: "Confirmation email sent!\nPlease check your inbox." };
}
