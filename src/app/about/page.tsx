"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function PulsingCTA({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href}
      className={`group relative inline-flex items-center justify-center px-10 py-5 bg-[#4B1E28]/40 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 animate-[pulse_3s_ease-in-out_infinite] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxImgRef = useRef<HTMLDivElement>(null);
  const fabricBgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Reveal
    gsap.fromTo(".about-hero-text", 
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.3, ease: "power3.out" }
    );

    // 2. Section Staggered Reveal
    gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((item) => {
      gsap.fromTo(item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // 3. Genesis Image Parallax
    if (parallaxImgRef.current) {
        gsap.to(parallaxImgRef.current, {
          y: "15%",
          ease: "none",
          scrollTrigger: {
            trigger: parallaxImgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
    }

    // 4. Craftsmanship Parallax
    if (fabricBgRef.current) {
        gsap.to(fabricBgRef.current, {
          y: "20%",
          ease: "none",
          scrollTrigger: {
            trigger: fabricBgRef.current.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
    }

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen pt-[120px]" dir="rtl">
      
      {/* ── Section 1: The Soul (Hero) ── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4B1E28]/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="about-hero-text font-arabic text-5xl md:text-7xl lg:text-8xl text-[#D4AF37] font-bold leading-tight mb-8">
            وراء كل تفصيلة.. شغف.
          </h1>
          <p className="about-hero-text font-arabic text-lg md:text-2xl text-[#C87D8A] tracking-[0.1em] font-light">
            لم نُصمم لنكسو الجسد، بل لنعانق الروح.
          </p>
        </div>
      </section>

      {/* ── Section 2: The Genesis ── */}
      <section className="py-24 px-6 md:px-[10vw] flex flex-col md:flex-row gap-16 items-center bg-gradient-to-b from-[#0A0A0A] to-[#4B1E28]/10 overflow-hidden">
        {/* Right Content */}
        <div className="reveal-item w-full md:w-1/2">
          <span className="font-montserrat text-[10px] uppercase tracking-[0.8em] text-[#C87D8A] mb-4 block">Our Story</span>
          <h2 className="font-arabic text-4xl md:text-5xl text-[#D4AF37] font-bold mb-8">حكاية شغف</h2>
          <p className="font-arabic text-lg md:text-xl text-[#C87D8A] leading-[1.8] opacity-90 text-justify">
            بدأنا من إيمان عميق بأن الأنوثة لا تحتاج إلى تكلف لتبرز، بل تحتاج إلى قطع تُصنع بحب، وتُفصل بعناية فائقة. نحن هنا لنقدم لكِ أزياء تروي قصتكِ، وتعكس ذوقكِ المتفرد في كل خطوة.
          </p>
        </div>

        {/* Left Image (Arched Parallax) */}
        <div className="w-full md:w-[40%] aspect-[3/4] rounded-t-[20vw] overflow-hidden relative group">
          <div ref={parallaxImgRef} className="absolute -top-[20%] left-0 w-full h-[140%]">
            <img 
              src="/images/about-soul.png" 
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
              alt="Shaghav Soul" 
            />
          </div>
          <div className="absolute inset-0 bg-[#4B1E28]/10 mix-blend-overlay" />
        </div>
      </section>

      {/* ── Section 3: The Craftsmanship ── */}
      <section className="h-[65vh] w-full relative overflow-hidden flex items-center justify-center">
        {/* Background Parallax Image */}
        <div ref={fabricBgRef} className="absolute -top-[30%] left-0 w-full h-[160%] z-0">
          <img 
            src="/images/about-fabric.png" 
            className="w-full h-full object-cover opacity-60" 
            alt="Luxury Fabric Detail" 
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0A0A0A]/60 z-1" />

        <div className="relative z-10 text-center px-6 max-w-4xl reveal-item">
          <h2 className="font-arabic text-4xl md:text-6xl text-[#D4AF37] font-light leading-snug drop-shadow-2xl">
            جودة لا تُرى بالعين فقط، <br className="hidden md:block"/>
            <span className="font-bold">بل تُشعر بالقلب.</span>
          </h2>
        </div>
      </section>

      {/* ── Section 4: The Invitation ── */}
      <section className="py-32 bg-[#0A0A0A] flex flex-col items-center text-center px-6 reveal-item">
        <h3 className="font-arabic text-3xl text-[#C87D8A] mb-12 opacity-80">هل أنتِ مستعدة لبدء حكايتكِ؟</h3>
        <PulsingCTA href="/products" className="font-arabic min-w-[280px]">
          استكشفي تشكيلتنا
        </PulsingCTA>
      </section>

    </main>
  );
}
