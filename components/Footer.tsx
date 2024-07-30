"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center text-xl font-bold hover:scale-105 transition-transform"
          >
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <span className="sr-only">Dev Diaries</span>
            <span>Dev Diaries</span>
          </Link>
          <p className="text-muted-foreground">
            Welcome to our blog, where we share insights and stories about the world around us.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <FaTwitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <FaInstagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <FaFacebook className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <Linkedin className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
          <form className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Stay up-to-date with our latest posts and exclusive content.
          </p>
        </div>
      </div>
      <div className="bg-muted py-4 text-center text-sm text-muted-foreground">
        &copy; 2024 Dev Diaries. All rights reserved.
      </div>
    </footer>
  );
}
