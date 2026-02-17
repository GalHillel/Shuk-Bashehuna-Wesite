import type { Metadata } from "next";
import { Rubik } from "next/font/google"; // Using Rubik as requested
import "./globals.css";
import { cn } from "@/lib/utils";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "שוק בשכונה - פירות וירקות טריים מהחקלאי",
  description: "הזמינו אונליין פירות וירקות טריים, מוצרי מעדנייה ומאפים. משלוחים עד הבית.",
  icons: {
    icon: "/favicon.ico",
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
      </body>
    </html>
  );
}
