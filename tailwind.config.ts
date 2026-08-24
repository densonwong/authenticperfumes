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
        // `serif` is what every heading in the storefront already asks for, so
        // it maps to the display face rather than an actual serif stack.
        serif: ["var(--font-display)", "Didot", "Times New Roman", "serif"],
        display: ["var(--font-display)", "Didot", "Times New Roman", "serif"],
        caps: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        logo: ["var(--font-display)", "Didot", "Times New Roman", "serif"],
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
