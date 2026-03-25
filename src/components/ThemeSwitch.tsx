"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * A minimalist, ultra-luxury Theme Toggle Switch for the Shaghaf brand.
 * Corrected for hydration safety and RTL-compatible sliding.
 */
export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted || !theme) {
    return (
      <div className="w-12 h-6 rounded-full border border-ANALIA-burgundy/10 dark:border-ANALIA-gold/10" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="relative w-14 h-7 rounded-full bg-transparent border border-ANALIA-burgundy/30 dark:border-ANALIA-gold/30 transition-all duration-500 flex items-center px-1 cursor-pointer group hover:border-ANALIA-burgundy dark:hover:border-ANALIA-gold overflow-hidden"
    >
      <div
        className={`w-5 h-5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.26,1.55)] shadow-md flex items-center justify-center ${
          isDark 
            ? "bg-ANALIA-burgundy ltr:translate-x-7 rtl:-translate-x-7" 
            : "bg-ANALIA-gold ltr:translate-x-0 rtl:translate-x-0"
        }`}
      >
        {isDark ? (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-ANALIA-gold/80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-3.617 0-6.935-1.88-8.862-4.725m16.724-7.75c-.51-.51-1.1-1.02-1.77-1.487m-1.77-1.487A9.718 9.718 0 0012 2.25c-5.34 0-9.718 4.08-9.718 9.125a9.718 9.718 0 009.718 9.125m0-18.25c.51-.51 1.1-1.02 1.77-1.487m-1.77-1.487A9.718 9.718 0 0112 2.25c5.34 0 9.718 4.08 9.718 9.125a9.718 9.718 0 01-9.718 9.125" />
          </svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white/80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12H5.25m-.386-6.364l1.591 1.591M12 12a3 3 0 110-6 3 3 0 010 6z" />
          </svg>
        )}
      </div>
      <span 
        className={`absolute inset-0 rounded-full transition-opacity duration-1000 blur-md pointer-events-none ${
          isDark ? "opacity-0" : "bg-ANALIA-gold/20 opacity-100"
        }`} 
      />
    </button>
  );
}
