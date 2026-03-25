"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-24 bg-[#0A0A0A] border-t border-[#D4AF37]/10 px-6 font-arabic text-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-4 mb-12 opacity-80">
          <h2 className="font-cormorant text-2xl md:text-3xl text-[#D4AF37] tracking-[0.4em] uppercase">ANALIA</h2>
          <Image 
            src="/logo.png" 
            alt="ANALIA logo" 
            width={56} 
            height={56} 
            className="h-10 md:h-14 w-auto object-contain" 
          />
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center flex-wrap gap-8 md:gap-12 mb-16">
          <Link href="/products" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#D4AF37] transition-colors">Products</Link>
          <Link href="/about" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#D4AF37] transition-colors">Philosophy</Link>
          <Link href="/faq" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#D4AF37] transition-colors">Q&A</Link>
          <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#D4AF37] transition-colors">Lobby</Link>
        </div>

        {/* Brand Promise / Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#4B1E28]" />
          <div className="w-1 h-1 rounded-full bg-[#D4AF37]/30" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#4B1E28]" />
        </div>

        {/* Copyright */}
        <p className="font-arabic text-[11px] text-white/20 tracking-[0.4em] mb-4">
          كافة الحقوق محفوظة ٢٠٢٦ — شَغَف
        </p>
      </div>
    </footer>
  );
}
