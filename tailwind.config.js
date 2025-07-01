module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geistvf', 'sans-serif'], // hier "geist" als Name für Tailwind-Klasse
      },
    },
  },
  plugins: [],
};
