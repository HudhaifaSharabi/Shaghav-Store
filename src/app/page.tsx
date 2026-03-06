"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Menu, ArrowLeft, Gift, Wallet, Scissors } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/products";
import DiscountPopup from "@/components/DiscountPopup";
import "./globals.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Shared Components ──────────────────────────────────────────────────────────

function PulsingCTA({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href}
      className={`group relative inline-flex items-center justify-center px-8 py-4 bg-[#4B1E28]/40 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-500 animate-[pulse_3s_ease-in-out_infinite] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const manifestoTextRef = useRef<HTMLHeadingElement>(null);
  const categorySectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 0. Initial Hero Entrance (Burgundy Fade)
    gsap.fromTo(".hero-overlay",
      { backgroundColor: "#4B1E28", opacity: 1 },
      { backgroundColor: "rgba(10, 10, 10, 0.4)", duration: 2, ease: "expo.inOut" }
    );

    // 1. Hero Title Word Animation (Refined)
    if (heroTitleRef.current) {
      const text = heroTitleRef.current.innerText;
      heroTitleRef.current.innerHTML = text.split(" ").map(word => `<span class="hero-word opacity-0 inline-block">${word}</span>`).join(" ");
      
      gsap.fromTo(".hero-word", 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15, 
          duration: 1.2, 
          ease: "power3.out", 
          delay: 0.2 
        }
      );
    }


    // 3. Manifesto Word Animation (Scrubbed with Scroll)
    if (manifestoTextRef.current) {
      const words = manifestoTextRef.current.innerText.split(" ");
      manifestoTextRef.current.innerHTML = words.map(word => `<span class="manifesto-word inline-block opacity-0">${word}</span>`).join(" ");

      gsap.to(".manifesto-word", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".manifesto-section",
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
        },
        startAt: { y: 20 }
      });
    }

    // SVG Line-art Animation
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".manifesto-section",
          start: "top 90%",
          end: "bottom 60%",
          scrub: 1.5,
        }
      });
    }

    // 4. Horizontal Runway (PRECISION SCROLL)
    if (trackRef.current && runwayRef.current) {
        gsap.to(trackRef.current, {
          x: () => {
             const trackWidth = trackRef.current ? trackRef.current.scrollWidth : 0;
             const viewportWidth = window.innerWidth;
             // In RTL, we move the track to the right to see items on the left
             return (trackWidth - viewportWidth);
          },
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: runwayRef.current,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            start: "top top",
            end: () => {
              const trackWidth = trackRef.current ? trackRef.current.scrollWidth : 0;
              const viewportWidth = window.innerWidth;
              // Precise distance to scroll to reveal the last bit of the track
              return `+=${trackWidth - viewportWidth}`;
            },
            invalidateOnRefresh: true,
          }
        });
    }

    // 5. Immersive Background Transition for Categories
    if (categorySectionRef.current) {
      gsap.to(categorySectionRef.current, {
        backgroundColor: "#4B1E28",
        ease: "none",
        scrollTrigger: {
          trigger: categorySectionRef.current,
          start: "top 40%",
          end: "bottom 60%",
          scrub: true,
          toggleActions: "play reverse play reverse"
        }
      });
    }

    // 6. Asymmetric Grid Stagger (Refined with Curtain Reveal)
    const cards = gsap.utils.toArray<HTMLElement>('.category-card');
    cards.forEach((card) => {
      const img = card.querySelector('.category-image');
      const text = card.querySelector('.category-text');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 95%", // Revealing much earlier
          toggleActions: "play none none reverse",
        }
      });

      // 1. The Curtain Reveal (Clip-Path)
      tl.fromTo(card, 
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }, 
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.5, ease: "power4.inOut" }
      )
      // 2. The Subtle Image Parallax
      .fromTo(img, 
        { y: "-15%", scale: 1.1 }, 
        { y: "0%", scale: 1, duration: 1.5, ease: "power3.out" }, 
        "-=1.2"
      )
      // 3. The Text Reveal
      .fromTo(text, 
        { y: 40, opacity: 0, filter: "blur(10px)" }, 
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }, 
        "-=1"
      );
    });

    // 7. Brand Promise Animation
    gsap.fromTo(".promise-item", 
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)', 
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".brand-promise-section",
          start: "top bottom-=50px", // Trigger almost immediately on entry
        }
      }
    );

    // Micro-interaction: Floating Icons
    gsap.to(".promise-icon", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="bg-[#0A0A0A] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden" dir="rtl">
      

      {/* ── Section 1: Cinematic Hero ── */}
      <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover scale-[1.02]"
            src="/videos/ANALIA-gate-desktop.webm"
          />
          <div className="hero-overlay absolute inset-0 bg-[#4B1E28]" />
        </div>

        <div className="relative z-10 text-center px-4">
              <h1 ref={heroTitleRef} className="font-arabic text-5xl md:text-8xl font-bold text-[#D4AF37] mb-12 drop-shadow-2xl">
                أناقة تسبق حضوركِ
              </h1>
              <PulsingCTA href="/products" className="font-arabic">
                اكتشفي المجموعات
              </PulsingCTA>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
        </div>
      </section>

      {/* ── Section 2: The Manifesto ── */}
      <section className="manifesto-section min-h-[100vh] bg-gradient-to-b from-[#0A0A0A] via-[#4B1E28]/15 to-[#0A0A0A] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[80vw] h-auto">
            <path 
              ref={pathRef}
              d="M10 200C150 50 350 350 400 200C450 50 650 350 790 200" 
              stroke="#D4AF37" 
              strokeWidth="1" 
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#4B1E28] blur-[150px] opacity-20 pointer-events-none rounded-full" />
        
        <div className="relative z-10 max-w-4xl">
           <span className="block font-arabic text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]/30 mb-12">The Philosophy</span>
           <h2 ref={manifestoTextRef} className="font-arabic text-3xl md:text-6xl text-[#D4AF37] drop-shadow-xl leading-[1.6] max-w-4xl px-4 font-bold">
            الأنوثة ليست شكلاً.. بل أثرٌ يُترك في المكان.
          </h2>
          <div className="mt-16 text-[#C87D8A]/50 font-arabic text-sm tracking-widest italic">
            جوهر يتخطى الحدود
          </div>
        </div>
      </section>

      {/* ── Section 3: The Horizontal Runway ── */}
      <section ref={runwayRef} id="runway-container" className="h-[100dvh] w-full overflow-hidden bg-[#0A0A0A] border-y border-white/5 relative z-10">
        <div 
          ref={trackRef} 
          className="flex h-full md:pt-[12vh] items-center px-6 md:px-[10vw] gap-16 md:gap-40 w-max will-change-transform"
        >
          {/* Headline Slide */}
          <div className="runway-item w-[60vw] md:w-[40vw] flex-shrink-0">
            <span className="block font-arabic text-[10px] uppercase tracking-[0.8em] text-[#C87D8A] mb-4 block">The Selection</span>
            <h2 className="font-cormorant text-6xl md:text-9xl text-white font-light lowercase">Trending<br/><span className="text-[#D4AF37] font-semibold italic">Pieces</span></h2>
          </div>

          {ALL_PRODUCTS.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="runway-item group w-[75vw] md:w-[35vw] flex-shrink-0 will-change-transform">
              <div className="relative aspect-[3/4.5] md:aspect-[3/4] md:h-[80vh] rounded-t-[40vw] md:rounded-t-[20vw] overflow-hidden bg-[#111] mb-8 shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_50px_rgba(75,30,40,0.3)]">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill
                  className="object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 75vw, 35vw"
                  priority={ALL_PRODUCTS.indexOf(product) < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 right-8 flex flex-col items-end">
                    <span className="font-arabic text-2xl text-white group-hover:text-[#D4AF37] transition-colors font-medium">{product.title}</span>
                    <span className="font-arabic text-xs text-[#D4AF37]/60 mt-2 tracking-[0.2em]">{product.price}</span>
                </div>
              </div>
            </Link>
          ))}

          <div className="runway-item w-[50vw] flex-shrink-0 flex flex-col items-center justify-center">
            <PulsingCTA href="/products" className="font-arabic">تصفحي المجموعات</PulsingCTA>
          </div>
        </div>
      </section>

      {/* ── Section 4: Asymmetric Category Portals ── */}
      <section ref={categorySectionRef} className="categories-section py-40 px-6 md:px-[15vw] relative bg-[#0A0A0A] z-10 transition-colors duration-500">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-32 gap-x-12">
            
            <div className="flex flex-col items-start">
               <div className="category-card overflow-hidden relative group rounded-t-[20vw] aspect-[3/4] w-full mb-8">
                  <div className="category-image w-full h-[120%] absolute -top-[10%] left-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000" 
                      alt="Evening Dresses"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="category-text absolute inset-0 flex items-center justify-center z-10 px-4">
                    <h3 className="font-arabic text-3xl md:text-5xl text-[#D4AF37] drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] text-center font-bold">فساتين السهرة</h3>
                  </div>
                  <Link href="/collections/dresses" className="absolute inset-0 z-20" />
               </div>
               <p className="font-arabic text-sm text-[#C87D8A]/60 italic tracking-[0.1em] pr-4">فستان ما في منه اثنين</p>
            </div>

            <div className="flex flex-col items-end md:mt-20">
               <div className="category-card overflow-hidden relative group rounded-t-[20vw] aspect-[3/4] w-full md:w-[85%] mb-8">
                  <div className="category-image w-full h-[120%] absolute -top-[10%] left-0">
                    <Image 
                      src="/images/luxury-sleepwear.png" 
                      alt="Luxury Sleepwear"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="category-text absolute inset-0 flex items-center justify-center z-10 px-4">
                    <h3 className="font-arabic text-3xl md:text-5xl text-[#D4AF37] drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] text-center font-bold">ملابس النوم</h3>
                  </div>
                  <Link href="/collections/sleepwear" className="absolute inset-0 z-20" />
               </div>
               <p className="font-arabic text-sm text-[#C87D8A]/60 italic tracking-[0.1em] pl-4 text-right">نعومة تلامس خيالكِ</p>
            </div>

            <div className="md:col-span-2 flex flex-col items-center md:pt-40">
               <div className="category-card overflow-hidden relative group rounded-t-[200px] aspect-[16/9] w-full md:w-[85%] mb-8">
                  <div className="category-image w-full h-[120%] absolute -top-[10%] left-0">
                    <Image 
                      src="/images/lingerie-category.png" 
                      alt="Lingerie Collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="category-text absolute inset-0 flex items-center justify-center z-10 px-4">
                    <h3 className="font-arabic text-4xl md:text-7xl text-[#D4AF37] drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] text-center font-bold">اللانجري</h3>
                  </div>
                  <Link href="/collections/lingerie" className="absolute inset-0 z-20" />
               </div>
               <p className="font-arabic text-sm text-[#C87D8A]/60 italic tracking-[0.1em]">ثقة لا تحتاج لبرهان</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 5: Brand Promise ── */}
      <section className="brand-promise-section py-24 px-6 md:px-[10vw] bg-[#0A0A0A] border-t border-[#4B1E28]/30 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-16 md:gap-y-24">
          <div className="promise-item flex flex-col items-center">
            <div className="promise-icon mb-6 p-4 bg-[#D4AF37]/5 rounded-full border border-[#D4AF37]/20">
              <Gift className="text-[#D4AF37]" size={32} strokeWidth={1} />
            </div>
            <h3 className="font-arabic text-xl text-[#D4AF37] mb-4">تغليف يليق بكِ</h3>
            <p className="font-arabic text-[#C87D8A] text-sm leading-relaxed max-w-[280px] opacity-80">
              كل قطعة تصلكِ في صندوق مخملي مُعطر، لتكون لحظة فتحكِ للهدية ذكرى لا تُنسى.
            </p>
          </div>

          <div className="promise-item flex flex-col items-center">
            <div className="promise-icon mb-6 p-4 bg-[#D4AF37]/5 rounded-full border border-[#D4AF37]/20">
              <Wallet className="text-[#D4AF37]" size={32} strokeWidth={1} />
            </div>
            <h3 className="font-arabic text-xl text-[#D4AF37] mb-4">دفع آمن ومرن</h3>
            <p className="font-arabic text-[#C87D8A] text-sm leading-relaxed max-w-[280px] opacity-80">
              خيارات دفع متعددة تضمن لكِ الخصوصية والسهولة، مع خدمة الدفع عند الاستلام.
            </p>
          </div>

          <div className="promise-item flex flex-col items-center">
            <div className="promise-icon mb-6 p-4 bg-[#D4AF37]/5 rounded-full border border-[#D4AF37]/20">
              <Scissors className="text-[#D4AF37]" size={32} strokeWidth={1} />
            </div>
            <h3 className="font-arabic text-xl text-[#D4AF37] mb-4">خياطة حسب القياس</h3>
            <p className="font-arabic text-[#C87D8A] text-sm leading-relaxed max-w-[280px] opacity-80">
              نوفر خدمة التعديل المجاني لضمان أن كل قطعة تعانق تفاصيلكِ بمنتهى الدقة.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-24 bg-black border-t border-white/10 px-6 font-arabic">
        <div className="max-w-6xl mx-auto text-center">
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
          <div className="flex justify-center gap-12 mb-16">
            <Link href="/products" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Products</Link>
            <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Philosophy</Link>
            <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="font-arabic text-[11px] text-white/20 tracking-[0.4em] mb-4">كافة الحقوق محفوظة ٢٠٢٦</p>
          <div className="w-16 h-[1px] bg-white/5 mx-auto" />
        </div>
      </footer>

      <style jsx global>{`
        body { overflow-x: hidden; background: #0A0A0A; }
        .will-change-transform { will-change: transform; }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 25px 8px rgba(212, 175, 55, 0.1); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
      `}</style>
      <DiscountPopup />
    </main>
  );
}
