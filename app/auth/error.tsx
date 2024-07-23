"use client";

import Link from "next/link"

export default function page({ error }: { error: string }) {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-6xl font-extrabold">AUTHENTICATION ERROR</h1>
      <h1 className="text-4xl font-bold mb-4">{error}</h1>
      <Link href="/" passHref className="mt-10 relative inline-block text-sm font-medium text-primary group active:text-secondary focus:outline-none focus:ring">
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-primary group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3 bg-background border border-current">
            Go Home
          </span>
      </Link>
    </main>
  )
}
