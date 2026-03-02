"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useAppStore((s) => s.cartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 bg-[#D4AF37] rounded-full ring-2 ring-[#0A0A0A] flex items-center justify-center">
      <span className="font-SHAGHAVArabic text-[9px] font-bold text-black leading-none">
        {count.toLocaleString("ar-SA")}
      </span>
    </span>
  );
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* ── Luxury Navbar ── */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#D4AF37]/20 flex justify-between items-center px-6 md:px-10 py-4">
        {/* Left: Hamburger + Lobby link */}
        <div className="flex items-center gap-5">
          <button
            aria-label="القائمة"
            className="flex flex-col gap-[5px] group cursor-pointer"
          >
            <span className="block w-6 h-[1px] bg-[#D4AF37]/60 group-hover:bg-[#D4AF37] transition-colors duration-300" />
            <span className="block w-4 h-[1px] bg-[#D4AF37]/60 group-hover:bg-[#D4AF37] transition-colors duration-300 group-hover:w-6" />
            <span className="block w-6 h-[1px] bg-[#D4AF37]/60 group-hover:bg-[#D4AF37] transition-colors duration-300" />
          </button>
          <Link
            href="/lobby"
            className="hidden sm:block font-SHAGHAVArabic text-[10px] tracking-[0.25em] text-[#D4AF37]/40 hover:text-[#D4AF37]/80 transition-colors duration-500"
          >
            المعرض
          </Link>
        </div>

        {/* Center: Logo */}
        <Link
          href="/products"
          className="font-cormorant font-semibold text-xl tracking-[0.35em] text-[#D4AF37] hover:text-white transition-colors duration-500 select-none"
        >
          SHAGHAV
        </Link>

        {/* Right: Shopping Bag — opens CartDrawer */}
        <button
          id="cart-icon"
          onClick={() => setIsCartOpen(true)}
          aria-label="حقيبة التسوق"
          className="relative group cursor-pointer"
        >
          <svg
            className="w-5 h-5 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
            />
          </svg>
          {/* Item count badge (Hydrated) */}
          <CartBadge />
        </button>
      </header>

      {/* ── Cart Drawer ── */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* ── Main Content ── */}
      <div className="pt-[61px]">{children}</div>

      {/* ── Luxury Footer ── */}
      <footer className="bg-[#0A0A0A] border-t border-[#4B1E28] pt-16 pb-8 px-6 text-center">
        {/* Logo */}
        <Link
          href="/lobby"
          className="inline-block font-cormorant font-semibold text-2xl tracking-[0.4em] text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors duration-500 mb-10"
        >
          SHAGHAV
        </Link>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#4B1E28]" />
          <div className="w-1 h-1 rounded-full bg-[#D4AF37]/30" />
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#4B1E28]" />
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
          {[
            { label: "توصيل واسترجاع", href: "#" },
            { label: "تواصل معنا", href: "#" },
            { label: "سياسة الخصوصية", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-SHAGHAVArabic text-[11px] tracking-[0.2em] text-[#C87D8A]/60 hover:text-[#C87D8A] transition-colors duration-500"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="font-SHAGHAVArabic text-[10px] tracking-[0.25em] text-[#D4AF37]/30">
          شغف — جميع الحقوق محفوظة ٢٠٢٦
        </p>
      </footer>
    </>
  );
}
