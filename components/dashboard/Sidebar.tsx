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
  const [windowWidth, setWindowWidth] = useState(0);
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
    handleResize(); // Initialize window width on component mount

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
            <AvatarImage src={session?.user?.image ?? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} />
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
        <SidebarLink href="/dashboard/" icon={<UserIcon />} label="Profile" isMobile={isMobile} isCollapsed={isCollapsed} />
        <div role="separator" className="-mx-1 my-2 h-px bg-muted"></div>
        <SidebarLink href="/dashboard/blog" icon={<FileText />} label="Blog" isMobile={isMobile} isCollapsed={isCollapsed} />
        <SidebarLink href="/dashboard/edit" icon={<FilePlus2 />} label="Add Blog" isMobile={isMobile} isCollapsed={isCollapsed} />
        <div role="separator" className="-mx-1 my-2 h-px bg-muted"></div>
        <SidebarLink href="/dashboard/setting" icon={<SettingsIcon />} label="Setting" isMobile={isMobile} isCollapsed={isCollapsed} />
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

function SidebarLink({ href, icon, label, isMobile, isCollapsed }: { href: string; icon: React.ReactNode; label: string; isMobile: boolean; isCollapsed: boolean }) {
  return (
    <Button variant="ghost" size="sm" className="w-full justify-start text-base" asChild>
      <Link href={href} prefetch={false}>
        {icon}
        {!isMobile && !isCollapsed && <span className="ml-2 font-medium">{label}</span>}
      </Link>
    </Button>
  );
}
