'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Router } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/schemas';
import { resetPassword } from "@/action/auth/reset";
import Link from "next/link";

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(resetPasswordSchema),
    });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: FormData) => {
        setLoading(true);
        try {
            const result = await resetPassword(values);
            setLoading(false);

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Password reset instructions sent to your email",
                });
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-4">
                <div className="grid gap-2 text-center mb-4">
                    <h1 className="text-3xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground">
                        Enter your email to reset your password
                    </p>
                </div>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors.email && <span className="text-destructive text-sm">{errors.email.message}</span>}
                    </div>
                    <Button type="submit" className="w-full flex gap-1" disabled={loading}>
                        {loading ? <><LoaderCircle className="w-4 h-4 animate-spin" />Loading</> : "Send Reset Link"}
                    </Button>
                </form>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login">Back to Login</Link>
                </Button>
            </div>
        </div>
    );
}
