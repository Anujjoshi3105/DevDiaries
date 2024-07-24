"use client";

import Sidebar from '@/components/dashboard/Sidebar'
import Navbar from '@/components/dashboard/Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-scroll">
        <Navbar />
          {children}
      </div>
    </div>
  );
}
