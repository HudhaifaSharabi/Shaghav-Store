"use client";

import React from "react";
import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen flex flex-col items-center justify-center pt-[120px] px-6 text-center" dir="rtl">
      <h2 className="font-el-messiri text-5xl text-[#D4AF37] mb-8 font-bold">الأسئلة الشائعة</h2>
      <p className="font-tajawal text-xl text-[#C87D8A] mb-12 opacity-80">نعمل حالياً على جمع أكثر استفساراتكن شيوعاً لنقدم لكنّ إجابات وافية تليق بكنّ.</p>
      
      <Link 
        href="/"
        className="font-tajawal text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1 hover:border-[#D4AF37] transition-all tracking-widest uppercase text-sm"
      >
        العودة للرئيسية
      </Link>
    </main>
  );
}
