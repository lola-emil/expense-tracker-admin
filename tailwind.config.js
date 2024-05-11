/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/**/*.js",
    "./views/**/*.{ejs,html}"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "business"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
}

