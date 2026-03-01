"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface WelcomeLetterProps {
  onComplete: () => void;
}

export default function WelcomeLetter({ onComplete }: WelcomeLetterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLElement[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addToTextRefs = (el: HTMLElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Slow staggered entrance
    tl.fromTo(textRefs.current, 
      { opacity: 0, y: 15, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: "power2.out", stagger: 0.8 }
    )
    .fromTo(buttonRef.current,
      { opacity: 0, y: 15, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: "power2.out" },
      "-=1.5"
    );

  }, { scope: containerRef });

  const handleEnter = () => {
    // Disable button to prevent double clicks during animation
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    
    // Cinematic exit
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: onComplete
    });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 md:px-0">
      
      {/* Luxury Pop-up Card */}
      <div className="relative flex flex-col items-center bg-[#0A0A0A] border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] rounded-2xl md:rounded-[2rem] p-10 md:p-16 w-full max-w-2xl overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#4B1E28]/20 before:to-transparent before:pointer-events-none" dir="rtl">
        
        {/* Decorative Top Accent */}
        <div className="w-16 h-[1px] bg-[#D4AF37]/50 mb-8" />

        <h2 ref={addToTextRefs as any} className="relative z-10 font-cormorant text-[#D4AF37] text-3xl md:text-5xl tracking-widest mb-8 drop-shadow-lg text-center font-medium">
          أنتِ لستِ هُنا صُدفة.
        </h2>
        
        <p ref={addToTextRefs as any} className="relative z-10 font-shaghafArabic text-white/80 font-light text-sm md:text-base leading-[2.2] max-w-lg text-center mb-12 drop-shadow-md">
          خلف هذه البوابات، لا توجد أزياء للعامة. لقد وُجد 'شغف' ليُعانق تمردكِ الهادئ، وليُترجم 'الأنا' العميقة بداخلكِ إلى تُحفٍ من الحرير والمخمل. هُنا.. أنتِ لا تختارين القِطع، بل هي التي تتعرّفُ عليكِ.
        </p>
        
        <span ref={addToTextRefs as any} className="relative z-10 font-shaghafArabic text-white/50 text-xs md:text-sm tracking-[0.2em] mb-12">
          بشغف.. لكِ وحدكِ.
        </span>
        
        <button 
          ref={buttonRef} 
          onClick={handleEnter}
          className="relative z-10 group flex items-center justify-center px-12 py-5 bg-[#4B1E28]/60 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_20px_rgba(75,30,40,0.6)] cursor-pointer transition-all duration-700 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] w-full md:w-auto"
        >
          <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
          <span className="relative z-20 font-shaghafArabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-700 text-sm md:text-base tracking-[0.1em] uppercase">
            دعينا نُتوّج حُضوركِ
          </span>
        </button>

      </div>
    </div>
  );
}
