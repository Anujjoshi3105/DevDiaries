'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { AlignLeftIcon, SearchIcon } from "lucide-react";
import { headerLinks } from "@/data/navLink";
import { Theme } from "@/components/Theme";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsNavbarVisible(currentScrollPos <= prevScrollPos || currentScrollPos === 0);
      setPrevScrollPos(currentScrollPos);
      setIsScrolled(currentScrollPos > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);
  return (
    <header
      className={`fixed top-0 z-50 w-full transition-transform duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "shadow-lg bg-background" : ""}`}
    >
      <div className="flex h-24 w-full justify-between items-center px-4 md:px-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <AlignLeftIcon />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link
              href="/"
              className="mr-6 gap-2 flex font-bold text-xl items-center"
            >
              <Image src="/logo.png" alt="logo" width={40} height={10} />
              <span className="sr-only">Dev Diaries</span>
              <span>Dev Diaries</span>
            </Link>
            <div className="grid gap-2 py-8 text-lg">
              {headerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex w-full items-center py-2 hover:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 w-full justify-center">
              { /*!session ? (
                <>
                <Button asChild variant="outline" className="hidden lg:block">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="hidden lg:block">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => signOut()}>Log Out</Button>
              )*/}
              <>
                <Button asChild variant="outline" className="hidden lg:block">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="hidden lg:block">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
                </>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          className="mr-6 gap-1 font-bold hidden lg:flex items-center text-xl hover:scale-105 delay-150 ease-in-out"
        >
          <Image src="/logo.png" alt="logo" width={40} height={10} />
          <span className="sr-only">Dev Diaries</span>
          <span>Dev Diaries</span>
        </Link>
        <nav className="hidden lg:flex gap-4 font-semibold">
          {headerLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="group inline-flex items-center justify-center px-4 py-2 transition-colors hover:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-6 items-center justify-center">
          <div className="flex gap-2">
          <Button variant="outline" size="icon" className="md:hidden flex rounded-full hover:text-primary">
            <SearchIcon className="h-[1.2rem] w-[1.2rem]"/>
            <span className="sr-only">Search</span>
          </Button>
          <div className="md:flex hidden relative ml-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="p-8 pr-4 py-2 rounded-full"
            />
            <span className="sr-only">Search</span>
          </div>
          <Theme />
          </div>
          {/* session ? (
            <User email={session.user.email} username={session.user.username} profilePhoto={session.user.profilePhoto} />
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline" className="hidden lg:block">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="hidden lg:block">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          ) */}
            <div className="flex gap-2">
                <Button asChild variant="outline" className="hidden lg:block">
                    <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="hidden lg:block">
                    <Link href="/auth/signup">Sign Up</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
