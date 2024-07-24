'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

export default function OAuth() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      const result = await signIn('google', {
        callbackUrl: process.env.NEXTAUTH_URL,
      });
      if (result?.error) {
        toast({ title: 'Error', description: `Google Login Failed: ${result.error}` });
      } else {
        toast({ title: 'Success', description: 'Login with Google successful' });
        router.push('/');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: `An error occurred: ${error.message || error.toString()}` });
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoadingGithub(true);
    try {
      const result = await signIn('github', {
        redirect: false,
        callbackUrl: process.env.NEXTAUTH_URL,
      });
      if (result?.error) {
        toast({ title: 'Error', description: `Github Login Failed: ${result.error}` });
      } else {
        toast({ title: 'Success', description: 'Login with Github successful' });
        router.push('/');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: `An error occurred: ${error.message || error.toString()}` });
    } finally {
      setLoadingGithub(false);
    }
  };

  return (
    <>
      <div className="border-b text-center">
        <div className="leading-none px-2 inline-block text-sm text-foreground tracking-wide bg-background transform translate-y-2.5">
          or continue with
        </div>
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full flex gap-2"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle || loadingGithub}
        >
          {loadingGoogle ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Loading</> : <><FaGoogle /> Google</>}
        </Button>
        <Button
          variant="outline"
          className="w-full flex gap-2"
          onClick={handleGithubLogin}
          disabled={loadingGoogle || loadingGithub}
        >
          {loadingGithub ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Loading</> : <><FaGithub /> Github</>}
        </Button>
      </div>
    </>
  );
}
