import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "天鹅到家 · AI 智能招募平台",
  description: "基于AI的钟点工保姆智能招募Agent",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        <TooltipProvider>
          <div className="relative flex h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-32 right-1/3 h-[500px] w-[500px] rounded-full bg-red-200/25 blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-100/25 blur-[80px]" />
              <div className="absolute bottom-1/3 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-100/20 blur-[90px]" />
            </div>
            <Sidebar />
            <main className="flex-1 overflow-y-auto"><div className="mx-auto p-8">{children}</div></main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
