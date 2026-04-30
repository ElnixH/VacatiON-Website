/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'v-navy': '#191D30',
        'v-stone': '#A18E7E',
        'v-silver': '#A9ABB1',
      },
      fontFamily: {
        // Your primary display font
        'display': ['MarschelPrinted', 'serif'],
        // Your new clean secondary font
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}