"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import CartDrawer from "@/components/CartDrawer";
import ThemeSwitch from "@/components/ThemeSwitch";

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
    <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 bg-ANALIA-gold rounded-full flex items-center justify-center">
      <span className="font-arabic text-[8px] font-bold text-[#0A0A0A] leading-none">
        {count}
      </span>
    </span>
  );
}

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile Menu Animation
  useGSAP(() => {
    if (isMenuOpen) {
      // Open Menu
      gsap.to(menuOverlayRef.current, { 
        display: "block",
        opacity: 1, 
        duration: 0.4 
      });
      gsap.to(mobileMenuRef.current, { 
        x: 0, 
        duration: 0.6, 
        ease: "power3.out" 
      });
      if (menuLinksRef.current) {
        gsap.fromTo(menuLinksRef.current.children, 
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.2, ease: "power2.out" }
        );
      }
    } else {
      // Close Menu
      gsap.to(mobileMenuRef.current, { 
        x: "100%", 
        duration: 0.5, 
        ease: "power3.in" 
      });
      gsap.to(menuOverlayRef.current, { 
        opacity: 0, 
        duration: 0.4,
        onComplete: () => {
          gsap.set(menuOverlayRef.current, { display: "none" });
        }
      });
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "من نحن", href: "/about" },
    { name: "المنتجات", href: "/products" },
    { name: "الأسئلة الشائعة", href: "/faq" },
  ];

  return (
    <>
      <header ref={headerRef} className={`fixed top-0 left-0 w-full z-[100] flex flex-col transition-all duration-500 ${isScrolled ? "bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-ANALIA-gold/20 shadow-lg" : "bg-transparent border-b border-transparent"}`}>
        {/* Announcement Bar */}
        <div className={`w-full bg-ANALIA-burgundy dark:bg-[#4B1E28]/80 relative overflow-hidden flex items-center transition-all duration-500 origin-top ${isScrolled ? "max-h-0 py-0 opacity-0" : "max-h-12 py-2 border-b border-ANALIA-gold/20 opacity-100"}`}>
          <div className="animate-marquee whitespace-nowrap">
            <span className="font-arabic text-ANALIA-gold text-[11px] md:text-xs tracking-[0.2em] uppercase leading-none font-medium px-4 inline-block">
              تكريماً لحضوركِ الطاغي.. نهديكِ الشحن المجاني لكل طلباتكِ بـ ١٠,٠٠٠ ريال فأكثر. — شغف بانتظاركِ دائماً — اطلبي الآن واحصلي على تجربة استثنائية.
            </span>
            {/* Repeat for seamless transition if needed, though simple translateX(100% to -100%) will loop */}
          </div>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className={`w-full transition-all duration-500 px-6 md:px-12 ${isScrolled ? "py-3" : "py-5"}`}>
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
            
            {/* Start (Right in RTL) - Cart Icon & Theme Switch */}
            <div className="flex-1 flex items-center justify-start gap-4">
              <ThemeSwitch />
              <button 
                id="cart-icon"
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-ANALIA-gold hover:scale-110 transition-transform relative p-2 cursor-pointer"
                aria-label="حقيبة التسوق"
              >
                <ShoppingBag size={24} strokeWidth={1.5} />
                <CartBadge />
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex justify-center shrink-0">
              <Link href="/" className="group flex items-center gap-2 md:gap-3 transition-transform duration-500 hover:scale-105">
                <span className="font-cormorant text-xl md:text-3xl font-semibold text-[#D4AF37] tracking-[0.1em] md:tracking-[0.2em] uppercase order-2">ANALIA</span>
                <Image 
                  src="/logo.png" 
                  alt="ANALIA Logo" 
                  width={48} 
                  height={48} 
                  className="h-7 md:h-12 w-auto object-contain order-1" 
                  priority
                />
              </Link>
            </div>

            {/* End (Left in RTL) - Links / Hamburger */}
            <div className="flex-1 flex items-center justify-end">
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="font-arabic text-[#C87D8A] hover:text-[#D4AF37] text-sm md:text-base tracking-wide transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="block md:hidden text-ANALIA-gold p-2"
                aria-label="القائمة"
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        ref={menuOverlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] hidden opacity-0"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div 
        ref={mobileMenuRef}
        className="fixed top-0 right-0 h-full w-[85vw] max-w-[400px] bg-ANALIA-light-bg dark:bg-ANALIA-dark-bg border-l border-ANALIA-gold/20 z-[160] translate-x-full shadow-2xl flex flex-col pt-24 px-10"
      >
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-8 left-8 text-[#D4AF37] p-2 hover:rotate-90 transition-transform duration-300"
        >
          <X size={32} strokeWidth={1.5} />
        </button>

        <div className="flex flex-col gap-12 mt-10" ref={menuLinksRef}>
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-arabic text-3xl text-ANALIA-light-text dark:text-ANALIA-dark-text hover:text-ANALIA-gold transition-colors tracking-widest text-right"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-px w-full bg-gradient-to-l from-[#D4AF37]/40 to-transparent my-4" />
          
          <div className="flex flex-col gap-6">
             <p className="font-arabic text-[#C87D8A]/50 text-sm tracking-widest text-right">تواصلوا معنا عبر الواتساب</p>
             <p className="font-cormorant text-[#D4AF37] text-xl tracking-widest text-right">+966 50 000 0000</p>
          </div>
        </div>

        <div className="mt-auto pb-16 opacity-30 text-center">
          <p className="font-cormorant text-xs tracking-[0.5em] text-[#D4AF37]">ANALIA STORE</p>
        </div>
      </div>

      {/* Global Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
