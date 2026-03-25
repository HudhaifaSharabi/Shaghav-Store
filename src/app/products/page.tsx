"use client";

import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";
import { ALL_PRODUCTS, type Category, type Product } from "@/lib/products";

import { LayoutGrid, Crown, MoonStar, Gem, Sparkles } from "lucide-react";

const CATEGORY_LINKS = [
  { id: "all",       label: "كافة المُقتنيات"  , icon: LayoutGrid },
  { id: "1-of-1",    label: "القطع اليتيمة ١/١", icon: Crown },
  { id: "dresses",   label: "سرديات الحرير"    , icon: Gem },
  { id: "sleepwear", label: "ليالي المُخمل"    , icon: MoonStar },
  { id: "lingerie",  label: "أناقة الخفاء"     , icon: MoonStar },
];

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product; index: number }) {
  return (
    <Link href={`/products/${product.id}`} prefetch={false} className="group flex flex-col cursor-pointer">
      {/* A. The Image & The Floating Glass Tag */}
      <div className="relative w-full aspect-[3/4] rounded-t-[40%] md:rounded-t-[45%] overflow-hidden bg-ANALIA-light-surface dark:bg-[#111] isolate [transform:translateZ(0)]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover w-full h-full transition-transform duration-[2000ms] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* THE TAG FIX (Bottom-Left Glassmorphism) */}
        {product.oldPrice && (
          <span className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-white/20 dark:border-white/10 text-ANALIA-burgundy dark:text-ANALIA-gold text-[10px] font-arabic tracking-widest px-4 py-2 rounded-full shadow-lg">
            خصم حصري
          </span>
        )}
      </div>

      {/* B. The Typography Layout (Clean & Hierarchical) */}
      <div className="flex flex-col items-center text-center mt-6 gap-2">
        <h2 className="font-arabic font-bold text-lg text-ANALIA-light-heading dark:text-ANALIA-dark-heading mt-5 group-hover:text-ANALIA-rose transition-colors">
          {product.title}
        </h2>
        <p className="font-arabic text-[11px] tracking-widest text-ANALIA-light-text/50 dark:text-ANALIA-dark-text/40 mt-1">
          {product.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="font-sans font-bold text-base text-ANALIA-light-heading dark:text-ANALIA-gold">
            {product.priceNum.toLocaleString("en-US")} ر.س
          </span>
          {product.oldPrice && (
            <span className="font-sans text-xs text-ANALIA-light-text/30 dark:text-ANALIA-dark-text/30 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (selectedCategory !== "all") {
      // In a real app, match category slugs. For now, match the exact string or roughly
      // We will match based on our current mock data mapping:
      const categoryMap: Record<string, string> = {
        "1-of-1": "القطع اليتيمة ١/١",
        "dresses": "سرديات الحرير",
        "sleepwear": "ليالي المخمل",
        "lingerie": "أناقة الخفاء"
      };
      const catName = categoryMap[selectedCategory];
      if (catName) {
        list = list.filter((p) => p.category === catName || p.category === selectedCategory);
      }
    }
    return list;
  }, [selectedCategory]);

  // Animate in whenever filtered list changes
  useGSAP(() => {
    const cards = gridRef.current?.querySelectorAll(".group.flex-col");
    if (!cards?.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.05,
    });
  }, { dependencies: [selectedCategory], scope: gridRef });

  return (
    <main className="min-h-screen bg-ANALIA-light-bg dark:bg-ANALIA-dark-bg transition-colors duration-700 pt-24 pb-24" dir="rtl">

      {/* 3. Mobile Category Navigation (Horizontal Fallback) */}
      <nav className="md:hidden sticky top-16 z-40 bg-ANALIA-light-bg/95 dark:bg-ANALIA-dark-bg/95 backdrop-blur-md py-4 border-b border-ANALIA-burgundy/10 dark:border-white/10 flex overflow-x-auto no-scrollbar gap-4 px-4 mb-6">
        {CATEGORY_LINKS.map(({ id, label, icon: Icon }) => {
          const isActive = selectedCategory === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`group flex items-center gap-2 px-4 py-2 rounded-2xl font-arabic text-sm tracking-widest transition-all duration-500 whitespace-nowrap ${
                isActive
                  ? "bg-ANALIA-burgundy dark:bg-[#2A1116] text-ANALIA-gold shadow-md"
                  : "text-ANALIA-light-text/60 dark:text-ANALIA-dark-text/60 hover:bg-ANALIA-burgundy/10 dark:hover:bg-white/5 hover:text-ANALIA-burgundy dark:hover:text-ANALIA-gold"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Wrapper */}
      <div className="flex flex-col md:flex-row-reverse max-w-[1800px] mx-auto px-4 md:px-8 gap-10 lg:gap-16">
        
        {/* 2. The Left Sidebar (Category Navigation - Desktop) */}
        <aside className="hidden md:flex flex-col w-[240px] lg:w-[280px] flex-shrink-0 sticky top-32 h-fit gap-6 bg-ANALIA-burgundy/5 dark:bg-white/[0.02] border border-ANALIA-burgundy/10 dark:border-white/5 p-6 rounded-[2rem] shadow-sm backdrop-blur-sm">
          <h2 className="font-arabic font-bold text-xl text-ANALIA-light-heading dark:text-ANALIA-dark-heading border-b border-ANALIA-burgundy/10 dark:border-white/10 pb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ANALIA-gold" />
            عوالم شـغـف
          </h2>
          <div className="flex flex-col gap-2">
            {CATEGORY_LINKS.map(({ id, label, icon: Icon }) => {
              const isActive = selectedCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-arabic text-sm tracking-widest transition-all duration-500 w-full text-right ${
                    isActive
                      ? "bg-ANALIA-burgundy dark:bg-[#2A1116] text-ANALIA-gold shadow-md scale-105"
                      : "text-ANALIA-light-text/60 dark:text-ANALIA-dark-text/60 hover:bg-ANALIA-burgundy/10 dark:hover:bg-white/5 hover:text-ANALIA-burgundy dark:hover:text-ANALIA-gold"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 4. The Product Grid (Left Side) */}
        <section className="flex-1 w-full" ref={gridRef}>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <span className="font-cormorant text-7xl text-ANALIA-light-text/10 dark:text-white/10 mb-6">✦</span>
              <p className="font-cormorant text-2xl text-ANALIA-light-text/40 dark:text-white/20 tracking-wide mb-2">
                لا توجد قطع هنا
              </p>
            </div>
          )}
        </section>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </main>
  );
}
