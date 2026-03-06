"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Lock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const cart = useAppStore((s) => s.cart);
  const clearCart = useAppStore((s) => s.clearCart);
  
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty after hydration, unless we just succeeded
  useEffect(() => {
    if (mounted && cart.length === 0 && !isSuccess) {
      router.push("/products");
    }
  }, [mounted, cart, router, isSuccess]);

  useGSAP(() => {
    if (!mounted) return;

    if (isSuccess) {
      // Reveal Success UI
      gsap.fromTo(successRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      return;
    }

    const tl = gsap.timeline();
    
    // Reveal Header
    tl.from(".checkout-header", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Reveal Summary Card
    tl.from(summaryRef.current, {
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.5");

    // Stagger reveal form fields
    const fields = formRef.current?.querySelectorAll(".reveal-field");
    if (fields) {
      tl.from(fields, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.4");
    }
  }, { dependencies: [mounted, isSuccess], scope: formRef });

  const handleApplyCoupon = () => {
    setCouponError("");
    if (couponCode.toUpperCase() === "ANALIA10") {
      const subtotal = cart.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
      setDiscount(subtotal * 0.1);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode("");
    } else {
      setCouponError("كود الخصم غير صحيح");
      setDiscount(0);
      setAppliedCoupon("");
    }
  };

  const handleConfirmOrder = () => {
    // In a real app, you'd send data to an API here.
    // For now, we simulate success.
    setIsSuccess(true);
    clearCart();
  };

  if (!mounted || (cart.length === 0 && !isSuccess)) {
    return <div className="min-h-screen bg-[#0A0A0A]" />;
  }

  // ─── SUCCESS VIEW ───
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div ref={successRef} className="max-w-md">
          <div className="w-20 h-20 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-10 bg-[#4B1E28]/10">
            <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" strokeWidth={1} />
          </div>
          <h1 className="font-cormorant text-[#D4AF37] text-4xl md:text-5xl mb-6 tracking-wide">
            شكراً لثقتِك
          </h1>
          <p className="font-arabic font-light text-[#C87D8A]/70 text-sm leading-relaxed mb-12 tracking-widest px-4">
            تم استلام طلبكِ بعناية. فريق &quot;شغف&quot; سيتواصل معكِ قريباً عبر الواتساب لتأكيد موعد التسليم.
          </p>
          
          <Link href="/products" className="group relative inline-flex items-center justify-center px-10 py-4 bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#D4AF37]">
            <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 font-arabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-sm tracking-widest">
               العودة للمعرض
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  const total = subtotal; // Shipping is free as requested

  const formatPrice = (n: number) => n.toLocaleString("ar-SA") + " ر.س";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-montserrat" dir="rtl">
      
      {/* ─── MINIMALIST HEADER ─── */}
      <header className="checkout-header fixed top-0 w-full z-50 py-6 bg-[#0A0A0A] border-b border-[#4B1E28] flex items-center justify-center gap-3">
        <Lock className="w-4 h-4 text-[#D4AF37]/60" />
        <a href="/products">
        <h1 className="font-cormorant font-semibold text-2xl text-[#D4AF37] tracking-[0.3em] select-none">
          ANALIA
        </h1>
        </a>
      </header>

      {/* ─── MAIN LAYOUT ─── */}
      <main className="pt-32 pb-24 px-6 md:px-[10vw] flex flex-col-reverse md:flex-row gap-12 md:gap-20 max-w-[1600px] mx-auto">
        
        {/* ──── RIGHT COLUMN: Delivery Form (60%) ──── */}
        <div ref={formRef} className="w-full md:w-[60%] flex flex-col">
          <h2 className="reveal-field font-cormorant text-[#D4AF37] text-3xl mb-10 tracking-wide">
            بيانات التوصيل
          </h2>

          <div className="grid grid-cols-1 gap-1">
            <div className="reveal-field">
              <label className="font-arabic text-[10px] tracking-[0.2em] text-[#C87D8A]/50 block">الاسم الكامل</label>
              <input
                type="text"
                placeholder="اكتبي اسمك هنا..."
                className="w-full bg-transparent border-b border-[#4B1E28] focus:border-[#D4AF37] text-white py-4 outline-none transition-colors mb-8 placeholder-white/10 font-arabic text-sm"
              />
            </div>

            <div className="reveal-field">
              <label className="font-arabic text-[10px] tracking-[0.2em] text-[#C87D8A]/50 block">رقم الجوال (للتواصل عبر الواتساب)</label>
              <input
                type="tel"
                placeholder="7xxxxxxxx"
                className="w-full bg-transparent border-b border-[#4B1E28] focus:border-[#D4AF37] text-white py-4 outline-none transition-colors mb-8 placeholder-white/10 font-arabic text-sm"
              />
            </div>

            <div className="reveal-field">
              <label className="font-arabic text-[10px] tracking-[0.2em] text-[#C87D8A]/50 block">المدينة</label>
              <input
                type="text"
                placeholder="مثلاً: الرياض، جدة..."
                className="w-full bg-transparent border-b border-[#4B1E28] focus:border-[#D4AF37] text-white py-4 outline-none transition-colors mb-8 placeholder-white/10 font-arabic text-sm"
              />
            </div>

            <div className="reveal-field">
              <label className="font-arabic text-[10px] tracking-[0.2em] text-[#C87D8A]/50 block">العنوان بالتفصيل (الحي، الشارع)</label>
              <input
                type="text"
                placeholder="حي النرجس، شارع..."
                className="w-full bg-transparent border-b border-[#4B1E28] focus:border-[#D4AF37] text-white py-4 outline-none transition-colors mb-12 placeholder-white/10 font-arabic text-sm"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="reveal-field">
             <div className="relative border border-[#D4AF37] bg-[#4B1E28]/10 p-8 flex items-start gap-6 overflow-hidden">
                {/* Subtle Inner Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
                
                <div className="flex-1 flex flex-col gap-2 relative z-10">
                  <h3 className="text-[#D4AF37] font-arabic text-lg tracking-wide">
                    الدفع عند الاستلام (التسليم يداً بيد)
                  </h3>
                  <p className="text-[#C87D8A]/70 font-arabic text-xs leading-relaxed max-w-sm">
                    راحتكِ تهمنا، ادفعي بأمان عند استلام قطعتكِ وتأكدكِ من جودتها.
                  </p>
                </div>

                <CheckCircle2 className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
             </div>
          </div>

          {/* Final CTA Button */}
          <div className="reveal-field">
            <button 
              onClick={handleConfirmOrder}
              className="group relative flex items-center justify-center px-10 py-5 mt-14 w-full bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-500 hover:border-[#D4AF37] animate-[pulse_3s_ease-in-out_infinite]"
            >
              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 font-arabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-lg tracking-[0.2em]">
                تأكـيد الـطـلـب
              </span>
            </button>
          </div>

          <p className="reveal-field text-center text-[10px] text-white/15 tracking-[0.3em] mt-8 font-arabic">
             بضغطكِ على تأكيد الطلب، توافقين على شروط الاستخدام وسياسة الخصوصية.
          </p>
        </div>

        {/* ──── LEFT COLUMN: Order Summary (40%) ──── */}
        <aside ref={summaryRef} className="w-full md:w-[40%]">
          <div className="sticky top-32 border border-white/5 bg-white/[0.02] p-8 md:p-10">
            <h2 className="font-cormorant text-[#D4AF37] text-2xl mb-10 tracking-wide border-b border-white/5 pb-6">
              حقيبة المقتنيات
            </h2>

            <div className="flex flex-col gap-8 mb-10 overflow-y-auto max-h-[40vh] no-scrollbar">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-4 group">
                  <div className="relative w-16 aspect-[3/4] flex-shrink-0 overflow-hidden border border-white/5">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-cormorant text-sm text-white/80 truncate tracking-wide">{item.title}</h3>
                    <p className="font-arabic text-[10px] text-[#C87D8A]/50 mt-1">
                      {item.color} · {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                       <span className="font-cormorant text-xs text-[#D4AF37]">{item.price}</span>
                       <span className="font-arabic text-[9px] text-white/20">× {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Coupon Section ── */}
            <div className="mb-8 p-4 border border-[#4B1E28]/50 bg-[#4B1E28]/5">
              <label className="font-arabic text-[9px] tracking-[0.2em] text-[#C87D8A]/50 block mb-2">هل لديكِ كود خصم؟</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="ادخلي الكود هنا..."
                  className="flex-1 bg-transparent border-b border-[#4B1E28] focus:border-[#D4AF37] text-white py-2 outline-none transition-colors placeholder-white/10 font-arabic text-xs"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 border border-[#D4AF37]/30 text-[#D4AF37] font-arabic text-[10px] tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                  تطبيق
                </button>
              </div>
              {couponError && <p className="text-red-400 text-[10px] mt-2 font-arabic">{couponError}</p>}
              {appliedCoupon && <p className="text-[#D4AF37] text-[10px] mt-2 font-arabic animate-pulse">تم تطبيق كود: {appliedCoupon} ✓</p>}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/5 pt-8">
              <div className="flex items-center justify-between font-arabic text-xs text-white/40 tracking-wider">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between font-arabic text-xs text-[#D4AF37] tracking-wider">
                  <span>الخصم</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-arabic text-xs text-[#C87D8A]/80 tracking-wider">
                <span>الشحن</span>
                <span>مجاناً</span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="font-arabic text-sm text-[#D4AF37]/60 tracking-widest">الإجمالي</span>
                <span className="font-cormorant text-2xl text-[#D4AF37] font-semibold">{formatPrice(subtotal - discount)}</span>
              </div>
            </div>

            <Link href="/products" className="flex items-center justify-center gap-2 mt-10 font-arabic text-[10px] text-white/20 hover:text-[#D4AF37]/50 transition-colors duration-300 tracking-[0.2em] group">
               تعديل الحقيبة
               <ChevronRight className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </aside>

      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
