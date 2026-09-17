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
      },
      animation: {
        "river-flow": "flow 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
