import type { Config } from 'tailwindcss'

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geologica", "sans-serif"],
      }
    },
  },
  plugins: [require("@headlessui/tailwindcss"), require("daisyui"),require('tailwind-scrollbar')({ nocompatible: true }),require("tailwindcss-animate")],
  daisyui: {
    styled: true,
    themes: false,
    base: false,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
} satisfies Config;

