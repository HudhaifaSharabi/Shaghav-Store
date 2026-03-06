"use client";

import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { X, CheckCircle2 } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000); // 15 seconds delay

    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (isOpen) {
      const tl = gsap.timeline();

      tl.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(containerRef.current, 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, 
        "-=0.4"
      )
      .fromTo(".popup-stagger", 
        { y: 30, opacity: 0, filter: "blur(10px)" }, 
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.15, ease: "power3.out" }, 
        "-=0.4"
      );
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 8) {
      setError("يرجى إدخال رقم هاتف صحيح");
      return;
    }
    setIsSubmitted(true);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const closePopup = () => {
    gsap.to(containerRef.current, { 
      scale: 0.9, 
      opacity: 0, 
      duration: 0.4, 
      ease: "power2.in",
      onComplete: () => setIsOpen(false) 
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, delay: 0.1 });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-8"
      dir="rtl"
    >
      <div 
        ref={containerRef}
        className="bg-[#0A0A0A] border border-[#D4AF37]/30 w-full max-w-4xl h-auto md:min-h-[500px] flex flex-col md:flex-row-reverse items-stretch overflow-hidden relative shadow-[0_0_80px_rgba(75,30,40,0.4)] rounded-sm"
      >
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-6 left-6 text-[#C87D8A] hover:text-[#D4AF37] transition-colors z-50 p-2"
        >
          <X size={28} strokeWidth={1.5} />
        </button>

        {/* Right Side: Visual */}
        <div className="w-full md:w-1/2 h-48 md:h-auto relative overflow-hidden">
          <img 
            src="/images/popup-bg.png" 
            className="absolute inset-0 w-full h-full object-cover scale-105" 
            alt="Luxury Discount" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#4B1E28]/20 to-[#0A0A0A]/60" />
          <div className="absolute inset-0 bg-[#4B1E28]/10 mix-blend-overlay" />
        </div>

        {/* Left Side: Content */}
        <div 
          ref={contentRef}
          className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center text-right"
        >
          {!isSubmitted ? (
            <>
              <h2 className="popup-stagger font-arabic text-[#D4AF37] text-3xl md:text-4xl mb-6 font-normal tracking-wide">
                انضمي لنخبة شغف
              </h2>
              <p className="popup-stagger font-arabic text-[#C87D8A] text-base leading-relaxed mb-10 opacity-90">
                لأنكِ تستحقين الأفضل، نود إطلاعكِ على أحدث مجموعاتنا الحصرية. اتركي رقمكِ واحصلي على خصم خاص لطلبكِ القادم.
              </p>

              <form onSubmit={handleSubmit} className="popup-stagger space-y-4">
                <div className="relative font-arabic">
                  <PhoneInput
                    country={"ye"}
                    value={phoneNumber}
                    onChange={(phone) => setPhoneNumber(phone)}
                    inputProps={{
                      onKeyDown: handleKeyDown
                    }}
                    containerClass="luxury-phone-input"
                    inputClass="!w-full !bg-transparent !border-b !border-t-0 !border-l-0 !border-r-0 !border-[#4B1E28] !text-[#F5F5F5] !h-14 !text-lg !pr-16 !pl-4 !rounded-none focus:!border-[#D4AF37] transition-all"
                    buttonClass="!bg-transparent !border-none !rounded-none"
                    dropdownClass="!bg-[#111] !text-white !border-[#4B1E28]"
                    placeholder="رقم الهاتف"
                  />
                  {error && <p className="text-red-500 text-xs mt-2 pr-1">{error}</p>}
                </div>

                <button 
                  onClick={() => handleSubmit()}
                  type="button" 
                  className="group relative flex items-center justify-center px-8 py-4 mt-8 w-full bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-500 hover:border-[#D4AF37] animate-[pulse_3s_ease-in-out_infinite]"
                >
                  <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                  <span className="relative z-10 font-arabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-sm tracking-widest">
                    احصلي على الكوبون
                  </span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="popup-stagger flex justify-center mb-6">
                <CheckCircle2 size={70} strokeWidth={1} color="#D4AF37" className="animate-bounce" />
              </div>
              <h3 className="popup-stagger font-arabic text-[#D4AF37] text-3xl mb-4 font-normal">
                أهلاً بكِ في عالمنا
              </h3>
              <p className="popup-stagger font-arabic text-[#C87D8A] text-lg mb-10">
                كود الخصم الحصري الخاص بكِ هو:
              </p>
              <div className="popup-stagger border-2 border-dashed border-[#D4AF37]/60 p-6 rounded-sm bg-[#D4AF37]/5">
                <span className="font-montserrat text-[#D4AF37] text-4xl font-black tracking-[0.3em]">
                  ANALIA10
                </span>
              </div>
              <p className="popup-stagger font-arabic text-[#C87D8A]/50 text-xs mt-8 italic">
                * يطبق الخصم عند الدفع لأول طلب
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .luxury-phone-input .selected-flag {
          background-color: transparent !important;
          padding-right: 12px !important;
        }
        .luxury-phone-input .form-control {
          font-family: var(--font-aref-ruqaa) !important;
          direction: ltr !important;
          text-align: left !important;
        }
        .luxury-phone-input .flag-dropdown {
          border-left: 1px solid #4B1E28 !important;
        }
        .luxury-phone-input .country-list .country-name {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
