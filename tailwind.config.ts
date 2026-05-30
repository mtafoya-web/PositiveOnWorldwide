import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0a',
          light: '#f5f5f5',
          primary: '#111111',
          accent: '#4f46e5'
        }
      }
    },
  },
  plugins: [],
} satisfies Config

export default config
