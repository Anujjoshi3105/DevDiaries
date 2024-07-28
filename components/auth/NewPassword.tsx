'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPasswordSchema } from '@/schemas';
import { useRouter, useSearchParams } from "next/navigation";
import { resetpassword } from "@/action/auth/new-password";
import { Password } from "@/components/ui/password";

type FormData = z.infer<typeof newPasswordSchema>;

export default function NewPassword() {
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(newPasswordSchema),
    });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const onSubmit = async (values: FormData) => {
        setLoading(true);
        try {
            const validateFields = newPasswordSchema.safeParse(values);
            if (!validateFields.success) {
                setLoading(false);
                return toast({
                    title: "Error",
                    description: validateFields.error.errors[0].message,
                    variant: "destructive",
                });
            }
            const result = await resetpassword(values, token);
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
                    description: "Password has been successfully reset",
                });
                reset();
                router.push('/auth/login');
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
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground">
                        Enter and confirm your new password
                    </p>
                </div>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="grid gap-2">
                        <Label htmlFor="newpassword">New Password</Label>
                        <Password
                            id="newpassword"
                            placeholder="New Password"
                            autoComplete="new-password"
                            {...register("newpassword")}
                        />
                        {errors.newpassword && <span className="text-destructive text-sm">{errors.newpassword.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmpassword">Confirm Password</Label>
                        <Password
                            id="confirmpassword"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            {...register("confirmpassword")}
                        />
                        {errors.confirmpassword && <span className="text-destructive text-sm">{errors.confirmpassword.message}</span>}
                    </div>
                    <Button type="submit" className="w-full flex gap-1" disabled={loading}>
                        {loading ? <><LoaderCircle className="w-4 h-4 animate-spin" />Loading</> : "Reset Password"}
                    </Button>
                </form>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login">Back to Login</Link>
                </Button>
            </div>
        </div>
    );
}
