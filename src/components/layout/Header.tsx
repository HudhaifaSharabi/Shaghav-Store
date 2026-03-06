"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import CartDrawer from "@/components/CartDrawer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useAppStore((s) => s.cartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 bg-[#D4AF37] rounded-full flex items-center justify-center">
      <span className="font-arabic text-[8px] font-bold text-black leading-none">
        {count}
      </span>
    </span>
  );
}

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -100",
      onUpdate: (self) => {
        if (!navRef.current) return;
        if (self.direction === 1) {
          gsap.to(navRef.current, { 
            backgroundColor: "rgba(10, 10, 10, 0.9)", 
            backdropFilter: "blur(12px)", 
            borderBottomColor: "rgba(212, 175, 55, 0.15)", 
            duration: 0.4 
          });
        } else {
          gsap.to(navRef.current, { 
            backgroundColor: "transparent", 
            backdropFilter: "blur(0px)", 
            borderBottomColor: "transparent", 
            duration: 0.4 
          });
        }
      }
    });
  }, { scope: headerRef });

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 w-full z-[100] flex flex-col">
        {/* Announcement Bar */}
        <div className="w-full bg-[#4B1E28] py-3.5 flex justify-center items-center relative overflow-hidden border-b border-[#D4AF37]/20">
          <p className="font-feminine text-[#D4AF37] text-sm md:text-base tracking-[0.1em] uppercase leading-none font-medium text-center px-4">
            تكريماً لحضوركِ الطاغي.. نهديكِ الشحن المجاني لكل طلباتكِ بـ ١٠,٠٠٠ ريال فأكثر.
          </p>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className="w-full transition-all duration-500 bg-transparent py-4 px-6 md:px-12 border-b border-transparent">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            
            {/* Right Column (Links - RTL) */}
           
 <div className="flex-1 flex items-center justify-start">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-[#D4AF37] hover:scale-110 transition-transform relative p-2 cursor-pointer"
                aria-label="حقيبة التسوق"
              >
                <ShoppingBag size={24} strokeWidth={1.5} />
                <CartBadge />
              </button>
            </div>
            {/* Center Column (Logo) */}
            <div className="flex justify-center shrink-0">
              <Link href="/" className="font-cormorant text-2xl md:text-4xl font-semibold text-[#D4AF37] tracking-[0.4em] translate-x-[0.2em] uppercase transition-colors duration-500 hover:text-white">
                SHAGHAV
              </Link>
            </div>
 <div className="flex-1 flex items-center justify-end gap-6 md:gap-8">
  <Link href="/about" className="font-arabic text-[#C87D8A] hover:text-[#D4AF37] text-sm md:text-base tracking-wide transition-colors">
                من نحن
              </Link>
              <Link href="/products" className="font-arabic text-[#C87D8A] hover:text-[#D4AF37] text-sm md:text-base tracking-wide transition-colors">
                المنتجات
              </Link>
              
              <Link href="/faq" className="font-arabic text-[#C87D8A] hover:text-[#D4AF37] text-sm md:text-base tracking-wide transition-colors">
                الأسئلة الشائعة
              </Link>
            </div>
            {/* Left Column (Cart - RTL) */}
           

          </div>
        </nav>
      </header>

      {/* Global Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
