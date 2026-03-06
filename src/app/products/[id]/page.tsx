"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ChevronDown, Gift, Shield, Truck } from "lucide-react";
import { ALL_PRODUCTS, getProductById } from "@/lib/products";
import { useAppStore } from "@/store/useAppStore";
import { useParams, useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

// ─── Default Mock Data (Fallback) ─────────────────────────────────────────────

const DEFAULT_METADATA = {
  colors: [
    { name: "عنابي ملكي",  hex: "#4B1E28", image: "/images/ANALIA_masterpiece_1772392229139.png" },
    { name: "أسود أونيكس", hex: "#1a1a1a", image: "/images/couture_one_1772392258498.png" },
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
};

interface Review {
  author: string;
  location: string;
  text: string;
  rating: number;
  image?: string;
  verified: boolean;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    author: "نورة م.", location: "الرياض",
    text: "الخامة تفوق التوقعات تماماً، القطعة تشعرك بالثقة المطلقة في كل لحظة. التفصيل دقيق والبطانة ناعمة جداً.",
    rating: 5, image: "/images/couture_one_1772392258498.png", verified: true, date: "يناير ٢٠٢٦",
  },
  {
    author: "رنا ع.", location: "جدة",
    text: "استلمت القطعة وهي مُغلّفة بعناية مذهلة. التفاصيل فائقة الجمال والألوان طابقت الصور بشكل مثالي.",
    rating: 5, image: "/images/lace_details_1772392328266.png", verified: true, date: "ديسمبر ٢٠٢٥",
  },
  {
    author: "سارة ك.", location: "الدمام",
    text: "ارتديتها في حفل الزفاف وكنت محور الاهتمام. الجميع سألوا عن الفستان. شكراً شغف!",
    rating: 5, verified: true, date: "نوفمبر ٢٠٢٥",
  },
  {
    author: "لمى ص.", location: "مكة",
    text: "جودة استثنائية وتوصيل سريع. القطعة تستحق كل ريال.",
    rating: 4, verified: true, date: "أكتوبر ٢٠٢٥",
  },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRow({ rating, small = false }: { rating: number; small?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`${small ? "text-[10px]" : "text-sm"} ${s <= rating ? "text-[#D4AF37]" : "text-white/15"}`}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

// ─── Accordion Item ────────────────────────────────────────────────────────────

function AccordionItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-right group"
      >
        <span className="font-arabic text-sm tracking-[0.12em] text-white/70 group-hover:text-white transition-colors duration-300">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#D4AF37]/50 transition-transform duration-400 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-48 pb-5" : "max-h-0"}`}
      >
        <p className="font-arabic font-light text-sm text-white/40 leading-loose tracking-[0.1em]">
          {content}
        </p>
      </div>
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ text: "", author: "", rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  const submitReview = () => {
    if (!newReview.text.trim() || !newReview.author.trim()) return;
    setReviews((prev) => [
      {
        author: newReview.author,
        location: "عميلة جديدة",
        text: newReview.text,
        rating: newReview.rating,
        verified: false,
        date: "الآن",
      },
      ...prev,
    ]);
    setNewReview({ text: "", author: "", rating: 5 });
    setShowForm(false);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.05]" dir="rtl">

      {/* Header + Summary */}
      <div className="flex flex-col md:flex-row md:items-start gap-10 mb-14">

        {/* Left: title + big rating */}
        <div className="flex-shrink-0">
          <span className="block font-arabic text-[9px] tracking-[0.4em] text-[#C87D8A]/50 mb-3">تقييمات العملاء</span>
          <h2 className="font-cormorant font-semibold text-3xl text-white/80 tracking-wide mb-4">آراء النخبة</h2>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-cormorant text-6xl text-[#D4AF37]">{avgRating.toFixed(1)}</span>
            <span className="font-arabic text-[11px] tracking-[0.2em] text-white/30">/ ٥ · {reviews.length} تقييم</span>
          </div>
          <StarRow rating={Math.round(avgRating)} />
        </div>

        {/* Right: rating distribution bars */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {ratingCounts.map(({ n, count }) => (
            <div key={n} className="flex items-center gap-3">
              <span className="font-arabic text-[10px] tracking-wide text-white/30 w-4 text-center">{n}</span>
              <span className="text-[#D4AF37]/60 text-[10px]">✦</span>
              <div className="flex-1 h-1 bg-white/[0.06] relative">
                <div
                  className="h-full bg-[#D4AF37]/40 transition-all duration-700"
                  style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="font-arabic text-[10px] text-white/20 w-4 text-center">{count}</span>
            </div>
          ))}
        </div>

        {/* Write review button */}
        <div className="flex-shrink-0 self-start">
          <button
            onClick={() => setShowForm(!showForm)}
            className="font-arabic text-[11px] tracking-[0.2em] text-[#D4AF37]/70 border border-[#D4AF37]/30 px-6 py-3 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
          >
            {showForm ? "إلغاء" : "+ أضيفي رأيك"}
          </button>
        </div>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="border border-white/[0.07] bg-white/[0.01] p-8 mb-10">
          <h3 className="font-cormorant text-xl text-white/70 mb-6 tracking-wide">شاركينا تجربتك</h3>
          {/* Star picker */}
          <div className="flex gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewReview((r) => ({ ...r, rating: s }))}
                className={`text-2xl transition-colors duration-150 ${
                  s <= (hoverRating || newReview.rating) ? "text-[#D4AF37]" : "text-white/15"
                }`}
              >
                ✦
              </button>
            ))}
          </div>
          <input
            value={newReview.author}
            onChange={(e) => setNewReview((r) => ({ ...r, author: e.target.value }))}
            placeholder="اسمك (اختياري)"
            className="w-full bg-transparent border-b border-white/[0.1] focus:border-[#D4AF37]/50 text-white/60 font-arabic text-sm py-2.5 mb-4 outline-none placeholder-white/20 tracking-[0.1em] transition-colors duration-300"
          />
          <textarea
            value={newReview.text}
            onChange={(e) => setNewReview((r) => ({ ...r, text: e.target.value }))}
            placeholder="اكتبي رأيك بالقطعة..."
            rows={3}
            className="w-full bg-transparent border-b border-white/[0.1] focus:border-[#D4AF37]/50 text-white/60 font-arabic text-sm py-2.5 mb-6 outline-none placeholder-white/20 tracking-[0.1em] resize-none transition-colors duration-300"
          />
          <button
            onClick={submitReview}
            className="font-arabic text-sm tracking-widest text-black bg-[#D4AF37] px-8 py-3 hover:bg-[#E5C158] transition-colors duration-300"
          >
            نشر الرأي
          </button>
        </div>
      )}

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="border border-white/[0.07] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-500 overflow-hidden"
          >
            {/* Customer photo if available */}
            {review.image && (
              <div className="relative aspect-[16/7] overflow-hidden">
                <img src={review.image} alt="صورة العميلة" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 right-4 font-arabic text-[9px] tracking-[0.2em] text-white/50">
                  صورة العميلة بعد الاستلام
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Rating row */}
              <div className="flex items-center justify-between mb-4">
                <StarRow rating={review.rating} small />
                <span className="font-arabic text-[9px] tracking-[0.15em] text-white/20">{review.date}</span>
              </div>

              {/* Quote */}
              <p className="font-arabic font-light text-sm text-white/55 leading-loose tracking-[0.08em] mb-5">
                {review.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4B1E28]/60 border border-[#D4AF37]/20 flex items-center justify-center">
                  <span className="font-cormorant text-xs text-[#D4AF37]/60">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-arabic text-[11px] tracking-[0.15em] text-white/50">{review.author}</p>
                  <p className="font-arabic text-[9px] tracking-[0.1em] text-white/20">
                    {review.location} · {review.verified ? "عميلة موثّقة ✓" : "عميلة جديدة"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addToStoreCart = useAppStore((s) => s.addToCart);

  const productId = Number(params?.id);
  const product = getProductById(productId);

  // If product not found, redirect or show error
  useEffect(() => {
    if (!product && productId) {
      router.push("/products");
    }
  }, [product, productId, router]);

  const colors = product?.colors || DEFAULT_METADATA.colors;
  const sizes = product?.sizes || DEFAULT_METADATA.sizes;
  const thumbnails = product?.thumbnails || [product?.image || ""];

  const [activeImage, setActiveImage] = useState(thumbnails[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imgVisible, setImgVisible] = useState(true);
  const [showSizeError, setShowSizeError] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.thumbnails?.[0] || product.image);
      setSelectedColor(product.colors?.[0] || DEFAULT_METADATA.colors[0]);
    }
  }, [product]);

  const RELATED = ALL_PRODUCTS.filter((p) => p.id !== productId).slice(0, 4);

  if (!product) return <div className="min-h-screen bg-[#0A0A0A]" />;

  const sectionRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Smooth image transition on color/thumbnail change
  const switchImage = useCallback((src: string) => {
    setImgVisible(false);
    setTimeout(() => {
      setActiveImage(src);
      setImgVisible(true);
    }, 220);
  }, []);

  const handleColorSelect = (color: typeof colors[0]) => {
    setSelectedColor(color);
    switchImage(color.image);
  };

  // ── Desktop ScrollTrigger pin ──
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () =>
            `+=${(sectionRef.current?.offsetHeight ?? 0) - window.innerHeight}`,
          pin: imageColRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        });
      });

      // Stagger reveal on the right side
      const items = detailsRef.current?.querySelectorAll(".reveal-item");
      if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.1, delay: 0.15 }
        );
      }
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // ── Fly-to-Cart ──
  const handleAddToCart = useCallback(() => {
    if (!selectedSize) {
      setShowSizeError(true);
      // Optional: Smooth scroll to size selector or shake animation
      const sizeSelector = document.getElementById("size-selector");
      sizeSelector?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const imgEl = document.getElementById("product-image");
    const cartEl = document.getElementById("cart-icon");
    if (!imgEl || !cartEl) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();
    const sourceImg = imgEl.querySelector("img");
    if (!sourceImg) return;

    const clone = sourceImg.cloneNode(true) as HTMLImageElement;
    Object.assign(clone.style, {
      position: "fixed",
      top: `${imgRect.top}px`,
      left: `${imgRect.left}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
      objectFit: "cover",
      zIndex: "9999",
      borderRadius: "4px",
      pointerEvents: "none",
      margin: "0",
    });
    document.body.appendChild(clone);

    // Actual Logics (Add to Zustand)
    addToStoreCart({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: activeImage,
      category: product.category,
      color: selectedColor.name,
      size: selectedSize || "غير محدد",
      quantity: quantity,
    });

    gsap.to(clone, {
      top: cartRect.top + cartRect.height / 2,
      left: cartRect.left + cartRect.width / 2,
      width: 0,
      height: 0,
      scale: 0.1,
      opacity: 0.4,
      borderRadius: "50%",
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        document.body.removeChild(clone);
        gsap.fromTo(cartEl, { scale: 1 }, {
          scale: 1.5, duration: 0.15, ease: "power2.out",
          yoyo: true, repeat: 1,
          onComplete: () => { gsap.set(cartEl, { scale: 1 }); },
        });
      },
    });
  }, [product, activeImage, selectedColor, selectedSize, quantity, addToStoreCart]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white" dir="rtl">

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-0">
        <nav className="flex items-center gap-2 font-arabic text-[10px] tracking-[0.2em] text-white/20">
          <Link href="/lobby" className="hover:text-[#D4AF37]/50 transition-colors duration-300">المعرض</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#D4AF37]/50 transition-colors duration-300">المُقتنيات</Link>
          <span>/</span>
          <span className="text-white/35">{product.title}</span>
        </nav>
      </div>

      {/* ══════════════════════════════════════════
          MAIN SPLIT: Image Gallery | Details
      ══════════════════════════════════════════ */}
      <div ref={sectionRef} className="flex flex-col md:flex-row">

        {/* ──── LEFT: Image Gallery ──── */}
        <div
          ref={imageColRef}
          className="w-full md:w-1/2 md:h-screen relative flex flex-col items-center justify-center bg-[#0A0A0A] py-10 px-6 md:px-10 gap-6"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(75,30,40,0.35)_0%,_transparent_70%)] pointer-events-none z-0" />

          {/* Main Image */}
          <div
            id="product-image"
            className="relative w-full max-w-[460px] aspect-[3/4] z-10"
          >
            <div className="absolute -bottom-5 -right-5 w-full h-full bg-[#4B1E28]/45 z-[-1]" />
            <div className="absolute -top-5 -left-5 w-full h-full bg-[#3A1520]/30 z-[-2]" />
            <div className="w-full h-full overflow-hidden">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
                style={{
                  opacity: imgVisible ? 1 : 0,
                  transition: "opacity 0.22s ease-in-out",
                }}
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 z-10 overflow-x-auto no-scrollbar max-w-full px-4">
            {thumbnails.map((src, i) => (
              <button
                key={i}
                onClick={() => switchImage(src)}
                className={`relative w-16 h-20 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                  activeImage === src
                    ? "ring-1 ring-[#D4AF37] ring-offset-1 ring-offset-[#0A0A0A]"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ──── RIGHT: Details ──── */}
        <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center">
          <div
            ref={detailsRef}
            className="px-8 md:px-14 lg:px-20 py-12 pb-36 md:pb-16 flex flex-col gap-0"
          >

            {/* Category label */}
            <span className="reveal-item inline-block self-start font-arabic text-[9px] tracking-[0.35em] text-[#C87D8A]/50 border border-[#C87D8A]/20 px-4 py-1.5 mb-6">
              {product.subtitle}
            </span>

            {/* Title */}
            <h1 className="reveal-item font-cormorant font-semibold text-4xl md:text-5xl text-[#D4AF37] leading-[1.15] tracking-wide mb-5">
              {product.title}
            </h1>

            {/* Price */}
            <div className="reveal-item flex items-center gap-4 mb-6">
              <span className="font-cormorant text-2xl text-[#D4AF37] font-medium tracking-wide">
                {product.price}
              </span>
              {product.oldPrice && (
                <>
                  <span className="font-arabic text-sm text-red-400/80 line-through tracking-wide">
                    {product.oldPrice}
                  </span>
                  <span className="font-arabic text-[10px] tracking-[0.15em] text-[#C87D8A]/70 bg-[#4B1E28]/30 border border-[#C87D8A]/20 px-2.5 py-1">
                    خصم حصري
                  </span>
                </>
              )}
            </div>

            {/* Thin divider */}
            <div className="reveal-item w-full h-px bg-white/[0.06] mb-8" />

            {/* Description */}
            <p className="reveal-item font-arabic font-light text-sm text-[#C87D8A]/70 leading-[2.2] tracking-[0.08em] max-w-sm mb-8">
              {product.description}
            </p>

            {/* ── Color Selector ── */}
            <div className="reveal-item mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-arabic text-sm tracking-[0.15em] text-white/70">
                  تدرجات اللون
                </span>
                <span className="font-arabic text-sm tracking-[0.1em] text-[#C87D8A]/80 font-medium">
                  {selectedColor.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      selectedColor.name === color.name
                        ? "border-[#D4AF37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* ──– Size Selector ── */}
            <div id="size-selector" className="reveal-item mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-arabic text-sm tracking-[0.15em] text-white/70">
                    المقاس المناسب
                  </span>
                  {showSizeError && (
                    <span className="font-arabic text-[10px] text-red-400 animate-pulse">
                      يرجى اختيار المقاس للمتابعة
                    </span>
                  )}
                </div>
                <button className="font-arabic text-xs tracking-[0.1em] text-[#D4AF37]/60 hover:text-[#D4AF37]/90 transition-colors duration-300 underline underline-offset-2">
                  دليل المقاسات
                </button>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeError(false);
                    }}
                    className={`font-arabic text-xs tracking-[0.1em] px-5 py-2.5 border transition-all duration-300 ${
                      selectedSize === size
                        ? "border-[#D4AF37] bg-[#4B1E28]/40 text-[#D4AF37]"
                        : showSizeError
                        ? "border-red-400/30 text-red-300/40 hover:border-red-400/50"
                        : "border-white/15 text-[#C87D8A]/60 hover:border-white/30 hover:text-[#C87D8A]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Quantity Counter ── */}
            <div className="reveal-item mb-10">
              <span className="font-arabic text-sm tracking-[0.15em] text-white/70 block mb-4">
                الكمية
              </span>
              <div className="flex items-center border border-white/15 w-32">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:bg-[#4B1E28]/20 transition-all duration-300 font-light text-lg"
                >
                  −
                </button>
                <span className="flex-1 text-center font-cormorant text-lg text-white/80">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:bg-[#4B1E28]/20 transition-all duration-300 font-light text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* ── CTA Button ── */}
            <div className="reveal-item flex flex-col gap-4 mb-10">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className="group relative flex items-center justify-center px-10 py-4 w-full max-w-sm bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_15px_rgba(75,30,40,0.5)] cursor-pointer transition-all duration-500 hover:border-[#D4AF37] animate-[pulse_3s_ease-in-out_infinite]"
              >
                <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 font-arabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-sm tracking-widest">
                  إضـافـة للـحـقـيـبـة
                </span>
              </button>
            </div>

            {/* ── Trust Badges ── */}
            <div className="reveal-item flex items-stretch justify-start gap-4 mb-10 pb-8 border-b border-white/[0.06]">
              {[
                { icon: Gift,   label: "تغليف فاخر",   sub: "صندوق هدية مميز" },
                { icon: Shield, label: "دفع آمن",       sub: "بروتوكول تشفير" },
                { icon: Truck,  label: "استرجاع ميسر", sub: "خلال ٧ أيام" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col items-center gap-3 border border-white/[0.08] py-5 px-3 bg-white/[0.01] hover:border-[#D4AF37]/20 transition-colors duration-500"
                >
                  <Icon className="w-8 h-8 text-[#D4AF37]/40" strokeWidth={1} />
                  <div className="text-center">
                    <p className="font-arabic text-[11px] tracking-[0.15em] text-[#C87D8A]/80">{label}</p>
                    <p className="font-arabic text-[9px] tracking-[0.1em] text-white/20 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Accordions ── */}
            <div className="reveal-item">
              <AccordionItem
                title="تفاصيل النسيج"
                content="مخمل إيطالي ١٠٠٪، مبطّن بالكامل بقماش الحرير الطبيعي. الوزن متوسط مناسب لجميع الفصول. التركيبة لا تسبب أي تحسيس ومريحة على البشرة الحساسة."
              />
              <AccordionItem
                title="دليل العناية"
                content="غسيل يدوي بماء فاتر فقط. لا يُدخل في الغسالة. يُنشر في الظل بعيداً عن أشعة الشمس المباشرة. الكَيّ من الداخل على درجة حرارة منخفضة."
              />
              <AccordionItem
                title="الشحن والاسترجاع"
                content="توصيل مجاني داخل المملكة خلال ٣-٥ أيام عمل. الاسترجاع المجاني مسموح خلال ٧ أيام من تاريخ الاستلام بشرط أن تكون القطعة بحالتها الأصلية."
              />
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════
          REVIEWS SECTION
      ══════════════════════════ */}
      <ReviewsSection />

      {/* ══════════════════════════
          RELATED PRODUCTS
      ══════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.05]" dir="rtl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="block font-arabic text-[9px] tracking-[0.4em] text-[#C87D8A]/50 mb-3">من مجموعة شغف</span>
            <h2 className="font-cormorant font-semibold text-3xl text-white/80 tracking-wide">أكملي أناقتك</h2>
          </div>
          <Link href="/products" className="font-arabic text-[10px] tracking-[0.25em] text-white/25 hover:text-[#D4AF37]/60 transition-colors duration-500">
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {RELATED.map((item, i) => (
            <Link key={item.id} href={`/products/${item.id}`} prefetch={false} className="group block">
              {/* Uniform aspect-[3/4] matching products page */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.03]">
                <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#D4AF37]/30 z-10 pointer-events-none" />
                <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#D4AF37]/30 z-10 pointer-events-none" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="absolute top-4 left-4 font-cormorant text-[10px] text-white/20 tracking-[0.3em] group-hover:text-[#D4AF37]/50 transition-colors duration-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-4 px-1 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-cormorant text-base leading-snug text-white group-hover:text-[#D4AF37]/90 transition-colors duration-500">{item.title}</h3>
                  <p className="font-arabic text-[9px] text-white/30 tracking-[0.1em] mt-0.5">{item.subtitle}</p>
                </div>
                <span className="flex-shrink-0 font-arabic text-[10px] text-[#D4AF37] bg-[#4B1E28]/30 border border-[#D4AF37]/20 px-2.5 py-1 whitespace-nowrap">
                  {item.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Mobile Fixed CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/92 backdrop-blur-xl p-4 border-t border-[#D4AF37]/20 z-40 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-cormorant text-base text-white leading-tight">{product.title}</p>
            <p className="font-arabic text-[10px] text-[#D4AF37]/60 tracking-[0.15em]">
              {product.price}
              {product.oldPrice && <span className="text-white/25 line-through mr-2">{product.oldPrice}</span>}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="group relative flex items-center justify-center px-7 py-3 bg-[#4B1E28]/40 border border-[#D4AF37]/50 overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#D4AF37]"
          >
            <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 font-arabic font-medium text-[#D4AF37] group-hover:text-black transition-colors duration-500 text-[11px] tracking-widest whitespace-nowrap">
              إضافة للحقيبة
            </span>
          </button>
        </div>
      </div>

    </main>
  );
}
