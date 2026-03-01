"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WelcomeLetter from "@/components/WelcomeLetter";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Lobby() {
  const setHasVisitedLobby = useAppStore((state) => state.setHasVisitedLobby);
  const hasLetterBeenRead = useAppStore((state) => state.hasLetterBeenRead);
  const setHasLetterBeenRead = useAppStore((state) => state.setHasLetterBeenRead);

  // Skip WelcomeLetter if already shown before
  const [isLetterRead, setIsLetterRead] = useState(hasLetterBeenRead);
  const containerRef = useRef<HTMLDivElement>(null);

  // Groups for standard text reveals
  const textElementsRef = useRef<HTMLElement[]>([]);
  const addToTextRefs = (el: HTMLElement | null) => {
    if (el && !textElementsRef.current.includes(el)) textElementsRef.current.push(el);
  };

  // Specific refs for complex animations
  const section1ImageRef = useRef<HTMLDivElement>(null);
  const section1ContainerRef = useRef<HTMLElement>(null);
  
  const section2Img1Ref = useRef<HTMLDivElement>(null);
  const section2Img2Ref = useRef<HTMLDivElement>(null);

  const section3Ref = useRef<HTMLElement>(null);
  const section4Ref = useRef<HTMLElement>(null);
  
  const section5Ref = useRef<HTMLElement>(null);
  
  const bgNumbersRef = useRef<HTMLElement[]>([]);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const imageContainersRef = useRef<HTMLDivElement[]>([]);
  const parallaxImagesRef = useRef<HTMLDivElement[]>([]);

  const addToBgNumbers = (el: HTMLElement | null) => {
    if (el && !bgNumbersRef.current.includes(el)) bgNumbersRef.current.push(el);
  };
  
  const addToImgContainers = (el: HTMLDivElement | null) => {
    if (el && !imageContainersRef.current.includes(el)) imageContainersRef.current.push(el);
  };

  const addToParallax = (el: HTMLDivElement | null) => {
    if (el && !parallaxImagesRef.current.includes(el)) parallaxImagesRef.current.push(el);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!section3Ref.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPos = (clientX / innerWidth - 0.5) * 100; // -50 to 50
    const yPos = (clientY / innerHeight - 0.5) * 100;

    parallaxImagesRef.current.forEach((img) => {
      const speed = img.dataset.speed ? parseFloat(img.dataset.speed) : 1;
      gsap.to(img, {
        x: xPos * speed,
        y: yPos * speed,
        duration: 1.5,
        ease: "power2.out",
      });
    });
  };

  useGSAP(
    () => {
      // Do not setup GSAP or ScrollTriggers until the user finishes the letter and the lobby is fully visible
      if (!isLetterRead) return;

      // 1. The Entry Transition (The Fog Reveal)
      gsap.to(containerRef.current, {
        filter: "blur(0px) brightness(1)",
        opacity: 1,
        duration: 2.5,
        ease: "power3.inOut",
      });

      // SECTION 1: Parallax & Scale down slightly on scroll (Scrub)
      if (section1ImageRef.current && section1ContainerRef.current) {
        gsap.fromTo(
          section1ImageRef.current,
          { scale: 1.05, y: "0%" },
          {
            scale: 1,
            y: "15%",
            ease: "none",
            scrollTrigger: {
              trigger: section1ContainerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // SECTION 2: Opposite Parallax
      if (section2Img1Ref.current) {
        gsap.fromTo(
          section2Img1Ref.current,
          { y: 50 },
          {
            y: -50,
            scrollTrigger: {
              trigger: section2Img1Ref.current.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
      if (section2Img2Ref.current) {
        gsap.fromTo(
          section2Img2Ref.current,
          { y: -50 },
          {
            y: 50,
            scrollTrigger: {
              trigger: section2Img2Ref.current.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // SECTION 3: Background Transition
      // Removed JS color interpolation in favor of CSS gradients

      // SECTION 4: Dark Vignette Fade Up
      const s4Elements = section4Ref.current?.querySelectorAll(".s4-reveal");
      if (s4Elements) {
        gsap.fromTo(
          s4Elements,
          { opacity: 0, y: 30, filter: "blur(5px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section4Ref.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // SECTION 5: Transition back to Black & Magnetic Fade-in
      if (section5Ref.current) {
        const s5Elements = section5Ref.current.querySelectorAll(".s5-reveal");
        gsap.fromTo(
          s5Elements,
          { opacity: 0, y: 30, filter: "blur(5px)", scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section5Ref.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Global Text Stagger Reveals (With Blur)
      textElementsRef.current.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0, filter: "blur(5px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
      
      // Background Numbers Scale & Parallax Effect
      bgNumbersRef.current.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.8, y: 50, opacity: 0 },
          {
            scale: 1,
            y: -50,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      // Image Container Reveal (ClipPath & Zoom)
      imageContainersRef.current.forEach((container) => {
        gsap.fromTo(
          container,
          { scale: 0.9, opacity: 0, clipPath: "inset(5% 5% 5% 5%)" },
          {
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.0,
            ease: "power4.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Decorative corner rects — scroll-triggered fade+slide reveal
      const decoRects = containerRef.current?.querySelectorAll('.deco-rect');
      decoRects?.forEach((rect) => {
        const side = (rect as HTMLElement).dataset.side || 'br';
        const yOffset = side.includes('t') ? -30 : 30;
        const xOffset = side.includes('l') ? -20 : 20;
        gsap.fromTo(
          rect,
          { opacity: 0, y: yOffset, x: xOffset },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rect.parentElement,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Scroll Indicator Line Animation
      if (scrollLineRef.current) {
        gsap.fromTo(
          scrollLineRef.current,
          { y: "-100%" },
          { y: "100%", duration: 1.5, repeat: -1, ease: "power1.inOut" }
        );
      }

      // Section 3 floating images — fade + slide reveal on scroll
      parallaxImagesRef.current.forEach((img, i) => {
        gsap.fromTo(
          img,
          { opacity: 0, y: 40 },
          {
            opacity: parseFloat((img.querySelector('div') as HTMLElement)?.style?.opacity || '1') || 0.6,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: section3Ref.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

    },
    { scope: containerRef, dependencies: [isLetterRead] }
  );

  useEffect(() => {
    if (!isLetterRead) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      // Once letter is read and lobby begins, mark as visited
      setHasVisitedLobby(true);
      // Let React unmount WelcomeLetter and browser update scroll flow, then refresh calculations
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isLetterRead, setHasVisitedLobby]);

  return (
    <>
      {!isLetterRead && <WelcomeLetter onComplete={() => { setHasLetterBeenRead(true); setIsLetterRead(true); }} />}
      <main
        ref={containerRef}
        className="bg-SHAGHAV-black min-h-screen text-white overflow-x-hidden selection:bg-SHAGHAV-gold selection:text-black"
        style={{ filter: "blur(20px) brightness(0)", opacity: 0 }}
      >
      
      {/* SECTION 1: 1-of-1 Masterpieces */}
      <section ref={section1ContainerRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#200D11]">
        <div className="absolute left-[-5vw] md:left-[5vw] top-1/2 -translate-y-1/2 z-0 pointer-events-none overflow-hidden">
          <span ref={addToBgNumbers as any} className="inline-block font-cormorant text-[50vw] md:text-[35vw] leading-none text-white/5 select-none drop-shadow-2xl font-bold">
            01
          </span>
        </div>
        
        {/* Massive Negative Space around absolute center focus */}
        <div className="relative w-[80vw] max-w-[500px] aspect-[3/4] z-10 flex flex-col items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#4B1E28] blur-[150px] opacity-40 pointer-events-none z-0" />
          
          {/* Image with dual-corner brand-color frame */}
          <div ref={section1ImageRef} className="absolute inset-0 w-full h-full z-10">
             {/* Bottom-right frame rect */}
             <div className="deco-rect absolute -bottom-5 -right-5 w-full h-full bg-[#4B1E28]/80 z-[-1] rounded-sm" data-side="br" />
             {/* Top-left frame rect */}
             <div className="deco-rect absolute -top-5 -left-5 w-full h-full bg-[#3A1520]/60 z-[-2] rounded-sm" data-side="tl" />
             {/* Image */}
             <div className="w-full h-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
               <img
                 src="/images/shaghaf_masterpiece_1772392229139.png"
                 alt="1 of 1 Masterpiece"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/50" />
             </div>
          </div>

          <div className="relative z-20 flex flex-col items-center text-center gap-7 mt-[30%] px-4" dir="rtl">
            <span ref={addToTextRefs as any} className="font-shaghafArabic font-extralight text-xs tracking-widest text-SHAGHAV-gold border border-SHAGHAV-gold/40 px-6 py-2 backdrop-blur-sm drop-shadow-md">
              قطعة واحدة فقط
            </span>
            <h1 ref={addToTextRefs as any} className="font-cormorant text-5xl md:text-7xl font-medium text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-[0.05em]">
              فستان ما في منه اثنين
            </h1>
            <p ref={addToTextRefs as any} className="font-shaghafArabic font-extralight text-sm tracking-widest text-[#C87D8A] max-w-sm drop-shadow-md leading-relaxed">
              صممناه مرة واحدة، ومستحيل وحدة ثانية تلبس زيه. احجزيه قبل ما يروح عليكِ.
            </p>
            <Link href="/products?filter=1-of-1" ref={addToTextRefs as any} className="group relative flex items-center justify-center px-10 py-4 mt-8 bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-300 hover:border-[#D4AF37] animate-[pulse_1.5s_ease-in-out_infinite] w-fit">
              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 font-shaghafArabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-300 text-sm tracking-widest"> احجزي هذه القطعة </span>
            </Link>
          </div>

        </div>

        {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 opacity-60">
          <span className="font-shaghafArabic font-extralight text-[9px] tracking-[0.2em] text-white">اسحبي للأسفل</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <div ref={scrollLineRef} className="w-full h-full bg-SHAGHAV-gold absolute top-0 left-0" />
          </div>
        </div>
      </section>

      {/* SECTION 2: Couture Dresses */}
      <section className="relative w-full min-h-[120dvh] py-32 px-6 md:px-[10vw] bg-gradient-to-b from-[#200D11] to-[#4B1E28]">
        <div className="absolute right-[-5vw] md:right-[5vw] top-[-5vh] z-0 pointer-events-none overflow-hidden">
          <span ref={addToBgNumbers as any} className="inline-block font-cormorant text-[45vw] md:text-[25vw] leading-none text-white/5 select-none drop-shadow-2xl font-bold">
            02
          </span>
        </div>
        
        <div className="max-w-[1400px] mx-auto relative flex flex-col md:flex-row justify-between pt-20">
          
          <div className="hidden md:absolute right-0 top-32 z-0 opacity-10" style={{ writingMode: 'vertical-rl' }}>
            <h2 className="font-cormorant text-[12vw] leading-none text-white whitespace-nowrap">الفساتين الراقية</h2>
          </div>

          <div className="md:hidden text-center mb-16 w-full opacity-20" dir="rtl">
             <h2 className="font-cormorant text-6xl leading-none text-white whitespace-nowrap">الفساتين الراقية</h2>
          </div>

          <div className="w-full md:w-[45%] flex flex-col z-10" dir="rtl">
            <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-[#4B1E28] blur-[150px] opacity-40 pointer-events-none z-0" />
            {/* Image with dual-corner brand-color frame */}
            <div ref={addToImgContainers as any} className="relative aspect-[3/4] w-full max-w-[400px] ml-auto z-10">
              {/* Bottom-left frame rect */}
              <div className="deco-rect absolute -bottom-5 -left-5 w-full h-full bg-[#4B1E28]/70 z-[-1] rounded-sm" data-side="bl" />
              {/* Top-right frame rect */}
              <div className="deco-rect absolute -top-5 -right-5 w-full h-full bg-[#3A1520]/50 z-[-2] rounded-sm" data-side="tr" />
              {/* Image */}
              <div className="overflow-hidden shadow-2xl w-full h-full">
                <div ref={section2Img1Ref} className="absolute -top-[10%] left-0 w-full h-[120%]">
                   <img src="/images/couture_one_1772392258498.png" alt="Couture 1" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="mt-12 max-w-xs ml-auto relative z-20">
              <h3 ref={addToTextRefs as any} className="font-cormorant text-4xl text-SHAGHAV-gold drop-shadow-md tracking-wider mb-4">إطلالة تسحر العيون</h3>
              <p ref={addToTextRefs as any} className="font-shaghafArabic font-extralight text-sm tracking-widest text-[#C87D8A] leading-loose">
                فساتين مصممة عشان تكوني أجمل وحدة في المكان، وتعبر عن ذوقك الراقي.
              </p>
              <Link href="/products?filter=dresses" ref={addToTextRefs as any} className="group relative flex items-center justify-center px-10 py-4 mt-8 bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-500 hover:border-[#D4AF37] animate-[pulse_3s_ease-in-out_infinite] w-fit">
                <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 font-shaghafArabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-sm tracking-widest"> شوفي الفساتين </span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-[45%] flex flex-col mt-32 md:mt-[30vh] z-10 relative" dir="rtl">
            <div className="absolute top-1/2 left-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-[#4B1E28] blur-[150px] opacity-40 pointer-events-none z-0" />
            {/* Image with dual-corner brand-color frame */}
            <div ref={addToImgContainers as any} className="relative aspect-square w-full max-w-[450px] mr-auto z-10">
              {/* Bottom-right frame rect */}
              <div className="deco-rect absolute -bottom-5 -right-5 w-full h-full bg-[#4B1E28]/70 z-[-1] rounded-sm" data-side="br" />
              {/* Top-left frame rect */}
              <div className="deco-rect absolute -top-5 -left-5 w-full h-full bg-[#3A1520]/50 z-[-2] rounded-sm" data-side="tl" />
              {/* Image */}
              <div className="overflow-hidden shadow-2xl w-full h-full">
                <div ref={section2Img2Ref} className="absolute -top-[10%] left-0 w-full h-[120%]">
                   <img src="/images/couture_two_1772392277554.png" alt="Couture 2" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GRADIENT BLEND: Section 2 to 3 */}
      <div className="w-full h-[20vh] bg-gradient-to-b from-[#4B1E28] to-[#0A0A0A] -mt-1 pointer-events-none" />

      {/* SECTION 3: Luxury Sleepwear (Interactive Parallax Gallery) */}
      <section 
        ref={section3Ref} 
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[120dvh] py-16 overflow-hidden flex flex-col items-center justify-center bg-[#0A0A0A]"
      >
        <div className="absolute left-[-5vw] md:left-[5vw] top-[10vh] z-0 pointer-events-none overflow-hidden">
          <span ref={addToBgNumbers as any} className="inline-block font-cormorant text-[45vw] md:text-[25vw] leading-none text-white/5 select-none drop-shadow-2xl font-bold">
            03
          </span>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#4B1E28] blur-[200px] opacity-40 pointer-events-none z-0" />

        {/* Floating Parallax Images - Increased Density */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10 flex items-center justify-center">
           {/* Center Left */}
           <div ref={addToParallax as any} data-speed="-0.3" className="absolute top-[15%] left-[5%] md:left-[10%] w-[35vw] md:w-[20vw] max-w-[300px] aspect-[3/4] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[3rem] md:rounded-[4rem] overflow-hidden opacity-70 transition-all duration-700 animate-float-1">
               <img src="/images/silk_sleepwear_1772392297928.png" alt="Silk" className="w-full h-full object-cover" />
             </div>
           </div>
           
           {/* Top Right */}
           <div ref={addToParallax as any} data-speed="0.4" className="absolute top-[10%] right-[5%] md:right-[15%] w-[30vw] md:w-[15vw] max-w-[250px] aspect-square z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-[3rem] md:rounded-[4rem] overflow-hidden opacity-50 transition-all duration-700 animate-float-2">
               <img src="/images/lace_details_1772392328266.png" alt="Lace" className="w-full h-full object-cover filter contrast-125" />
             </div>
           </div>

           {/* Bottom Left */}
           <div ref={addToParallax as any} data-speed="0.5" className="absolute bottom-[10%] left-[8%] md:left-[18%] w-[40vw] md:w-[25vw] max-w-[350px] aspect-[4/5] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[3rem] md:rounded-[4rem] overflow-hidden opacity-80 transition-all duration-700 animate-float-3">
               <img src="/images/sleepwear_4_1772393732906.png" alt="Sleepwear" className="w-full h-full object-cover" />
             </div>
           </div>
           
           {/* Center Right */}
           <div ref={addToParallax as any} data-speed="-0.6" className="absolute bottom-[20%] right-[10%] md:right-[5%] w-[45vw] md:w-[22vw] max-w-[320px] aspect-[3/4] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-[3rem] md:rounded-[4rem] overflow-hidden opacity-90 transition-all duration-700 animate-float-1" style={{animationDelay: "1s"}}>
               <img src="/images/sleepwear_5_1772393869461.png" alt="Robe" className="w-full h-full object-cover" />
             </div>
           </div>

           {/* Very Bottom Center (Behind Text) */}
           <div ref={addToParallax as any} data-speed="-0.2" className="absolute top-[5%] md:top-[12%] left-[45%] -translate-x-[50%] w-[35vw] md:w-[15vw] max-w-[200px] aspect-[3/4] z-0 pointer-events-none">
             <div className="w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-full overflow-hidden opacity-30 transition-all duration-700 animate-float-2">
               <img src="/images/sleepwear_3_1772393561702.png" alt="Nightgown" className="w-full h-full object-cover" />
             </div>
           </div>

           {/* Top Left Corner */}
           <div ref={addToParallax as any} data-speed="0.6" className="absolute top-[5%] left-[2%] md:left-[5%] w-[25vw] md:w-[15vw] max-w-[200px] aspect-[4/5] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-[2rem] md:rounded-[3rem] overflow-hidden opacity-60 transition-all duration-700 animate-float-3" style={{animationDelay: "2s"}}>
               <img src="/images/sleepwear_6_1772394511509.png" alt="Beige Silk" className="w-full h-full object-cover saturate-50" />
             </div>
           </div>

           {/* Top Right Corner */}
           <div ref={addToParallax as any} data-speed="-0.5" className="absolute top-[2%] right-[2%] md:right-[8%] w-[28vw] md:w-[16vw] max-w-[220px] aspect-[3/4] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-full overflow-hidden opacity-50 transition-all duration-700 animate-float-1" style={{animationDelay: "1.5s"}}>
               <img src="/images/sleepwear_7_1772394528628.png" alt="Vanity Mirror" className="w-full h-full object-cover" />
             </div>
           </div>

           {/* Bottom Right Edge */}
           <div ref={addToParallax as any} data-speed="0.4" className="absolute bottom-[2%] right-[-2%] md:right-[15%] w-[35vw] md:w-[18vw] max-w-[280px] aspect-[4/5] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-[3rem] md:rounded-[4rem] overflow-hidden opacity-70 transition-all duration-700 animate-float-2" style={{animationDelay: "0.5s"}}>
               <img src="/images/sleepwear_8_1772394548987.png" alt="Emerald Velvet" className="w-full h-full object-cover" />
             </div>
           </div>

           {/* Extra Far Left */}
           <div ref={addToParallax as any} data-speed="0.2" className="absolute top-[40%] left-[-5%] md:left-[2%] w-[25vw] md:w-[12vw] max-w-[180px] aspect-[4/5] z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-full overflow-hidden opacity-40 transition-all duration-700 animate-float-3" style={{animationDelay: "2.5s"}}>
               <img src="/images/silk_sleepwear_1772392297928.png" alt="Details" className="w-full h-full object-cover saturate-50 brightness-[0.7]" />
             </div>
           </div>

           {/* Extra Far Right */}
           <div ref={addToParallax as any} data-speed="-0.4" className="absolute bottom-[25%] right-[-5%] md:right-[2%] w-[25vw] md:w-[14vw] max-w-[200px] aspect-square z-10 pointer-events-none">
             <div className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-[2rem] md:rounded-[3rem] overflow-hidden opacity-50 transition-all duration-700 animate-float-1" style={{animationDelay: "0.8s"}}>
               <img src="/images/lace_details_1772392328266.png" alt="Macro" className="w-full h-full object-cover saturate-50 brightness-[0.6]" />
             </div>
           </div>
        </div>

        {/* Elegant Text Overlay (No Bulky Backgrounds) */}
        <div className="relative max-w-[800px] mx-auto flex flex-col items-center text-center z-20 pointer-events-none px-4" dir="rtl">
          <div className="absolute inset-0 bg-[#0A0A0A] blur-[80px] opacity-70 rounded-full scale-150 z-[-1]" />
          
          <h2 ref={addToTextRefs as any} className="font-cormorant font-medium text-6xl md:text-8xl lg:text-9xl text-SHAGHAV-gold drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)] mb-8 tracking-[0.05em] py-2">
            نعومة الحرير
          </h2>
          <p ref={addToTextRefs as any} className="font-shaghafArabic font-extralight text-sm md:text-lg text-white/90 tracking-[0.15em] mb-12 max-w-lg mx-auto drop-shadow-md leading-loose pointer-events-auto relative z-10">
            لأنك تستاهلي تدلعي نفسك وترتاحي.. <br/>وفرنا لك ملابس نوم راقية ومريحة جداً.
          </p>
          <div className="pointer-events-auto relative z-10 mt-4">
            <Link href="/products?filter=sleepwear" ref={addToTextRefs as any} className="group relative flex items-center justify-center px-12 py-5 bg-transparent border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)] cursor-pointer transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] w-fit rounded-none backdrop-blur-sm mx-auto">
              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 font-shaghafArabic font-light tracking-[0.2em] text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-sm uppercase"> شوفي ملابس النوم </span>
            </Link>
          </div>

        </div>
      </section>

      {/* GRADIENT BLEND: Section 3 to 4 */}
      <div className="w-full h-[20vh] bg-gradient-to-b from-[#0A0A0A] to-black -mt-1 pointer-events-none" />

      {/* SECTION 4: Intimate Lingerie */}
      <section ref={section4Ref} className="relative w-full min-h-[100dvh] flex flex-col justify-center bg-black py-16 px-6 overflow-x-hidden">
        <div className="absolute left-[-5vw] md:left-[5vw] bottom-0 z-0 pointer-events-none">
          <span ref={addToBgNumbers as any} className="inline-block font-cormorant text-[45vw] md:text-[25vw] leading-none text-white/5 select-none drop-shadow-2xl font-bold">
            04
          </span>
        </div>
        <div className="w-full h-full absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#200D11]/30 via-black to-black z-0 pointer-events-none pulse-slow" />
        
        <div className="relative z-10 max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] bg-[#4B1E28] blur-[150px] opacity-40 pointer-events-none z-0" />
            {/* Image with dual-corner brand-color frame */}
            <div className="relative aspect-[3/4] w-full max-w-[500px] mx-auto shadow-[0_0_100px_rgba(0,0,0,1)] s4-reveal z-10">
               {/* Bottom-right frame rect */}
               <div className="deco-rect absolute -bottom-5 -right-5 w-full h-full bg-[#4B1E28]/60 z-[-1] rounded-md" data-side="br" />
               {/* Top-left frame rect */}
               <div className="deco-rect absolute -top-5 -left-5 w-full h-full bg-[#3A1520]/50 z-[-2] rounded-md" data-side="tl" />
               {/* Image */}
               <div className="overflow-hidden w-full h-full rounded-md">
                 <img src="/images/lace_details_1772392328266.png" alt="Lace Macro" className="w-full h-full object-cover brightness-[0.7] contrast-125 saturate-50 hover:brightness-100 transition-all duration-1000" />
               </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col text-center md:text-right" dir="rtl">
            <h2 className="font-cormorant text-5xl md:text-7xl lg:text-8xl text-white/90 mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] s4-reveal tracking-wider">
              تفاصيلك الخاصة
            </h2>
            <p className="font-shaghafArabic font-extralight text-base md:text-lg text-[#C87D8A] tracking-[0.15em] leading-[2.2] max-w-sm ml-auto mr-auto md:mr-0 s4-reveal drop-shadow-md">
              تصاميم ناعمة تزيدك أنوثة وثقة، صممناها بعناية لتناسب أجمل لحظاتك الخاصة.
            </p>
            <div className="mt-12 s4-reveal flex justify-center md:justify-start">
              <Link href="/products?filter=lingerie" className="group relative flex items-center justify-center px-10 py-4 mt-8 bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-300 hover:border-[#D4AF37] animate-[pulse_1.5s_ease-in-out_infinite] w-fit">
                <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 font-shaghafArabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-300 text-sm tracking-widest"> اكتشفي المزيد </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: The Bespoke Atelier */}
      <section ref={section5Ref} className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center text-center py-40 px-6 bg-[#0A0A0A] overflow-hidden" dir="rtl">
        {/* Background section number */}
        <div className="absolute left-[-5vw] md:left-[5vw] top-[-5vh] z-0 pointer-events-none overflow-hidden">
          <span ref={addToBgNumbers as any} className="inline-block font-cormorant text-[45vw] md:text-[25vw] leading-none text-white/5 select-none drop-shadow-2xl font-bold">
            05
          </span>
        </div>
        {/* Full-Section Backdrop Glow — Pulses Up From The Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[70vh] bg-[radial-gradient(ellipse_at_bottom_center,_rgba(75,30,40,0.5)_0%,_transparent_70%)] pointer-events-none z-0 pulse-slow" />
        
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-10">
          
          <span className="font-shaghafArabic font-light text-xs tracking-[0.4em] text-[#C87D8A] s5-reveal uppercase">
            التفصيل حسب الطلب
          </span>
          
          <h2 className="font-cormorant font-semibold text-4xl md:text-6xl lg:text-7xl leading-[1.5] text-SHAGHAV-gold drop-shadow-xl s5-reveal">
            لأنكِ مميزة وما تشبهي أحد..<br/>دعينا نفصل لكِ فستان على ذوقكِ.
          </h2>

          <p className="font-shaghafArabic font-light text-sm md:text-base text-white/50 tracking-[0.1em] leading-[2.2] max-w-md s5-reveal">
            كل خيطة بها قصة، وكل قصة تبدأ بكِ أنتِ.
          </p>

          <Link href="/products?filter=bespoke" className="s5-reveal group relative flex items-center justify-center px-12 py-4 bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-300 hover:border-[#D4AF37] animate-[pulse_1.5s_ease-in-out_infinite] w-fit">
            <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 font-shaghafArabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-300 text-sm tracking-widest"> تواصلي معنا للتفصيل </span>
          </Link>

        </div>
      </section>


      <style jsx global>{`
        .pulse-slow {
          animation: slowPulse 5s ease-in-out infinite alternate;
        }
        @keyframes slowPulse {
          0% { opacity: 0.5; filter: brightness(0.8); }
          100% { opacity: 1; filter: brightness(1.2); }
        }
        @keyframes floatTranslate1 {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -15px; }
        }
        @keyframes floatTranslate2 {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 20px; }
        }
        @keyframes floatTranslate3 {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -25px; }
        }
        .animate-float-1 { animation: floatTranslate1 6s ease-in-out infinite; }
        .animate-float-2 { animation: floatTranslate2 8s ease-in-out infinite; }
        .animate-float-3 { animation: floatTranslate3 7s ease-in-out infinite; }
      `}</style>
    </main>
    </>
  );
}