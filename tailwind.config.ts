import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // CRITICAL: Must be "class"
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Core (Used in both modes for accents)
        "ANALIA-burgundy": "#4B1E28",
        "ANALIA-gold": "#D4AF37",
        "ANALIA-rose": "#C87D8A",
        
        // Dark Mode (Night Boutique)
        "ANALIA-dark-bg": "#0A0A0A",
        "ANALIA-dark-surface": "#141414",
        "ANALIA-dark-text": "#FAF8F5",
        "ANALIA-dark-heading": "#D4AF37", // Gold glows beautifully on black
        
        // Light Mode (Daylight Atelier) - CRITICAL UPDATE
        "ANALIA-light-bg": "#FCFBF9", // Ultra-clean, warm luxury off-white
        "ANALIA-light-surface": "#FFFFFF", // Pure white for cards to pop
        "ANALIA-light-text": "#332225", // Deep, rich dark-brown/charcoal for reading
        "ANALIA-light-heading": "#4B1E28", // Solid Burgundy for Headings (NOT GOLD)
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)"],
        montserrat: ["var(--font-montserrat)"],
        arabic: ["var(--font-el-messiri)"],
        ANALIAArabic: ["var(--font-el-messiri)"],
        feminine: ["var(--font-amiri)"],
      },
    },
  },
  plugins: [],
};
export default config;
