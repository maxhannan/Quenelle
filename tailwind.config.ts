import type { Config } from 'tailwindcss'


export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "475px",
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        sans: ["Geologica", "sans-serif"],
      },
      gridTemplateColumns: {
        sticky: "repeat(auto-fill, minmax(350px, 1fr))",
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

