"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/layout/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function PulsingCTA({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href}
      className={`group relative inline-flex items-center justify-center px-10 py-5 bg-[#4B1E28] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 animate-[pulse_3s_ease-in-out_infinite] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Entrance
    gsap.fromTo(".about-hero-text", 
      { opacity: 0, y: 50, filter: "blur(15px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, stagger: 0.3, ease: "power4.out" }
    );

    // 2. Vision Section: Image Parallax
    gsap.to(".vision-parallax", {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".vision-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    // 3. Atelier Grid: Staggered Reveal
    gsap.fromTo(".atelier-item", 
      { opacity: 0, y: 80 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".atelier-grid",
          start: "top 80%",
        }
      }
    );

    // 4. Quote Stagger
    gsap.fromTo(".quote-text", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".quote-section",
          start: "top 85%",
        }
      }
    );

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="bg-transparent min-h-screen pt-[120px] overflow-x-hidden" dir="rtl">
      
      {/* ── Section 1: Cinematic Hero ── */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image: Flowing Fabric */}
        <div className="absolute inset-0">
          <Image 
             src="/images/lace_details_1772392328266.png" 
             alt="Luxury Fabric Background" 
             fill
             className="object-cover scale-[1.05]" 
             priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ANALIA-light-bg/40 via-ANALIA-light-bg/60 to-ANALIA-light-bg dark:from-ANALIA-dark-bg/40 dark:via-ANALIA-dark-bg/60 dark:to-ANALIA-dark-bg" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="about-hero-text font-arabic text-6xl md:text-9xl text-ANALIA-light-heading dark:text-[#D4AF37] leading-tight mb-8 drop-shadow-2xl font-normal">
            وراء كل تفصيلة.. شغف.
          </h1>
          <p className="about-hero-text font-arabic text-lg md:text-2xl text-ANALIA-light-text dark:text-[#C87D8A]/80 tracking-[0.1em] font-light max-w-2xl mx-auto">
            قصةُ نسجٍ تحكيها القلوب، وأنوثةٌ تتجسدُ في خيوط شَغَف.
          </p>
        </div>
      </section>

      {/* ── Section 2: The Vision (Overlapping Parallax) ── */}
      <section className="vision-section py-32 px-6 md:px-[10vw] flex flex-col md:flex-row items-center gap-20 bg-transparent">
        {/* Right Column: Narrative */}
        <div className="w-full md:w-[45%] text-right order-2 md:order-1">
          <span className="font-montserrat text-[10px] uppercase tracking-[0.8em] text-[#C87D8A] mb-4 block">Our Vision</span>
          <h2 className="font-arabic text-4xl md:text-6xl text-ANALIA-light-heading dark:text-[#D4AF37] font-normal mb-8">حكاية شغف</h2>
          <p className="font-arabic text-lg md:text-xl text-ANALIA-light-text dark:text-[#C87D8A] leading-[2] opacity-90 text-justify">
            بدأنا من إيمان عميق بأن الأنوثة لا تحتاج إلى تكلف لتبرز، بل تحتاج إلى قطع تُصنع بحب، وتُفصل بعناية فائقة. شغف ليست مجرد علامة تجارية؛ هي رحلة للبحث عن الجمال في أدق التفاصيل، لنموذج أزياء تروي قصتكِ، وتعكس ذوقكِ المتفرد في كل خطوة.
          </p>
          <div className="mt-12 h-px w-24 bg-gradient-to-l from-[#D4AF37] to-transparent" />
        </div>

        {/* Left Column: Overlapping Images */}
        <div className="w-full md:w-[55%] relative flex justify-end order-1 md:order-2">
          {/* Main Large Image */}
          <div className="w-[85%] aspect-[3/4] rounded-t-[30vw] overflow-hidden group shadow-2xl relative z-10">
            <Image 
              src="/images/ANALIA_masterpiece_1772392229139.png" 
              alt="Luxury Masterpiece" 
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-[#4B1E28]/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
          </div>

          {/* Overlapping Small Image with Parallax */}
          <div className="vision-parallax absolute -bottom-16 -left-8 w-[55%] aspect-square rounded-t-full border-8 border-ANALIA-light-bg dark:border-ANALIA-dark-bg overflow-hidden z-20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group">
             <Image 
              src="/images/luxury-sleepwear.png" 
              alt="Detail Parallax" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: The Atelier Grid (Asymmetric) ── */}
      <section className="atelier-grid py-40 bg-gradient-to-b from-transparent via-ANALIA-burgundy/5 dark:via-ANALIA-burgundy/20 to-transparent px-6 md:px-[10vw]">
        <div className="text-center mb-32">
          <span className="font-montserrat text-[10px] uppercase tracking-[0.8em] text-[#C87D8A]/50 mb-4 block">The Gallery</span>
          <h2 className="font-arabic text-4xl md:text-7xl text-ANALIA-light-heading dark:text-[#D4AF37] font-normal">فن الصناعة المتقنة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
          {/* Column 1 */}
          <div className="atelier-item group relative">
            <div className="aspect-[3/4] rounded-t-[18vw] overflow-hidden shadow-2xl relative">
              <Image 
                src="/images/couture_one_1772392258498.png" 
                alt="Atelier One" 
                fill
                className="object-cover transition-transform duration-[2500ms] group-hover:scale-110" 
              />
            </div>
            <div className="mt-8 text-right px-4">
              <span className="font-montserrat text-[9px] text-[#C87D8A] tracking-[0.4em] mb-2 block">Creation I</span>
              <p className="font-arabic text-ANALIA-light-text dark:text-white/50 text-sm">دقة التصميم في كل غرزة خيط.</p>
            </div>
          </div>

          {/* Column 2: Pushed Down */}
          <div className="atelier-item group relative md:mt-32">
            <div className="aspect-[3/4.5] rounded-t-[18vw] overflow-hidden shadow-2xl relative">
              <Image 
                src="/images/silk_sleepwear_1772392297928.png" 
                alt="Atelier Two" 
                fill
                className="object-cover transition-transform duration-[2500ms] group-hover:scale-110" 
              />
            </div>
            <div className="mt-8 text-right px-4">
              <span className="font-montserrat text-[9px] text-[#C87D8A] tracking-[0.4em] mb-2 block">Creation II</span>
              <p className="font-arabic text-ANALIA-light-text dark:text-white/50 text-sm">الأناقة التي لا تبهت مع الزمن.</p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="atelier-item group relative">
            <div className="aspect-[3/4] rounded-t-[18vw] overflow-hidden shadow-2xl relative">
              <Image 
                src="/images/couture_two_1772392277554.png" 
                alt="Atelier Three" 
                fill
                className="object-cover transition-transform duration-[2500ms] group-hover:scale-110" 
              />
            </div>
            <div className="mt-8 text-right px-4">
              <span className="font-montserrat text-[9px] text-[#C87D8A] tracking-[0.4em] mb-2 block">Creation III</span>
              <p className="font-arabic text-ANALIA-light-text dark:text-white/50 text-sm">لمسة حرير تعانق تفاصيلكِ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: The Final Quote & CTA ── */}
      <section className="quote-section py-48 bg-transparent text-center px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#D4AF37] to-transparent mb-16 opacity-50" />
          
          <h2 className="quote-text font-arabic text-5xl md:text-8xl text-ANALIA-light-heading dark:text-[#D4AF37] leading-[1.4] md:leading-[1.2] mb-20 font-normal drop-shadow-2xl">
            جودة لا تُرى بالعين فقط، <br className="hidden md:block"/>
            بل تُشعر بالقلب.
          </h2>

          <div className="reveal-item">
            <PulsingCTA href="/products" className="font-arabic min-w-[300px] text-lg">
              استكشفي حكايتنا
            </PulsingCTA>
          </div>
        </div>
      </section>

      {/* ── Footer Link ── */}
      <div className="pb-24 text-center">
        <Link href="/" className="inline-flex items-center gap-4 text-[#C87D8A]/50 hover:text-[#D4AF37] transition-all font-arabic text-xs tracking-[0.2em] group">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span>العودة للمعرض</span>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
