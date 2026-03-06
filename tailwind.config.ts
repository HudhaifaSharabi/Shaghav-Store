import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ANALIA-burgundy": "#4B1E28",
        "ANALIA-black": "#0A0A0A",
        "ANALIA-gold": "#D4AF37",
        "ANALIA-rose": "#C87D8A",
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
