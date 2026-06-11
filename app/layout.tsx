import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { FtaFooter } from "@/components/fta/FtaFooter";
import { FtaNav } from "@/components/fta/FtaNav";
import { PreviewBanner } from "@/components/fta/PreviewBanner";
import { isAdminPreviewMode } from "@/lib/admin";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${poppins.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {isAdminPreviewMode() ? <PreviewBanner /> : null}
        <FtaNav />
        {children}
        <FtaFooter />
      </body>
    </html>
  );
}
