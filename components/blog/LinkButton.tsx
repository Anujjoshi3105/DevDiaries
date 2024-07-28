"use client";
import React from 'react';
import { toast } from "@/components/ui/use-toast";
import { LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LinkButton({ blogId }: { blogId: string }) {
    const handleCopyLink = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/blog/${blogId}`;
            await navigator.clipboard.writeText(url);
            toast({
                title: "Link Copied",
                description: "The blog link has been copied to your clipboard.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy the link. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <LinkIcon className="h-5 w-5 cursor-pointer" onClick={handleCopyLink} />
    );
}
