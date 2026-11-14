/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7F0",
        pink: "#F3A6C8",
        purple: "#9878E8",
        ink: "#302630",
        muted: "#746673",
        border: "#EADFE7",
      },
      fontFamily: {
        sans: ["Poppins", "Tajawal", "system-ui", "sans-serif"],
        arabic: ["Tajawal", "Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(48, 38, 48, 0.06)",
        card: "0 12px 40px rgba(152, 120, 232, 0.12)",
      },
      borderRadius: {
        pill: "999px",
        "2.5xl": "1.25rem",
      },
      maxWidth: {
        content: "1120px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
