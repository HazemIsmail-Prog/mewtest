/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      boxShadow: {
        'neumorphic': '6px 6px 10px rgba(174, 174, 192, 0.6), -6px -6px 10px #ffffff',
      },
      colors: {
        primary: "#14b8a6",
        success: "#22c55e",
        danger: "#ef4444",
        // primary: "#1e293b",
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'], // Add the Cairo font family
        zain: ['Zain', 'sans-serif'], // Add the Cairo font family
        readex: ['Readex Pro', 'sans-serif'], // Add the Cairo font family
        noto: ['Noto Naskh Arabic', 'sans-serif'], // Add the Cairo font family
      },
    },
  },
  plugins: [],
};
