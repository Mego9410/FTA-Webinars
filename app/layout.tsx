import type { Metadata } from "next";
import { Hanken_Grotesk, Lora } from "next/font/google";
import { FtaFooter } from "@/components/fta/FtaFooter";
import { FtaNav } from "@/components/fta/FtaNav";
import { PreviewBanner } from "@/components/fta/PreviewBanner";
import { isAdminPreviewMode } from "@/lib/admin";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FTA Webinars",
  description: "Expert webinars for dental practice owners — Frank Taylor & Associates",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${lora.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {isAdminPreviewMode() ? <PreviewBanner /> : null}
        <FtaNav />
        {children}
        <FtaFooter />
      </body>
    </html>
  );
}
