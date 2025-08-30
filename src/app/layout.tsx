import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Link2PDF",
  description:
    "Link2PDF is a fast, distraction-free tool that lets you turn any webpage into a clean, readable PDF. Paste a link, click convert, and download your document instantly—perfect for students, researchers, and professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempo.build/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <Navbar />
        {children}
        {/* <TempoInit /> */}
      </body>
    </html>
  );
}
