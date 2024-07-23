import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .regex(/^\S+$/, 'Email cannot contain spaces'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const registerSchema = z.object({
    name: z.string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-z0-9]+$/, 'Username can only contain lowercase letters, numbers and cannot contain spaces or special characters'),
    email: z.string()
        .email('Invalid email address')
        .regex(/^\S+$/, 'Email cannot contain spaces'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/^\S+$/, 'Password cannot contain spaces')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[@$!%*?&#]/, 'Password must contain at least one special character')
});

export const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address').regex(/^\S+$/, 'Email cannot contain spaces'),

});

export const newPasswordSchema = z.object({
    newpassword: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/^\S+$/, 'Password cannot contain spaces')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    confirmpassword: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/^\S+$/, 'Password cannot contain spaces')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
}).refine(data => data.newpassword === data.confirmpassword, {
    message: "Passwords don't match",
    path: ['confirmpassword'],
});
