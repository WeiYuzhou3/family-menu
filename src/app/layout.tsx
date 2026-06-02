import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { KittyCorner } from "@/components/KittyCorner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif-sc",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#fbf7f0",
};

export const metadata: Metadata = {
  title: "Family Menu — 家庭私厨",
  description: "温暖的家庭菜单，记录每一道爱的料理。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Family Menu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${playfairDisplay.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary font-sans">
        <ToastProvider>
          <KittyCorner />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
