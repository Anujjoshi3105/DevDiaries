'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from 'zod';
import { registerSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/action/auth/signup';
import OAuth from "@/components/auth/OAuth";
import { Password } from "@/components/ui/password";

type FormData = z.infer<typeof registerSchema>;

export default function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(registerSchema),
    });

    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (values: FormData) => {
        setLoading(true);
        try {
            const result = await registerUser(values);
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
                    description: result.message,
                });
                router.push('/auth/login');
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
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
                <div className="mx-auto grid w-[400px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Sign Up</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to create an account
                        </p>
                    </div>
                    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Username</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Username"
                                autoComplete="name"
                                {...register("name")}
                            />
                            {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
                        </div>
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
                            <Label htmlFor="password">Password</Label>
                            <Password
                                id="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                {...register("password")}
                            />
                            {errors.password && <span className="text-destructive text-sm">{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full flex gap-1" disabled={loading}>
                            {loading ? <><LoaderCircle className="w-4 h-4 animate-spin" />Loading</> : "Create an account"}
                        </Button>
                    </form>
                    <OAuth />
                    <div className="mt-4 text-center text-sm">
                        Already have an account?&nbsp;
                        <Link href="/auth/login" className="underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
