/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/**/*.js",
    "./views/**/*.{ejs,html}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
}

