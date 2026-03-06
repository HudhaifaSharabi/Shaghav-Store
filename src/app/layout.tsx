import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, El_Messiri, Tajawal } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "SHAGHAV | Ultra-Luxury E-commerce",
  description: "The New Era of Luxury",
};

import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cormorant.variable} ${montserrat.variable} ${elMessiri.variable} ${tajawal.variable}`}>
       <body className="antialiased font-montserrat bg-black text-[#F5F5F5]">
        <Header />
        {children}
      </body>
    </html>
  );
}
