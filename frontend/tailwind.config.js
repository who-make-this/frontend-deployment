/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        pretendard: ["PretendardVariable", "ui-sans-serif", "system-ui", "sans-serif"],
        museum: ["MuseumClassic", "sans-serif"],
        noto: ['"Noto Serif KR"', 'serif'],
      },
      
    },
  },
  plugins: [],
};
