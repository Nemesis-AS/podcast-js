/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "border-red-700",
    "border-rose-700",
    {
      pattern: /(border|bg)-(emerald|pink|rose)-700/
    }
  ]
}

