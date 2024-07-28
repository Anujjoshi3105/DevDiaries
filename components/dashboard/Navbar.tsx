"use client";

import Search from "@/components/Search";
import { Theme } from "@/components/Theme";

export default function Navbar({heading}: {heading?: string}) {
  return (
    <header className="flex items-center justify-end p-4 md:p-8 mb-8 gap-2">
      {heading && <h1 className="text-2xl font-bold">{heading}</h1>}
      <Search />
      <Theme />
    </header>
  );
}
