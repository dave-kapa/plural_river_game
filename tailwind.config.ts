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
        // Superficies de lectura editoriales (crema cálido opaco de alto contraste)
        parchment: {
          50: "#fdfbf7",
          100: "#faf6ee",
          200: "#f3ede0",
          300: "#e8dec9",
          400: "#d5c7ab",
          ink: "#14241d",
          muted: "#3d5248",
        },
        forest: {
          950: "#071510",
          900: "#0b2019",
          850: "#0e2820",
          800: "#143d32",
          700: "#1d5243",
        },
        jade: {
          600: "#1a5c4a",
          500: "#2d8a6e",
          400: "#3db892",
          300: "#5fcdaa",
          200: "#9ee6cf",
        },
        water: {
          950: "#072028",
          900: "#0c3542",
          700: "#15586c",
          500: "#1e88a8",
          400: "#26b4d6",
          300: "#5ce1e6",
          100: "#e0f7fa",
        },
        solar: {
          600: "#b88326",
          500: "#d49b35",
          400: "#e5a83b",
          300: "#f4c05a",
          100: "#fef3d6",
        },
        coral: {
          600: "#be472f",
          500: "#d65a40",
          400: "#e06d53",
          300: "#ed8d76",
          100: "#fde8e3",
        },
        canopy: {
          950: "#0b1510",
          900: "#10231b",
          800: "#18362a",
          700: "#224c3b",
          600: "#2f6750",
          500: "#418568",
        },
        river: {
          900: "#0f2b2d",
          800: "#184144",
          700: "#245a5e",
          600: "#32777c",
          500: "#45969c",
          400: "#65b5ba",
          200: "#b2e2e4",
          100: "#e0f4f5",
          50: "#f0fafb",
        },
        earth: {
          50: "#faf8f4",
          100: "#f3efe6",
          200: "#e5ded0",
          300: "#cfc3ad",
          600: "#756a56",
          800: "#3d3529",
          900: "#241f17",
        },
        editorial: {
          ink: "#121b16",
          muted: "#4e6056",
          accent: "#b87333", // copper / terracotta
          gold: "#cda049",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      keyframes: {
        flow: {
          "0%, 100%": { strokeDashoffset: "0" },
          "50%": { strokeDashoffset: "40" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        "river-flow": "flow 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
