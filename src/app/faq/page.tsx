"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function FAQPage() {
  return (
    <main className="bg-transparent min-h-screen flex flex-col items-center justify-center pt-[120px] px-6 text-center" dir="rtl">
      <h2 className="font-arabic text-5xl text-ANALIA-light-heading dark:text-ANALIA-dark-heading mb-8 font-bold">الأسئلة الشائعة</h2>
      <p className="font-arabic text-xl text-ANALIA-rose mb-12 opacity-80">نعمل حالياً على جمع أكثر استفساراتكن شيوعاً لنقدم لكنّ إجابات وافية تليق بكنّ.</p>
      
      <Link 
        href="/"
        className="font-arabic text-ANALIA-light-heading dark:text-ANALIA-dark-heading border-b border-ANALIA-gold/30 pb-1 hover:border-ANALIA-gold dark:hover:border-ANALIA-gold transition-all tracking-widest uppercase text-sm"
      >
        العودة للرئيسية
      </Link>
      <Footer />
    </main>
  );
}
