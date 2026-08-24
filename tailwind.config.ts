import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F2F0",
        warm: "#EEEAE3",
        clay: "#DDD6CE",
        stone: "#B0A99F",
        ink: "#111111",
        gold: "#9A7A36"
      },
      fontFamily: {
        // Every alias resolves to the same Futura-like face; see globals.css for
        // the weight rules that separate wordmark, headings, and copy.
        serif: ["var(--font-display)", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Helvetica Neue", "Arial", "sans-serif"],
        caps: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        logo: ["var(--font-display)", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"]
      },
      borderRadius: {
        panel: "6px"
      }
    }
  },
  plugins: [forms]
};

export default config;
