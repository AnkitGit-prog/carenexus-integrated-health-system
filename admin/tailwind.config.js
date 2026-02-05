/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // ← yaha sab JS/TS/JSX/TSX files include kiya
  ],
  theme: {
    extend: {
      colors:{
        'primary': "#5F6FFF"
      }
    },
  },
  plugins: [],
}
