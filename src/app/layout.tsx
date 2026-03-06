import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, El_Messiri, Amiri } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-montserrat",
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "ANALIA | ANALIA Store",
  description: "The New Era of Luxury",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cormorant.variable} ${montserrat.variable} ${elMessiri.variable} ${amiri.variable}`}>
       <body className="antialiased font-arabic bg-black text-[#F5F5F5]">
        <ScrollToTop />
        <Header />
        {children}
      </body>
    </html>
  );
}
