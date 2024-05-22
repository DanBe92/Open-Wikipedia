/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ejs}",
    "./public/**/*.{html,js,ejs}",
    "./views/**/*.{html,js,ejs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],

}

