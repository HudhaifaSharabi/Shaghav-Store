"use client";

import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import { ALL_PRODUCTS, type Category, type Product } from "@/lib/products";


const FILTERS: { key: Category; label: string }[] = [
  { key: "all",       label: "كافة المُقتنيات" },
  { key: "1-of-1",   label: "القطع اليتيمة ١/١" },
  { key: "dresses",  label: "سرديات الحرير" },
  { key: "sleepwear",label: "ليالي المُخمل" },
  { key: "lingerie", label: "أناقة الخفاء" },
];

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <Link href={`/products/${product.id}`} prefetch={false} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.03]">
        {/* Corner decorators */}
        <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#D4AF37]/30 z-10 pointer-events-none" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#D4AF37]/30 z-10 pointer-events-none" />

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
        />

        {/* Dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Sequential number */}
        <span className="absolute top-4 left-4 font-cormorant text-[10px] text-white/20 tracking-[0.3em] group-hover:text-SHAGHAV-gold/50 transition-colors duration-500">
          {num}
        </span>

        {/* Category badge — shows on hover */}
        <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="font-SHAGHAVArabic text-[9px] tracking-[0.15em] text-SHAGHAV-gold bg-black/60 backdrop-blur-sm border border-SHAGHAV-gold/30 px-3 py-1">
            {product.subtitle}
          </span>
        </div>

        {/* CTA strip — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="font-SHAGHAVArabic text-[10px] tracking-[0.2em] text-white/70">
            استفسري عن القطعة ←
          </span>
        </div>
      </div>

      {/* Info block — always visible, clearly readable */}
      <div className="mt-4 px-1 flex items-start justify-between gap-2">
        <div>
          <h2 className="font-cormorant text-lg leading-snug text-white group-hover:text-SHAGHAV-gold/90 transition-colors duration-500">
            {product.title}
          </h2>
          <p className="font-SHAGHAVArabic text-[10px] text-white/30 tracking-[0.1em] mt-0.5">
            {product.subtitle}
          </p>
        </div>
        {/* Price – prominent gold pill */}
        <div className="flex-shrink-0 mt-0.5">
          <span className="font-SHAGHAVArabic text-xs text-SHAGHAV-gold bg-[#4B1E28]/30 border border-[#D4AF37]/20 px-3 py-1 whitespace-nowrap">
            {product.price}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const gridRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (activeFilter !== "all") list = list.filter((p) => p.category === activeFilter);
    if (query.trim()) list = list.filter((p) => p.title.includes(query.trim()) || p.subtitle.includes(query.trim()));
    if (sort === "asc") list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "desc") list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    return list;
  }, [activeFilter, query, sort]);

  // Animate out → set filter → animate in
  const changeFilter = (key: Category) => {
    if (key === activeFilter || isAnimating.current) return;
    isAnimating.current = true;
    const cards = gridRef.current?.querySelectorAll(".product-card");
    gsap.to(cards ?? [], {
      opacity: 0, y: 16, duration: 0.3, ease: "power2.in", stagger: 0.03,
      onComplete: () => { setActiveFilter(key); isAnimating.current = false; },
    });
  };

  // Animate in whenever filtered list changes
  useGSAP(() => {
    const cards = gridRef.current?.querySelectorAll(".product-card");
    if (!cards?.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07,
    });
  }, { dependencies: [activeFilter, query, sort], scope: gridRef });

  return (
    <main className="min-h-screen bg-[#050305] text-white selection:bg-SHAGHAV-gold selection:text-black" dir="rtl">

      {/* ── Page Header ── */}
      <div className="relative pt-28 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(75,30,40,0.3)_0%,_transparent_70%)] pointer-events-none" />
        <span className="block font-SHAGHAVArabic text-[9px] tracking-[0.5em] text-[#C87D8A] mb-5 uppercase">
          معرض شَغَف
        </span>
        <h1 className="font-cormorant font-semibold text-5xl md:text-7xl text-white tracking-wide">
          المُقتنيات
        </h1>
        <p className="font-SHAGHAVArabic font-light text-xs text-white/35 tracking-[0.2em] mt-4 max-w-xs mx-auto leading-relaxed">
          كل قطعة نسجناها لتصبح جزءاً من قصتكِ.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
          <div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
        </div>
      </div>

      {/* ── Sticky Filter + Search Bar ── */}
      <div className="sticky top-0 z-40 bg-[#050305]/95 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">

          {/* Filter tabs */}
          <nav className="flex items-center justify-start md:justify-center gap-0 overflow-x-auto no-scrollbar border-b border-white/[0.04]">
            {FILTERS.map(({ key, label }) => {
              const isActive = activeFilter === key;
              return (
                <button key={key} onClick={() => changeFilter(key)}
                  className={`relative flex-shrink-0 font-SHAGHAVArabic text-[11px] tracking-[0.12em] whitespace-nowrap px-5 py-4 transition-colors duration-500 ${isActive ? "text-SHAGHAV-gold" : "text-white/35 hover:text-white/65"}`}
                >
                  {label}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-SHAGHAV-gold transition-transform duration-500 origin-right ${isActive ? "scale-x-100 origin-left" : "scale-x-0"}`} />
                </button>
              );
            })}
          </nav>

          {/* Search + Sort row */}
          <div className="flex items-center gap-3 py-3">
            {/* Search box */}
            <div className="flex-1 relative">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحثي عن قطعة..."
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-[11px] font-SHAGHAVArabic tracking-[0.1em] placeholder-white/25 pr-9 pl-4 py-2.5 outline-none focus:border-SHAGHAV-gold/40 transition-colors duration-300"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-white/[0.04] border border-white/[0.08] text-white/50 text-[10px] font-SHAGHAVArabic tracking-[0.1em] px-3 py-2.5 outline-none focus:border-SHAGHAV-gold/40 transition-colors duration-300 cursor-pointer"
            >
              <option value="default">الترتيب</option>
              <option value="asc">السعر: الأقل أولاً</option>
              <option value="desc">السعر: الأعلى أولاً</option>
            </select>

            {/* Count badge */}
            <span className="flex-shrink-0 font-SHAGHAVArabic text-[10px] text-white/25 tracking-[0.15em] hidden sm:block">
              {filtered.length} قطعة
            </span>
          </div>

        </div>
      </div>

      {/* ── Product Grid ── */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-32">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <span className="font-cormorant text-7xl text-white/10 mb-6">✦</span>
            <p className="font-cormorant text-2xl text-white/20 tracking-wide mb-2">
              {query ? `لا نتائج لـ "${query}"` : "لا توجد قطع هنا"}
            </p>
            <p className="font-SHAGHAVArabic text-[11px] text-white/20 tracking-[0.2em]">
              جربي تصنيفاً آخر أو امسحي البحث
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-white/[0.05] py-10 text-center">
        <p className="font-SHAGHAVArabic text-[9px] text-white/15 tracking-[0.35em]">
          © شَغَف · كل قطعة تُروى قصتها بعنايةٍ واحترام
        </p>
        <Link href="/" className="inline-block mt-3 font-SHAGHAVArabic text-[9px] tracking-[0.3em] text-white/25 hover:text-SHAGHAV-gold/50 transition-colors duration-500">
          ← العودة للمعرض
        </Link>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </main>
  );
}
