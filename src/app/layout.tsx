import type { Metadata } from "next";
import { Rubik } from "next/font/google"; // Using Rubik as requested
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "שוק בשכונה - פירות וירקות טריים",
  description: "הכי טרי • הכי קרוב • הכי טעים",
  icons: {
    icon: "/favicon-pure.png",
    apple: "/favicon-pure.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased w-full max-w-[100vw] overflow-x-hidden",
          rubik.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
