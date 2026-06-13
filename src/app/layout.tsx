import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "都在这了课件站",
  description: "主题班会、课件、绘本资源分享",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-to-br from-blue-50 to-yellow-50">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
