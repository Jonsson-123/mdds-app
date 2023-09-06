/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}", "./src/*.{html,js}"],

  theme: {
    extend: {
      colors: {
        gmmidnightgreen: "#133c4b",
        gmpictonblue: "#5facd0",
        gmcastletongreen: "#1c5935",
        gmbondiblue: "#098eb1",
        gmairforceblue: "#52872a0",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
