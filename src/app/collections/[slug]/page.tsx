"use client";

import React, { useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
  { id: 1, slug: "sultana-dress", title: "فستان السلطانة", price: "٤,٥٠٠ ر.س", category: "dresses", img: "/images/sultana-dress.png" },
  { id: 2, slug: "velvet-robe", title: "رداء المخمل", price: "٣,٨٠٠ ر.س", category: "sleepwear", img: "/images/velvet-robe.png" },
  { id: 3, slug: "ruby-scarf", title: "وشاح الياقوت", price: "١,٢٠٠ ر.س", category: "dresses", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000" },
  { id: 4, slug: "silk-nightie", title: "قميص وسن", price: "٩٥٠ ر.س", category: "sleepwear", img: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1000" },
  { id: 5, slug: "lace-lingerie", title: "طقم الدانتيل الفرنسي", price: "١,٨٠٠ ر.س", category: "lingerie", img: "/images/lingerie-category.png" },
  { id: 6, slug: "evening-gown", title: "فستان السهرة الملكي", price: "٥,٢٠٠ ر.س", category: "dresses", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1000" },
  // More duplicates for pagination demo
  { id: 7, slug: "d-7", title: "فستان الياسمين", price: "٣,١٠٠ ر.س", category: "dresses", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000" },
  { id: 8, slug: "s-8", title: "رداء المسك", price: "٢,٧٠٠ ر.س", category: "sleepwear", img: "/images/luxury-sleepwear.png" },
  { id: 9, slug: "l-9", title: "بادي الحرير", price: "٨٠٠ ر.س", category: "lingerie", img: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=1000" },
];

const CATEGORY_MAP: Record<string, { title: string; desc: string }> = {
  dresses: { title: "فساتين السهرة", desc: "تصاميم تعانق تفاصيلكِ لتبرز أنوثتكِ الطاغية بمزيج من الفخامة والعصرنة." },
  sleepwear: { title: "ملابس النوم", desc: "نعومة تلامس خيالكِ.. قطع صُممت لتمنحكِ ليلة هادئة بلمسات ملكية." },
  lingerie: { title: "مجموعة اللانجري", desc: "ثقة لا تحتاج لبرهان، تفاصيل رقيقة تُحتفي بجمالكِ الخاص." },
};

// ─── Collection Page ──────────────────────────────────────────────────────────

export default function CollectionPage() {
  const { slug } = useParams();
  const categorySlug = (Array.isArray(slug) ? slug[0] : slug) || "";
  const categoryInfo = categorySlug ? (CATEGORY_MAP[categorySlug] || { title: "المجموعة", desc: "استكشفي تشكيلة شغف الحصرية." }) : { title: "المجموعة", desc: "استكشفي تشكيلة شغف الحصرية." };

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => p.category === categorySlug);
    
    if (searchQuery) {
      result = result.filter(p => p.title.includes(searchQuery));
    }

    if (sortOption === "price-asc") {
       result.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, "")));
    } else if (sortOption === "price-desc") {
       result.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, "")));
    }

    return result;
  }, [categorySlug, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useGSAP(() => {
    // Staggered reveal for product cards
    gsap.fromTo(".product-card-reveal",
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".product-grid",
          start: "top 85%",
        }
      }
    );
  }, { scope: containerRef, dependencies: [currentItems] });

  return (
    <main ref={containerRef} className="bg-[#0A0A0A] min-h-screen pt-[120px]" dir="rtl">
      
      {/* ── Hero Section ── */}
      <section className="h-[40vh] md:h-[50vh] flex flex-col items-center justify-center text-center relative bg-gradient-to-b from-[#0A0A0A] to-[#4B1E28]/20 px-6">
        <h1 className="font-arabic text-4xl md:text-7xl text-[#D4AF37] font-bold drop-shadow-2xl mb-6">
          {categoryInfo.title}
        </h1>
        <p className="font-arabic text-[#C87D8A] text-base md:text-xl max-w-2xl leading-relaxed opacity-80">
          {categoryInfo.desc}
        </p>
      </section>

      {/* ── Utility Bar ── */}
      <div className="w-full px-6 md:px-[10vw] py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#4B1E28]/30 sticky top-[120px] bg-[#0A0A0A]/95 backdrop-blur-md z-40">
        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="ابحثي في هذه المجموعة..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-[#4B1E28] focus:border-[#D4AF37] text-white text-sm py-2 pr-8 outline-none w-full transition-all font-arabic placeholder:text-white/20"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <span className="font-arabic text-[10px] uppercase tracking-widest text-[#C87D8A] opacity-50">ترتيب حسب:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent text-[#C87D8A] hover:text-[#D4AF37] text-sm focus:outline-none cursor-pointer font-arabic transition-colors"
          >
            <option className="bg-[#111]" value="newest">الأحدث</option>
            <option className="bg-[#111]" value="price-asc">الأقل سعراً</option>
            <option className="bg-[#111]" value="price-desc">الأعلى سعراً</option>
          </select>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="product-grid px-6 md:px-[10vw] py-20 bg-[#0A0A0A]">
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
            {currentItems.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="product-card-reveal group block">
                <div className="relative aspect-[3/4.2] rounded-t-[20vw] md:rounded-t-[8vw] overflow-hidden bg-[#111] shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_50px_rgba(75,30,40,0.3)]">
                  <img 
                    src={product.img} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Quick Add Overlay (Subtle) */}
                  <div className="absolute bottom-0 inset-x-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/40 backdrop-blur-sm border-t border-white/10 flex justify-center">
                    <span className="font-tajawal text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase">عرض المقتنية</span>
                  </div>
                </div>
                
                <div className="mt-8 text-center md:text-right px-2">
                  <h3 className="font-arabic text-[#D4AF37] text-xl md:text-2xl font-medium group-hover:tracking-wider transition-all duration-500">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                    <div className="h-px w-8 bg-[#4B1E28]/40" />
                    <span className="font-montserrat text-white/50 text-sm tracking-widest">{product.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <p className="font-arabic text-[#C87D8A] text-lg opacity-50 italic">عذراً، لم نجد ما تبحثين عنه في هذه المجموعة حالياً.</p>
          </div>
        )}
      </section>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 py-20 border-t border-white/5 mx-[10vw]">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className={`p-2 transition-colors ${currentPage === 1 ? 'text-white/10' : 'text-[#D4AF37] hover:text-white'}`}
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex gap-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`font-montserrat text-sm transition-all pb-1 border-b ${
                  currentPage === i + 1 
                    ? 'text-[#D4AF37] border-[#D4AF37]' 
                    : 'text-[#C87D8A]/40 border-transparent hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className={`p-2 transition-colors ${currentPage === totalPages ? 'text-white/10' : 'text-[#D4AF37] hover:text-white'}`}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      )}

      {/* Back to top / collections */}
      <div className="pb-24 text-center">
        <Link href="/products" className="inline-flex items-center gap-3 text-[#C87D8A]/50 hover:text-[#D4AF37] transition-colors font-arabic text-xs tracking-widest uppercase">
          <ArrowLeft size={14} />
          <span>العودة لجميع الأقسام</span>
        </Link>
      </div>

    </main>
  );
}
