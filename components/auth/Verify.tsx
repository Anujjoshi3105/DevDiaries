"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail } from "@/action/auth/verification";
import { CheckIcon, XIcon } from "lucide-react";

export default function Verify() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ error: string; success: string }>({ error: "", success: "" });
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus({ error: "Missing Token", success: "" });
      return;
    }

    const onSubmit = async () => {
      try {
        const res = await verifyEmail(token);
        if (res.error) {
          setStatus({ error: res.error, success: "" });
        } else if (res.success) {
          setStatus({ error: "", success: res.success });
        }
      } catch {
        setStatus({ error: "Something went wrong", success: "" });
      }
    };

    onSubmit();
  }, [token]);

  return (
    <main className="h-screen w-full flex flex-col gap-10 justify-center items-center">
      {!status.success && !status.error && (
        <>
          <h1 className="text-4xl font-extrabold">CONFIRMING YOUR VERIFICATION</h1>
          <div className="flex space-x-2">
            <span className="sr-only">Loading...</span>
            <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-primary rounded-full animate-bounce"></div>
          </div>
        </>
      )}
      {status.success && (
        <div className="flex flex-col items-center justify-center p-8 bg-green-400 dark:bg-green-900 rounded-lg shadow-md">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Verification Successful</h2>
          <p className="mt-2 text-center text-sm">{status.success}</p>
          <Link href="/" passHref className="mt-5 relative inline-block text-sm font-medium text-primary group active:text-secondary focus:outline-none focus:ring">
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-primary group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="relative block px-8 py-3 bg-foreground border border-current">Go Home</span>
          </Link>
        </div>
      )}
      {status.error && (
        <div className="flex flex-col items-center justify-center px-16 p-8 bg-red-400 dark:bg-red-900 rounded-lg shadow-md">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <XIcon className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Verification Failed</h2>
          <p className="mt-2 text-center text-sm text-red-100">{status.error}</p>
          <Link href="/auth/login" passHref className="mt-5 relative inline-block text-sm font-medium text-destructive group active:text-secondary focus:outline-none focus:ring">
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-red-400 group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="relative block px-8 py-3 bg-foreground border border-current">Go to Login</span>
          </Link>
        </div>
      )}
    </main>
  );
}
