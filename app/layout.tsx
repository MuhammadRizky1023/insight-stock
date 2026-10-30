import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Stock Sign",
  description: "Stock analysis application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", GeistSans.variable)}
    >
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "antialiased"
        )}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}