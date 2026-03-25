"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/layout/Footer";

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useAppStore((s) => s.cartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 bg-[#D4AF37] rounded-full ring-2 ring-[#0A0A0A] flex items-center justify-center">
      <span className="font-arabic text-[9px] font-bold text-black leading-none">
        {count.toLocaleString("ar-SA")}
      </span>
    </span>
  );
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      {/* ── Main Content ── */}
      <div className="pt-[140px]">{children}</div>

      <Footer />
    </>
  );
}
