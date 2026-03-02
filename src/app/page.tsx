"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";

type FormState = "invite" | "waitlist" | "success";
type AccessStatus = "idle" | "error" | "success";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const passageRef = useRef<HTMLDivElement>(null); // For the success access passage text
  const overlayRef = useRef<HTMLDivElement>(null); // To animate background fade to black
  
  const router = useRouter();
  const isInvited = useAppStore((state) => state.isInvited);
  const hasVisitedLobby = useAppStore((state) => state.hasVisitedLobby);
  const setInvited = useAppStore((state) => state.setInvited);

  // All state — must be declared before any conditional returns
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const inviteFormRef = useRef<HTMLDivElement>(null);
  const waitlistFormRef = useRef<HTMLFormElement>(null);
  const successMsgRef = useRef<HTMLDivElement>(null);
  const errorMsgRef = useRef<HTMLParagraphElement>(null);

  const [formState, setFormState] = useState<FormState>("invite");
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("idle");
  const [isFocused, setIsFocused] = useState(false);
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [mounted, setMounted] = useState(false);

  // Hydration guard — Zustand reads localStorage only after mount
  useEffect(() => setMounted(true), []);

  // Redirect if already invited
  useEffect(() => {
    if (mounted && isInvited) {
      router.replace(hasVisitedLobby ? '/products' : '/lobby');
    }
  }, [mounted, isInvited, hasVisitedLobby, router]);

  const { contextSafe } = useGSAP(
    () => {
      if (!logoRef.current || !containerRef.current) return;

      // Initial mount animation (Timeline for sequential slow fade-up)
      const tl = gsap.timeline();

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
      );

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" },
          "-=1.0"
        );
      }

      if (inviteFormRef.current) {
        tl.fromTo(
          inviteFormRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" },
          "-=1.0"
        );
      }
        
      // Ensure other forms are hidden initially
      const hiddenTargets = [waitlistFormRef.current, successMsgRef.current].filter(Boolean);
      if (hiddenTargets.length > 0) {
        gsap.set(hiddenTargets, { 
          autoAlpha: 0, 
          display: "none",
          x: 30 
        });
      }
    },
    { scope: containerRef, dependencies: [mounted] }
  );

  // Safe transition function for GSAP 
  const transitionTo = contextSafe((newState: FormState) => {
    const currentRef = 
      formState === "invite" ? inviteFormRef.current : 
      formState === "waitlist" ? waitlistFormRef.current : 
      successMsgRef.current;
      
    const nextRef = 
      newState === "invite" ? inviteFormRef.current : 
      newState === "waitlist" ? waitlistFormRef.current : 
      successMsgRef.current;

    const tl = gsap.timeline({
      onComplete: () => setFormState(newState)
    });

    // Slide out current staggered
    tl.to(currentRef, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => { gsap.set(currentRef, { display: "none" }); }
    })
    // Slide in next staggered
    .set(nextRef, { display: "flex", x: 30 })
    .to(nextRef, {
      opacity: 1,
      x: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic international phone validation regex
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phoneRegex.test(phone.replace(/\s+/g, ''))) {
      transitionTo("success");
    } else {
      // Optional: Handle error state here, for now simple alert or styling could be added
      alert("يرجى إدخال رقم هاتف صحيح بالصيغة الدولية");
    }
  };

  const handleAccess = contextSafe((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (inviteCode.trim().toUpperCase() === "VIP2026") {
      setAccessStatus("success");
      setInvited(true, inviteCode.trim().toUpperCase());
      
      const tl = gsap.timeline();
      
      // The Passage Ritual Timeline
      tl.to(inviteFormRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(inviteFormRef.current, { display: "none" });
          gsap.set(passageRef.current, { display: "block" });
        }
      })
      .to(overlayRef.current, {
        backgroundColor: "rgba(0, 0, 0, 1)",
        duration: 2,
        ease: "power3.inOut"
      }, "+=0.2")
      .fromTo(passageRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1.05, duration: 2.5, ease: "power3.out", onComplete: () => {
          setTimeout(() => {
            if (hasVisitedLobby) {
              router.push('/products'); // Returning visitor goes straight to products
            } else {
              router.push('/lobby'); // First-time visitor gets the cinematic lobby
            }
          }, 1000);
        } },
        "-=1.5"
      );
      
    } else {
      setAccessStatus("error");
      // Quiet Refusal Animation (Elegant slow pan)
      gsap.fromTo(errorMsgRef.current, 
        { opacity: 0, x: 10 },
        { opacity: 0.8, x: 0, duration: 0.8, ease: "sine.inOut" }
      );
      
      // Optional: hide error after a few seconds
      setTimeout(() => {
        if(errorMsgRef.current) gsap.to(errorMsgRef.current, { opacity: 0, duration: 1 });
      }, 4000);
    }
  });

  // If not yet hydrated or already invited (redirect in progress) — render nothing
  if (!mounted || isInvited) return null;

  return (
    <main
      ref={containerRef}
      className="relative flex h-[100dvh] w-full flex-col items-center justify-center bg-SHAGHAV-black overflow-hidden"
    >
      {/* Video Backgrounds */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60 hidden md:block"
        src="/videos/SHAGHAV-gate-desktop.mp4"
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60 md:hidden"
        src="/videos/SHAGHAV-gate-mobile.mp4"
      />

      {/* Dark Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-SHAGHAV-black/90 via-SHAGHAV-black/40 to-SHAGHAV-black/90 pointer-events-none transition-colors duration-1000" 
      />

      {/* Frost Glass Content Container */}
      <div className="relative z-10 flex w-[90%] max-w-lg flex-col items-center justify-center rounded-2xl p-8 text-center backdrop-blur-sm bg-black/10 shadow-2xl border border-white/5">
        
        {/* Main Logo & Text */}
        <div ref={logoRef} className="flex flex-col items-center opacity-0 drop-shadow-md">
          <Image
            src="/logo.png"
            alt="SHAGHAV Logo"
            width={160}
            height={160}
            className="mb-6 h-40 w-auto object-contain md:h-40 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          />
          <h1 className="font-cormorant text-5xl font-semibold uppercase tracking-[0.2em] text-SHAGHAV-gold md:text-6xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            SHAGHAV
          </h1>
        </div>

        {/* Sub-headline (Arabic) */}
        <p
          ref={subtitleRef}
          className="mb-10 mt-6 font-montserrat text-base font-medium uppercase tracking-[0.4em] text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-0 md:text-lg"
        >
          للحضورِ سَطوة، وللشغفِ عنوان
        </p>

        {/* Forms Wrapper - Keeps layout stable during transitions */}
        <div ref={formWrapperRef} className="relative w-full min-h-[140px] flex justify-center">
          
          <div ref={inviteFormRef} className="absolute flex w-[95%] sm:w-[85%] flex-col items-center mx-auto text-center">
            <p className="mb-5 font-montserrat text-xs tracking-[0.2em] text-white/70 drop-shadow-md">
              دخولٌ مقتصرٌ على أصحابِ الدعواتِ المسبقة.
            </p>

            <div className="relative w-full mb-6 relative">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                   setInviteCode(e.target.value);
                   if (accessStatus === "error") setAccessStatus("idle"); // reset error if typing
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inviteCode.length > 0) {
                    handleAccess();
                  }
                }}
                placeholder="أدخل رمز الدعوة.."
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full bg-transparent py-3 text-center font-montserrat text-base tracking-widest text-white outline-none border-b drop-shadow-sm transition-colors duration-500 placeholder:text-white/30 ${
                  isFocused ? "border-SHAGHAV-gold" : "border-SHAGHAV-gold/30"
                }`}
              />
              
              {/* Help Text / Error Text */}
              <p
                ref={errorMsgRef}
                className={`absolute -bottom-6 left-0 right-0 text-center font-montserrat tracking-widest transition-opacity duration-700 pointer-events-none ${
                  accessStatus === "error" 
                    ? "text-SHAGHAV-burgundy text-xs opacity-80" 
                    : `text-white/50 text-[10px] ${isFocused ? "opacity-100" : "opacity-0"}`
                }`}
              >
                {accessStatus === "error" 
                  ? "نعتذر.. هذا الرمز لا يمنحُ حقَّ العبور." 
                  : "يرجى التأكد من صحة رمز الدعوة الخاص بك"
                }
              </p>
            </div>

            {/* Enter Button (Appears only when typing) */}
            <div className={`transition-all duration-500 overflow-hidden w-full ${inviteCode.length > 0 && accessStatus !== "success" ? "h-12 opacity-100 mb-2 mt-2" : "h-0 opacity-0 mb-0 mt-0"}`}>
               <button 
                  type="button"
                  onClick={(e) => handleAccess(e)}
                  className="w-full max-w-[200px] rounded-full bg-SHAGHAV-gold py-2.5 text-xs font-semibold tracking-widest text-dark hover:bg-[#E5C158] transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] font-montserrat text-black mx-auto"
                >
                  دخول
                </button>
            </div>
            
            <button 
              onClick={() => transitionTo("waitlist")}
              className="mt-4 text-[10px] uppercase tracking-widest text-white/40 hover:text-SHAGHAV-gold transition-colors duration-300 font-montserrat font-medium"
            >
              لا تملك رمزاً؟ اطلب حق الانضمام
            </button>
          </div>

          {/* 2. Waitlist Form */}
          <form
            ref={waitlistFormRef}
            onSubmit={handleWaitlistSubmit}
            className="absolute flex w-[95%] sm:w-[85%] flex-col items-center opacity-0 invisible mx-auto"
          >
             <p className="mb-5 font-montserrat text-xs tracking-[0.2em] text-white/70 drop-shadow-md">
              سجل اهتمامك للانضمام إلى النخبة.
            </p>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقم الهاتف (WhatsApp).."
              dir="rtl"
              className="w-full bg-transparent py-3 text-center font-montserrat text-sm tracking-widest text-white outline-none border-b border-SHAGHAV-gold/40 focus:border-SHAGHAV-gold transition-colors duration-500 placeholder:text-white/30 mb-8"
              required
            />
            
            <button 
              type="submit"
              className="w-full max-w-[200px] rounded-full bg-SHAGHAV-gold py-3 text-xs font-semibold tracking-widest text-SHAGHAV-black hover:bg-[#E5C158] transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] font-montserrat"
            >
              إرسال الطلب
            </button>

            <button 
              type="button"
              onClick={() => transitionTo("invite")}
              className="mt-6 text-[10px] uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors duration-300 font-montserrat"
            >
              العودة لإدخال الرمز
            </button>
          </form>

          {/* 3. Success Message */}
          <div
            ref={successMsgRef}
            className="absolute flex w-[95%] sm:w-[85%] flex-col items-center justify-center opacity-0 invisible h-full mx-auto"
          >
            <div className="w-12 h-12 rounded-full border border-SHAGHAV-gold flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="text-SHAGHAV-gold text-xl">✓</span>
            </div>
            <p className="text-center font-montserrat text-sm leading-relaxed tracking-widest text-white/90 drop-shadow-md">
              تم تسجيل طلبك.
              <br/>
              <span className="text-[11px] text-white/60 mt-3 block leading-loose">
                سيتم إرسال دعوة خاصة لك عبر الواتساب فور توفرها.
              </span>
            </p>
          </div>

          {/* 4. Access Granted Message (Passage Ritual) */}
          <div
            ref={passageRef}
            className="absolute flex w-full flex-col items-center justify-center opacity-0 hidden mx-auto min-h-[140px]"
          >
            <p className="text-center font-cormorant font-semibold text-xl md:text-2xl leading-relaxed tracking-[0.2em] text-SHAGHAV-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              تم تأكيد الاستحقاق..<br/>تُفتح الأبواب.
            </p>
          </div>

        </div>
      </div>
      <footer className="absolute bottom-8 z-10 text-center pointer-events-none">
        <p className="font-montserrat text-[9px] uppercase tracking-[0.5em] text-white/30 drop-shadow-md">
          Shaghav Store — All Rights Reserved 2026
        </p>
      </footer>
    </main>
  );
}
