import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, El_Messiri, Amiri } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
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
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="ar" dir="rtl" className={`${cormorant.variable} ${montserrat.variable} ${elMessiri.variable} ${amiri.variable}`} suppressHydrationWarning>
       <body className="bg-ANALIA-light-bg text-ANALIA-light-text dark:bg-ANALIA-dark-bg dark:text-ANALIA-dark-text transition-colors duration-700 ease-in-out antialiased">
        <ThemeProvider>
          <ScrollToTop />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
