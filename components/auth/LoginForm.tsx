'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas';
import { login } from "@/action/auth/login";
import OAuth from "@/components/auth/OAuth";
import { Password } from "@/components/ui/password";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onSubmit = async (values: FormData) => {
        setLoading(true);
        try {
            const result = await login(values);
            setLoading(false);

            if (result?.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Login successful",
                });
                router.push("/");
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
        <div className="w-full lg:grid lg:grid-cols-2 h-screen">
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/lap.webp"
                    alt="Image"
                    width={1000}
                    height={1000}
                    className="h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
                    priority
                />
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-nowrap text-muted-foreground">
                            Enter your email below to login to your account
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
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/auth/reset" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Password
                                id="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                {...register("password")}
                            />
                            {errors.password && <span className="text-destructive text-sm">{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full flex gap-1" disabled={loading}>
                            {loading ? <><LoaderCircle className="w-4 h-4 animate-spin" />Loading</> : "Login"}
                        </Button>
                    </form>
                    <OAuth />
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?&nbsp;
                        <Link href="/auth/signup" className="underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
