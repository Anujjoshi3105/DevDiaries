'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { UserIcon, SettingsIcon, LogOut, ChevronLeft, ChevronRight, FileText, FilePlus2 } from "lucide-react";
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useToast } from '../ui/use-toast';

export default function Sidebar() {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true });
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (windowWidth >= 768) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const isMobile = windowWidth < 768;

  return (
    <aside className={`relative flex flex-col justify-between h-screen py-6 px-2 md:py-8 md:px-4 border-r transition-all duration-500 md:max-w-[250px] min-w-[60px] ${isCollapsed && !isMobile ? 'w-24' : 'max-w-[80px]'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={session?.user?.image!} />
            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isMobile && !isCollapsed && (
            <div>
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          )}
        </div>
        {!isMobile && !isCollapsed && <Badge variant="secondary">{session?.user?.role}</Badge>}
      </div>

      <nav className="space-y-4">
        <Button variant="ghost" size="sm" className="w-full justify-start text-base" asChild>
          <Link href="/dashboard/" prefetch={false}>
            <UserIcon className="w-15 h-15" />
            {!isMobile && !isCollapsed && <span className="ml-2 font-medium">Profile</span>}
          </Link>
        </Button>
        <div role="separator" className="-mx-1 my-2 h-px bg-muted" />
        <Button variant="ghost" size="sm" className="w-full justify-start text-base" asChild>
          <Link href="/dashboard/blog" prefetch={false}>
            <FileText className="w-15 h-15" />
            {!isMobile && !isCollapsed && <span className="ml-2 font-medium">Blog</span>}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-base" asChild>
          <Link href="/dashboard/addblog" prefetch={false}>
            <FilePlus2 className="w-15 h-15" />
            {!isMobile && !isCollapsed && <span className="ml-2 font-medium">Add Blog</span>}
          </Link>
        </Button>
        <div role="separator" className="-mx-1 my-2 h-px bg-muted" />
        <Button variant="ghost" size="sm" className="w-full justify-start text-base" asChild>
          <Link href="/dashboard/setting" prefetch={false}>
            <SettingsIcon className="w-15 h-15" />
            {!isMobile && !isCollapsed && <span className="ml-2 font-medium">Setting</span>}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-base" onClick={handleSignOut}>
          <LogOut className="w-15 h-15" />
          {!isMobile && !isCollapsed && <span className="ml-2 font-medium">Log Out</span>}
        </Button>
      </nav>

      <Link href="/" className="flex items-center gap-2 font-bold text-lg mx-auto">
        <Image src="/logo.png" alt="logo" width={40} height={10} />
        <span className="sr-only">Dev Diaries</span>
        {!isMobile && !isCollapsed && <span>Dev Diaries</span>}
      </Link>

      {!isMobile && (
        <Button onClick={toggleSidebar} variant="outline" className="absolute top-1/2 -right-5 rounded-full" size="icon">
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      )}
    </aside>
  );
}
