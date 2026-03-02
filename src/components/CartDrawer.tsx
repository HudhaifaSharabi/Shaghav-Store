"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Cart Drawer ───────────────────────────────────────────────────────────────

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cart          = useAppStore((s) => s.cart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const updateQuantity = useAppStore((s) => s.updateQuantity);

  const drawerRef   = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // ── GSAP slide animation ──
  useEffect(() => {
    if (!drawerRef.current || !backdropRef.current) return;

    if (isOpen) {
      gsap.set([drawerRef.current, backdropRef.current], { display: "flex" });
      gsap.set(backdropRef.current, { display: "block" });
      gsap.fromTo(drawerRef.current,  { x: "100%" }, { x: "0%",  duration: 0.5,  ease: "power3.out" });
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(drawerRef.current, {
        x: "100%", duration: 0.4, ease: "power3.in",
        onComplete: () => { if (drawerRef.current) gsap.set(drawerRef.current, { display: "none" }); },
      });
      gsap.to(backdropRef.current, {
        opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => { if (backdropRef.current) gsap.set(backdropRef.current, { display: "none" }); },
      });
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // ── Subtotal ──
  const subtotal = cart.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  const formatPrice = (n: number) => n.toLocaleString("ar-SA") + " ر.س";

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-[60]"
        style={{ display: "none" }}
      />

      {/* ── Drawer Panel (slides from the right in RTL) ── */}
      <div
        ref={drawerRef}
        dir="rtl"
        className="fixed top-0 right-0 h-full w-[90vw] md:w-[420px] bg-[#0A0A0A] border-l border-[#D4AF37]/20 z-[70] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.6)]"
        style={{ display: "none", transform: "translateX(100%)" }}
      >
        {/* Top glow */}
        <div className="absolute top-0 right-0 left-0 h-32 bg-[radial-gradient(ellipse_at_top_center,_rgba(75,30,40,0.25)_0%,_transparent_70%)] pointer-events-none z-0" />

        {/* ─── HEADER ─── */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]/50" strokeWidth={1} />
            <h2 className="font-cormorant font-semibold text-2xl text-[#D4AF37] tracking-wide">
              حقيبة المقتنيات
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {cart.length > 0 && (
              <span className="font-SHAGHAVArabic text-[10px] tracking-[0.2em] text-white/25">
                {cart.length} {cart.length === 1 ? "قطعة" : "قطع"}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#C87D8A]/50 hover:text-[#C87D8A] transition-colors duration-300"
              aria-label="إغلاق الحقيبة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── BODY ─── */}
        <div className="relative z-10 flex-1 overflow-y-auto">

          {/* ── Empty State ── */}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/15 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#D4AF37]/20" strokeWidth={1} />
              </div>
              <div>
                <p className="font-cormorant text-xl text-white/30 tracking-wide mb-2">
                  حقيبتك فارغة حالياً
                </p>
                <p className="font-SHAGHAVArabic text-[11px] text-white/15 tracking-[0.2em]">
                  لم تُضاف أي قطعة بعد
                </p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="font-SHAGHAVArabic text-[11px] tracking-[0.25em] text-[#D4AF37]/50 border border-[#D4AF37]/25 px-6 py-3 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]/80 transition-all duration-500"
              >
                اكتشفي المتجر
              </Link>
            </div>
          )}

          {/* ── Items List ── */}
          {cart.length > 0 && (
            <ul className="px-6 py-4 flex flex-col divide-y divide-white/[0.05]">
              {cart.map((item) => {
                const isOneOfOne = item.category === "1-of-1";
                return (
                  <li key={item.cartId} className="py-6 flex gap-4">

                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-20 aspect-[3/4] overflow-hidden bg-white/[0.03]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      {isOneOfOne && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#4B1E28]/80 py-0.5 text-center">
                          <span className="font-SHAGHAVArabic text-[8px] tracking-[0.15em] text-[#D4AF37]/80">١/١</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <h3 className="font-cormorant text-base text-white/85 leading-snug mb-1 tracking-wide">
                        {item.title}
                      </h3>
                      <p className="font-SHAGHAVArabic text-[11px] text-[#C87D8A]/60 tracking-[0.05em] mb-3">
                        اللون: {item.color} · المقاس: {item.size}
                      </p>
                      <span className="font-cormorant text-base text-[#D4AF37] tracking-wide mb-3">
                        {item.price}
                        {item.quantity > 1 && (
                          <span className="font-SHAGHAVArabic text-[10px] text-white/25 mr-2">× {item.quantity}</span>
                        )}
                      </span>

                      {/* Controls row */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="font-SHAGHAVArabic text-[11px] tracking-[0.1em] text-[#C87D8A]/40 hover:text-[#C87D8A] transition-colors duration-300"
                        >
                          إلغاء
                        </button>

                        {/* Quantity */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center border border-white/15">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:bg-[#4B1E28]/20 transition-all duration-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center font-cormorant text-sm text-white/70">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => !isOneOfOne && updateQuantity(item.cartId, item.quantity + 1)}
                              disabled={isOneOfOne}
                              className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                                isOneOfOne
                                  ? "opacity-25 cursor-not-allowed text-white/20"
                                  : "text-white/40 hover:text-[#D4AF37] hover:bg-[#4B1E28]/20"
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {isOneOfOne && (
                            <span className="font-SHAGHAVArabic text-[9px] tracking-[0.12em] text-[#D4AF37]/50">
                              قطعة فريدة لا تتكرر
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ─── FOOTER ─── */}
        {cart.length > 0 && (
          <div className="relative z-10 mt-auto border-t border-[#4B1E28]/60 p-6 bg-[#0A0A0A]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-SHAGHAVArabic text-[10px] tracking-[0.15em] text-white/20">شامل الضريبة</span>
              <div className="flex items-center gap-3">
                <span className="font-SHAGHAVArabic text-[11px] tracking-[0.15em] text-white/35">المجموع الإجمالي</span>
                <span className="font-cormorant text-xl text-[#D4AF37] tracking-wide">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="w-full h-px bg-white/[0.05] my-5" />

            <Link
              href="/checkout"
              onClick={onClose}
              className="group relative flex items-center justify-center px-10 py-4 w-full bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-500 hover:border-[#D4AF37] animate-[pulse_3s_ease-in-out_infinite]"
            >
              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 font-SHAGHAVArabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-sm tracking-widest">
                إتـمـام الـطـلـب
              </span>
            </Link>

            <p className="text-center font-SHAGHAVArabic text-[9px] tracking-[0.2em] text-white/15 mt-4">
              دفع آمن · تشفير كامل · استرجاع ٧ أيام
            </p>
          </div>
        )}
      </div>
    </>
  );
}
