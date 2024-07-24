import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Provider from "@/app/provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dev Diaries",
  description: "A comprehensive blog platform dedicated to developers of all levels, from beginners to seasoned professionals. It serves as a digital journal where developers can share their experiences, insights, and technical expertise. The site aims to foster a community of learning, collaboration, and innovation within the tech industry."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={spaceGrotesk.className}>
        <Provider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        <Toaster />
        </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
