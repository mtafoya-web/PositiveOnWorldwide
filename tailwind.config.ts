import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        chalk: "#f7f7f2",
        graphite: "#232323",
        limeflash: "#d8ff3e",
        fog: "#e8e8df"
      },
      boxShadow: {
        lift: "0 18px 60px rgba(17, 17, 17, 0.16)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        gridPulse: {
          "0%, 100%": { opacity: "0.24" },
          "50%": { opacity: "0.48" }
        }
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "grid-pulse": "gridPulse 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
