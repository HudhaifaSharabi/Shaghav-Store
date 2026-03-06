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

  return (
    <>
      {/* ── Main Content ── */}
      <div className="pt-[140px]">{children}</div>

      {/* ── Luxury Footer ── */}
      <footer className="bg-[#0A0A0A] border-t border-[#4B1E28] pt-16 pb-8 px-6 text-center">
        {/* Logo */}
        <Link
          href="/"
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
